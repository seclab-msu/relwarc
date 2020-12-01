export function wait(d: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, d));
}

export interface ErrorStackTraceFrame {
    readonly file: string;
    readonly line: number;
    readonly column: number;
}

export function formatStack(stack: ErrorStackTraceFrame[]): string {
    return stack.map(
        entry => '   -> ' + entry.file + ': ' + entry.line +
                 ' | col: ' + entry.column
    ).join('\n');
}

export function makeCallbackPromise(): [Promise<unknown>, () => void] {
    let doneCallback: undefined | (() => void);

    const p = new Promise(resolve => {
        doneCallback = resolve;
    });

    return [p, doneCallback as (() => void)];
}

export function hasattr(ob: object, attr: string): boolean {
    return Object.prototype.hasOwnProperty.call(ob, attr);
}

export class TimeoutError extends Error {}

export function withTimeout<T>(p: Promise<T>, timeout: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const timeoutID = setTimeout(() => {
            reject(new TimeoutError('Operation timed out'));
        }, timeout);
        p.then(v => {
            clearTimeout(timeoutID);
            resolve(v);
        });
    });
}
