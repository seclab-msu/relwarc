import * as fs from 'fs';

import * as ansi from 'ansi';
import { Writable } from 'stream';

import { HAR, PostData } from './har';

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

function prettyPrintQueryString(qs: string): void {
    let inValue = false;
    colorPrinter.yellow();
    for (const c of qs) {
        if (c === '&') {
            colorPrinter.magenta().write('&').yellow();
            inValue = false;
        } else if (c === '=' && !inValue) {
            colorPrinter.magenta().write('=').blue();
            inValue = true;
        } else {
            colorPrinter.write(c);
        }
    }
}

export function prettyPrintHAR(har: HAR): void {
    const lt = har.initiator?.type;

    if (typeof lt !== 'undefined') {
        colorPrinter.red().write('[' + String(lt) + ']').reset().write(' ');
    }

    const qsIndex = har.url.indexOf('?');

    const urlBeforeQS = qsIndex >= 0 ? har.url.substring(0, qsIndex) : har.url;
    colorPrinter
        .write('\n')
        .brightGreen()
        .write(har.method)
        .write(' ')
        .cyan()
        .write(urlBeforeQS);
    if (qsIndex > 0) {
        colorPrinter.magenta().write('?').cyan();
        prettyPrintQueryString(har.url.substring(qsIndex + 1));
    }
    colorPrinter.grey().write(' HTTP/1.1\n');
    let isForm = false;
    for (const h of har.headers) {
        colorPrinter
            .yellow()
            .write(h.name + ':')
            .write(' ')
            .blue()
            .write(String(h.value))
            .write('\n');
        if (h.name.toLowerCase() === 'content-type' && h.value === 'application/x-www-form-urlencoded') {
            isForm = true;
        }
    }
    const postData = har.getPostData();
    if (postData) {
        prettyPrintPostData(postData, isForm);
    }
    colorPrinter.reset().write('\n');
}

function prettyPrintPostData(postData: PostData, isForm: boolean): void {
    colorPrinter.reset().write('\n');
    if (postData.text) {
        if (isForm) {
            prettyPrintQueryString(postData.text);
        } else {
            colorPrinter.write(postData.text);
        }
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
