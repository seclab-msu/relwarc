import * as puppeteer from 'puppeteer';

import type { HeadlessBot as GenericHeadlessBot } from '../../browser/headless-bot';
import type { StackFrame } from '../../browser/stack-frame';
import { HAR, BadURLError, headersFromMap } from '../../har';
import { DynamicDEPMiner as GenericDynamicDEPMiner } from '../../dynamic-deps';

import { HeadlessBot } from './headless-bot';

import { log } from '../../logging';

import { decodeLoadType } from './decode-load-type';

// TODO: deduplicate this with Slimer's DynamicDEPMiner and minicrawler

export class DynamicDEPMiner implements GenericDynamicDEPMiner {
    private readonly deps: HAR[];
    private unsubscribe: (() => void) | null;
    private readonly onlyJSDynamicDEPs: boolean;
    private readonly recordRequestStackTraces: boolean;

    constructor(
        bot: GenericHeadlessBot,
        onlyJSDynamicDEPs: boolean,
        recordRequestStackTraces: boolean
    ) {
        this.deps = [];

        if (!(bot instanceof HeadlessBot)) {
            throw new Error('Only Chrome\'s HeadlessBot is supported here');
        }

        this.onlyJSDynamicDEPs = onlyJSDynamicDEPs;
        this.recordRequestStackTraces = recordRequestStackTraces;

        const requestCallback = this.requestCallback.bind(this);

        bot.requestCallback = requestCallback;
        this.unsubscribe = () => {
            bot.requestCallback = null;
        };
    }

    private requestCallback(request: puppeteer.HTTPRequest) {
        const type = request.resourceType();

        if (this.onlyJSDynamicDEPs && (type !== 'xhr' && type !== 'fetch')) {
            return;
        }

        const url = request.url();

        let har;

        try {
            har = new HAR(url);
        } catch (err) {
            if (err instanceof BadURLError) {
                log('warning: BadURLError exception at ' + url);
                return;
            } else {
                throw err;
            }
        }

        har.headers = headersFromMap(request.headers());
        har.method = request.method();

        har.initiator = { type: decodeLoadType(type) };

        const initiator = request.initiator();
        const stack = initiator.stack;

        if (this.recordRequestStackTraces && stack) {
            har.initiator.stack = this.convertStack(stack);
        }

        const postData = request.postData();

        if (postData) {
            har.setPostData(postData, false);
        }

        this.deps.push(har);
    }

    private convertStack(
        stack: puppeteer.Protocol.Runtime.StackTrace
    ): StackFrame[] {
        return stack.callFrames.map(frame => ({
            name: frame.functionName || null, // for the same format with SlimerJS
            lineNumber: frame.lineNumber,
            columnNumber: frame.columnNumber,
            sourceLine: String(frame.lineNumber), // TODO this might contain some pretty descr, not just a number
            pretty: frame.functionName + '@' + frame.url + ':' + String(frame.lineNumber + 1) + ':' + String(frame.columnNumber + 1),
            fileURI: frame.url
        }));
    }

    getDEPs(): HAR[] {
        return this.deps;
    }
    close() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
}
