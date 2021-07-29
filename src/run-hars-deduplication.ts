import {
    deduplicationModeFromString,
    validDeduplicationModeValues,
    deduplicateDEPs,
    DeduplicationMode
} from './analyzer/dep-comparison';
import { HAR } from './analyzer/har';
import { readFileSync } from 'fs';

const STDIN_PATH = '/dev/stdin';

let mode = DeduplicationMode.Default;

if (process.argv.length > 2) {
    const modeName = process.argv[2];

    if (validDeduplicationModeValues.includes(modeName)) {
        mode = deduplicationModeFromString(modeName);
    } else {
        console.log('Unexpected deduplication mode ' + modeName);
        console.log('Should be one of ' + validDeduplicationModeValues);
        process.exit(1);
    }
}

const parsedHARs = JSON.parse(
    readFileSync(STDIN_PATH).toString()
);

const hars: HAR[] = [];
for (const parsedHAR of parsedHARs) {
    hars.push(HAR.fromJSON(parsedHAR));
}

console.log(JSON.stringify(deduplicateDEPs(hars, mode), null, 4));
