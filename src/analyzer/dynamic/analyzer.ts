declare class Debugger {
    constructor(win: object);

    onNewScript: (script: Script) => void;
}

require('./debugger').addDebuggerToGlobal(global);

interface Source {
    text: string;
}

interface Script {
    source: Source;
    startLine: number;
    url: string;
}

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
                this.newScriptCallback(
                    script.source.text,
                    script.startLine,
                    script.url
                );
            }
        };

        this.dbg = dbg;
    }
}
