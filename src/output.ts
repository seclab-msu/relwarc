import { HAR } from './har';
import { prettyPrintHAR, stdoutIsTTY } from './pretty-deps';
import type { SinkCall } from './analyzer';
import { log } from './logging';

const fs = require('fs');

export function outputDEPs(deps: HAR[], outputFile: string | null): void {
    if (stdoutIsTTY() && !outputFile) {
        console.log('\nDEPS (' + deps.length + '):');
        deps.forEach(prettyPrintHAR);
    } else {
        const requestParameterFields = ['name', 'value'];
        const isRequestParameterField = Array.prototype.includes.bind(
            requestParameterFields
        );
        const depJSON = JSON.stringify(deps, function (k, v) {
            if (
                requestParameterFields.includes(k) &&
                // eslint-disable-next-line no-invalid-this
                Object.keys(this).every(isRequestParameterField)
            ) {
                return String(v);
            }
            return v;
        }, 4);
        if (outputFile) {
            log('Writing results to ' + outputFile);
            fs.writeFileSync(outputFile, depJSON);
            log('Writing done');
        } else {
            console.log(depJSON);
        }
    }
}

export function outputArgs(args: SinkCall[], outputFile: string | null): void {
    const argsJSON = JSON.stringify(args, null, 4);
    if (outputFile) {
        log('Writing args to ' + outputFile);
        fs.writeFileSync(outputFile, argsJSON);
        log('Writing done');
    } else {
        console.log(argsJSON);
    }
}
