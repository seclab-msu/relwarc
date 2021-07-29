import { deduplicateDEPs } from './analyzer/comparison-deps';
import { HAR } from './analyzer/har';
import { readFileSync } from 'fs';

const STDIN_PATH = '/dev/stdin';

const parsedHARs = JSON.parse(
    readFileSync(STDIN_PATH).toString()
);

const hars: HAR[] = [];
for (const parsedHAR of parsedHARs) {
    hars.push(HAR.fromJSON(parsedHAR));
}

console.log(JSON.stringify(deduplicateDEPs(hars), null, 4));