import type { HeadlessBot as GenericHeadlessBot } from '../../../../browser/headless-bot';
import { HeadlessBot } from '../browser/headless-bot';
import { getWrappedWindow } from '../utils/window';
import type {
    DynamicAnalyzerBackend as GenericDynamicAnalyzerBackend,
    BackendNewScriptCallback as NewScriptCallback
} from '../../../../dynamic/analyzer';

declare class Debugger {
    constructor(win: object);

    enabled: boolean;

    onNewScript: (script: Script) => void;
    removeAllDebuggees(): void;
}

require('./debugger').addDebuggerToGlobal(global);

interface Source {
    text: string;
    introductionType: string;
    introductionScript: Script;
}

interface Script {
    source: Source;
    startLine: number;
    url: string;
}

export class DynamicAnalyzerBackend implements GenericDynamicAnalyzerBackend {
    newScriptCallback: NewScriptCallback | null;

    private dbg: Debugger | null;

    constructor() {
        this.dbg = null;
        this.newScriptCallback = null;
    }

    async addWindow(bot: GenericHeadlessBot): Promise<void> {
        if (!(bot instanceof HeadlessBot)) {
            throw new Error('Only Slimer\'s HeadlessBot is supported here');
        }

        const dbg = new Debugger(getWrappedWindow(bot.webpage));

        dbg.onNewScript = (script: Script): void => {
            if (this.newScriptCallback) {
                this.newScriptCallback({
                    source: script.source.text,
                    startLine: script.startLine,
                    url: script.url,
                    introductionType: script.source.introductionType,
                    introductionScriptURL: script.source.introductionScript?.url
                });
            }
        };

        this.dbg = dbg;
    }

    async close(): Promise<void> {
        if (this.dbg === null) {
            return;
        }

        this.dbg.removeAllDebuggees();
        this.dbg.enabled = false;
        this.dbg = null;
    }
}
