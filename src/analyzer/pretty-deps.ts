import * as fs from 'fs';

import * as ansi from 'ansi';
import { Writable } from 'stream';

import { HAR } from './har';

let colorPrinter: ansi.Cursor;

if (typeof process.stdout.on === 'function') {
    // we are on NodeJS, everything works out of the box
    colorPrinter = ansi(process.stdout);
} else {
    // we are on SlimerJS
    const stdoutWriter = new Writable({
        write(chunk, encoding, callback) {
            process.stdout.write(chunk);
            callback(null);
        }
    });
    colorPrinter = ansi(stdoutWriter, { enabled: true, buffering: false });
}

export function stdoutIsTTY(): boolean {
    if (process.stdout.isTTY) {
        return true;
    }

    if (fs.readlinkSync) {
        return fs.readlinkSync('/proc/self/fd/1').startsWith('/dev/pts/');
    }

    const system = require('system');

    return system.env['__SLIMERJS_INTERACTIVE'] === '1';
}

export function prettyPrintHAR(har: HAR): void {
    colorPrinter
        .write('\n')
        .brightGreen()
        .write(har.method)
        .write(' ')
        .cyan()
        .write(har.url)
        .write('\n');
    for (const h of har.headers) {
        colorPrinter
            .yellow()
            .write(h.name + ':')
            .write(' ')
            .blue()
            .write(h.value)
            .write('\n');
    }
    const postData = har.getPostData();
    if (postData) {
        colorPrinter.reset().write('\n');
        if (postData.text) {
            colorPrinter.write(postData.text);
        } else if (postData.params) {
            for (const p of postData.params) {
                colorPrinter
                    .green()
                    .write('---- ' + p.name + ' ----')
                    .write('\n')
                    .blue()
                    .write('\n' + p.value + '\n');
            }
        } else {
            colorPrinter.red().write('N/A');
        }
    }
    colorPrinter.reset().write('\n');
}
