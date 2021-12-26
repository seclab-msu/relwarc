import * as puppeteer from 'puppeteer';

import type { HeadlessBot as GenericHeadlessBot } from '../../browser/headless-bot';
import type {
    DynamicAnalyzerBackend as GenericDynamicAnalyzerBackend,
    BackendNewScriptCallback as NewScriptCallback
} from '../../dynamic/analyzer';

import { isSuperset } from '../../utils/common';

import { HeadlessBot } from './headless-bot';

import { log } from '../../logging';

const internalScriptURLPrefixes = [
    'pptr://',
    'extensions::',
    'chrome-extension://'
];

function determineIntroductionType(
    url: string,
    source: string,
    bot: HeadlessBot
): string {
    if (url === '') {
        if (source.startsWith('(function anonymous')) {
            return 'Function';
        }
        return 'eval';
    }
    const page = bot.getPage();
    if (page === null) {
        throw new Error('no page');
    }
    if (url === page.url()) {
        return 'script-or-event-handler';
    }
    return 'scriptElement';
}

export class DynamicAnalyzerBackend implements GenericDynamicAnalyzerBackend {
    newScriptCallback: NewScriptCallback | null;

    private client: puppeteer.CDPSession | null;
    private readonly seenScripts: Set<string>;
    private readonly scriptUpdateCallbacks: Array<() => void>;
    private active: boolean;

    constructor() {
        this.newScriptCallback = null;
        this.client = null;
        this.seenScripts = new Set();
        this.scriptUpdateCallbacks = [];
        this.active = false;
    }
    async addWindow(bot: GenericHeadlessBot): Promise<void> {
        if (!(bot instanceof HeadlessBot)) {
            throw new Error('Only Chrome\'s HeadlessBot is supported here');
        }
        const page = bot.getPage();
        if (page === null) {
            throw new Error('DynamicAnalyzerBackend: bot has no page');
        }
        bot.waitForScriptsCallback = this.waitForScripts.bind(this);
        const client = await page.target().createCDPSession();
        this.client = client;
        await client.send('Debugger.enable');

        const cb = async ({ scriptId, url, startLine }) => {
            if (internalScriptURLPrefixes.some(e => url.startsWith(e))) {
                return;
            }
            if (!this.active || client !== this.client) {
                // already closed
                return;
            }
            if (this.newScriptCallback) {
                let scriptSource: string;
                try {
                    scriptSource = await this.getScriptSource(scriptId);
                } catch (e) {
                    log(`Error while getting script source: ${e}`);
                    return;
                }
                const introductionType = determineIntroductionType(
                    url,
                    scriptSource,
                    bot
                );

                this.newScriptCallback({
                    source: scriptSource,
                    startLine,
                    url,
                    introductionType,
                    introductionScriptURL: 'unimplemented'
                });
                this.seenScripts.add(scriptSource);
                this.scriptUpdateCallbacks.concat().forEach(updCb => updCb());
            }
        };

        this.active = true;
        client.on('Debugger.scriptParsed', cb);
    }
    private waitForNewScript(): Promise<void> {
        return new Promise(resolve => {
            const cb = () => {
                const myIndex = this.scriptUpdateCallbacks.indexOf(cb);
                this.scriptUpdateCallbacks.splice(myIndex, 1);
                resolve();
            };
            this.scriptUpdateCallbacks.push(cb);
        });
    }
    async waitForScripts(scripts: string[]): Promise<void> { // TODO: add tests for this
        const wantScripts = new Set(scripts);

        /* eslint no-constant-condition: ["error", { "checkLoops": false }]*/

        while (true) {
            if (isSuperset(this.seenScripts, wantScripts)) {
                return;
            }
            await this.waitForNewScript();
        }
    }
    private async getScriptSource(
        scriptId: puppeteer.Protocol.Runtime.ScriptId
    ): Promise<string> {
        if (this.client === null) {
            throw new Error('Client is null');
        }
        const { scriptSource } = await this.client.send(
            'Debugger.getScriptSource',
            { scriptId }
        );
        return scriptSource;
    }
    async close(): Promise<void> {
        this.active = false;
        if (this.client !== null) {
            const client = this.client;
            this.client = null;
            await client.detach();
            this.client = null;
        }
    }
}
