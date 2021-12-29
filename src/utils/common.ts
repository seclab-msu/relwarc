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

export function makeCallbackPromise(): [Promise<void>, () => void] {
    let doneCallback: undefined | (() => void);

    const p: Promise<void> = new Promise(resolve => {
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

export function isNotNullObject(obj: unknown): boolean {
    return typeof obj === 'object' && obj !== null;
}

export function isSuperset<T>(set: Set<T>, subset: Set<T>): boolean {
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

export function isPromise(ob: unknown): ob is PromiseLike<unknown> {
    return (
        ob !== null &&
        typeof ob === 'object' &&
        'then' in ob &&
        typeof ob.then === 'function'
    );
}

export function depJSONStringify(obj): string {
    return JSON.stringify(obj, (k, v) => {
        return k && v === undefined ? 'UNKNOWN' : v;
    });
}
