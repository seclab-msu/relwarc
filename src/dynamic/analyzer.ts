import { DynamicAnalyzerBackend } from '../backend';
import type { HeadlessBot } from '../browser/headless-bot';

const dynamicEvaled = 'dynamically evaled code from script ';
const fromNewFunction = 'code from new Function constructor from script ';
const fromInlineHandler = 'code from inline event handler described at ';

export interface BackendNewScriptData {
    source: string,
    startLine: number,
    url: string,
    introductionType: string,
    introductionScriptURL: string
}

export type BackendNewScriptCallback = (data: BackendNewScriptData) => void;

export interface DynamicAnalyzerBackend {
    newScriptCallback: BackendNewScriptCallback | null;
    addWindow(bot: HeadlessBot): Promise<void>;
    close(): Promise<void>;
}

export class DynamicAnalyzer {
    newScriptCallback:
        | ((source: string, startLine: number, url: string) => void)
        | null;

    private backend: DynamicAnalyzerBackend;

    constructor() {
        this.backend = new DynamicAnalyzerBackend();
        this.newScriptCallback = null;
    }

    handleNewScript({
        source,
        startLine,
        url,
        introductionType,
        introductionScriptURL
    }: BackendNewScriptData): void {
        if (this.newScriptCallback) {
            if (introductionType === 'eval') {
                url = dynamicEvaled + introductionScriptURL;
            } else if (introductionType === 'Function') {
                url = fromNewFunction + introductionScriptURL;
            } else if (introductionType === 'eventHandler') {
                url = fromInlineHandler + url;
            }

            this.newScriptCallback(source, startLine, url);
        }
    }

    async addWindow(bot: HeadlessBot): Promise<void> {
        this.backend.newScriptCallback = this.handleNewScript.bind(this);
        await this.backend.addWindow(bot);
    }

    async close(): Promise<void> {
        await this.backend.close();
    }
}
