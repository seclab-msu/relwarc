declare class Debugger {
    constructor(win: object);

    onNewScript: (script: Script) => void;
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
}
