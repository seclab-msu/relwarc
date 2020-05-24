import * as babel from 'analyzer/vendor/babel';

declare const Debugger: any;
require('analyzer/debugger').addDebuggerToGlobal(this);

export class Analyzer {
    readonly scripts: any[];

    private readonly seenScripts: Set<string>;

    constructor() {
        this.scripts = [];
        this.seenScripts = new Set();
    }
    attachDebugger(win: object): void {
        const dbg = new Debugger(win);

        dbg.onNewScript = (script: any): void => {
            const text: string = script.source.text;

            if (this.seenScripts.has(text)) {
                return;
            }
            this.seenScripts.add(text);

            this.scripts.push(babel.parser.parse(text));
        }
    }
}