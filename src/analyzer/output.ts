import { HAR } from './har';
import { prettyPrintHAR, stdoutIsTTY } from './pretty-deps';
import type { SinkCall } from './analyzer';

const fs = require('fs');

export function outputDEPs(deps: HAR[], outputFile: string | null): void {
    if (stdoutIsTTY() && !outputFile) {
        console.log('\nDEPS (' + deps.length + '):');
        deps.forEach(prettyPrintHAR);
    } else {
        const depJSON = JSON.stringify(deps, null, 4);
        if (outputFile) {
            console.error('Writing results to ' + outputFile);
            fs.writeFileSync(outputFile, depJSON);
            console.error('Writing done');
        } else {
            console.log(depJSON);
        }
    }
}

export function outputArgs(args: SinkCall[]): void {
    for (const result of args) {
        console.log(JSON.stringify(result, null, 4));
    }
}