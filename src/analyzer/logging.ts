function formatDate(): string {
    const pad = s => String(s).padStart(2, '0');

    const d = new Date();
    const dateString = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}` +
        `.${d.getFullYear()}`;
    const timeString = `${pad(d.getHours())}:${pad(d.getMinutes())}:` +
        `${pad(d.getSeconds())}.${d.getMilliseconds()}`;

    return `${dateString} ${timeString}`;
}

export function log(msg: string): void {
    console.error(`${formatDate()} ${msg}`);
}
