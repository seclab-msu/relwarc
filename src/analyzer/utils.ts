const { Cc, Ci, Cu, Cr } = require('chrome');

declare const XPCNativeWrapper: any;

Cu.import('resource://gre/modules/Services.jsm');

export function getWrappedWindow(webpage) {
    const win = webpage.evaluate(function () {
        return window;
    });
    return new XPCNativeWrapper(win);
}

export function wait(d): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, d));
}

interface ErrorStackTraceFrame {
    readonly file: string;
    readonly line: number;
    readonly column: number;
}

export function formatStack(stack: ErrorStackTraceFrame[]) {
    return stack.map(
        entry => '   -> ' + entry.file + ': ' + entry.line +
                 ' | col: ' + entry.column
    ).join('\n');
}

export function makeCallbackPromise(): [Promise<unknown>, () => void] {
    let doneCallback: undefined | (() => void);

    const p = new Promise(resolve => {doneCallback = resolve});

    return [p, doneCallback as (() => void)];
}
