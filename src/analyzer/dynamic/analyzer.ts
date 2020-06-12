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
}

export class DynamicAnalyzer {
    newScriptCallback: ((source: string) => void) | null;

    private dbg: Debugger | null;

    constructor() {
        this.dbg = null;
        this.newScriptCallback = null;
    }

    addWindow(win) {
        const dbg = new Debugger(win);

        dbg.onNewScript = (script: Script): void => {
            if (this.newScriptCallback) {
                this.newScriptCallback(script.source.text);
            }
        }
    }
}
