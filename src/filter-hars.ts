import { readFileSync } from 'fs';

import { ArgumentParser } from 'argparse';

import {
    validDeduplicationModeValues,
    deduplicateDEPs,
    deduplicationModeFromString,
} from './dep-comparison';
import {
    filterByDomain,
    validDomainFilteringModeValues,
    domainFilteringModeFromString
} from './domain-filtering';
import { HAR } from './har';

import { prettyPrintHAR } from './pretty-deps';

const STDIN_PATH = '/dev/stdin';

const parser = new ArgumentParser();

parser.add_argument('--dep-deduplication', {
    choices: validDeduplicationModeValues,
    default: 'default'
});
parser.add_argument('--domain-scope', {
    choices: validDomainFilteringModeValues,
    default: null
});
parser.add_argument('--base-url', { type: String });
parser.add_argument('--pretty-print', { action: 'store_true' });

const args = parser.parse_args();

const dedupMode = deduplicationModeFromString(args.dep_deduplication);

let harFilter: (HAR) => boolean = () => true;

if (args.domain_scope) {
    const baseURL = args.base_url;

    if (!baseURL) {
        throw new Error('Filtering by domain requires setting base URL');
    }
    const filteringMode = domainFilteringModeFromString(args.domain_scope);
    harFilter = har => filterByDomain(har.url, baseURL, filteringMode);
}

const parsedHARs = JSON.parse(
    readFileSync(STDIN_PATH).toString()
);

const hars: HAR[] = [];
for (const parsedHAR of parsedHARs) {
    const har = HAR.fromJSON(parsedHAR);
    if (har !== null) {
        if (harFilter(har)) {
            hars.push(har);
        }
    }
}

const resultingDEPs = deduplicateDEPs(hars, dedupMode);

if (args.pretty_print) {
    console.log('\nDEPS (' + resultingDEPs.length + '):');
    resultingDEPs.forEach(prettyPrintHAR);
} else {
    console.log(JSON.stringify(resultingDEPs, null, 4));
}
