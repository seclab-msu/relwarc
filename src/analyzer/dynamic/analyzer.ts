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

const dynamicEvaled = 'dynamically evaled code from script ';

export class DynamicAnalyzer {
    newScriptCallback: ((
        source: string,
        startLine: number,
        url: string) => void
    ) | null;

    private dbg: Debugger | null;

    constructor() {
        this.dbg = null;
        this.newScriptCallback = null;
    }

    addWindow(win: object): void {
        const dbg = new Debugger(win);

        dbg.onNewScript = (script: Script): void => {
            if (this.newScriptCallback) {
                let url = script.url;
                if (script.source.introductionType === 'eval') {
                    url = dynamicEvaled + script.source.introductionScript.url;
                }

                this.newScriptCallback(
                    script.source.text,
                    script.startLine,
                    url
                );
            }
        };

        this.dbg = dbg;
    }

    close(): void {
        if (this.dbg === null) {
            return;
        }

        this.dbg.removeAllDebuggees();
        this.dbg.enabled = false;
        this.dbg = null;
    }
}
