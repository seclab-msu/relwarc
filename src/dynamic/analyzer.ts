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
    addWindow(bot: HeadlessBot): PromiseLike<void>;
    close(): PromiseLike<void>;
}

type NewScriptCallback = (
    source: string,
    startLine: number,
    url: string,
    type: string
) => void;

export class DynamicAnalyzer {
    newScriptCallback: NewScriptCallback | null;

    private backend: DynamicAnalyzerBackend;

    constructor() {
        this.backend = new DynamicAnalyzerBackend();
        this.newScriptCallback = null;
    }

    static adjustURL(
        url: string,
        introductionType: string,
        introductionScriptURL: string
    ) {
        if (introductionType === 'eval') {
            url = dynamicEvaled + introductionScriptURL;
        } else if (introductionType === 'Function') {
            url = fromNewFunction + introductionScriptURL;
        } else if (introductionType === 'eventHandler') {
            url = fromInlineHandler + url;
        }
        return url;
    }

    handleNewScript({
        source,
        startLine,
        url,
        introductionType,
        introductionScriptURL
    }: BackendNewScriptData): void {
        if (this.newScriptCallback) {
            url = DynamicAnalyzer.adjustURL(
                url,
                introductionType,
                introductionScriptURL
            );
            this.newScriptCallback(source, startLine, url, introductionType);
        }
    }

    addWindow(bot: HeadlessBot): PromiseLike<void> {
        this.backend.newScriptCallback = this.handleNewScript.bind(this);
        return this.backend.addWindow(bot);
    }

    close(): PromiseLike<void> {
        return this.backend.close();
    }
}
