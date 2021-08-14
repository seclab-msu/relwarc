type LogFuncType = (msg: string) => void;

function formatDate(): string {
    const pad = s => String(s).padStart(2, '0');

    const d = new Date();
    const dateString = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}` +
        `.${d.getFullYear()}`;
    const timeString = `${pad(d.getHours())}:${pad(d.getMinutes())}:` +
        `${pad(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}`;

    return `${dateString} ${timeString}`;
}

let logFunc: LogFuncType = function log(msg: string): void {
    console.error(`${formatDate()} ${msg}`);
};

export function log(msg: string): void {
    logFunc(msg);
}

export function setLogFunc(f: LogFuncType): void {
    logFunc = f;
}

export function getLogFunc(): LogFuncType {
    return logFunc;
}
