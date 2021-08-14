import { promises as fs } from 'fs';

import { ArgumentParser } from 'argparse';

import { Analyzer } from './analyzer/analyzer';

import {
    deduplicationModeFromString,
    validDeduplicationModeValues,
    deduplicateDEPs
} from './analyzer/dep-comparison';
import { outputDEPs, outputArgs } from './analyzer/output';

import { log } from './analyzer/logging';

async function main(): Promise<number> {
    const parser = new ArgumentParser();

    parser.add_argument('script_path');
    parser.add_argument('base_url', { nargs: '?' });
    parser.add_argument('--uncomment', { action: 'store_true' });
    parser.add_argument('--args', { action: 'store_true' });
    parser.add_argument('--dep-deduplication', {
        choices: validDeduplicationModeValues,
        default: 'none'
    });
    parser.add_argument('--output', { type: String, default: null });

    const args = parser.parse_args();

    const baseURL = args.base_url || 'http://example.com/';

    const source = await fs.readFile(args.script_path, { encoding: 'utf8' });

    const analyzer = new Analyzer();

    analyzer.addScript(source);

    analyzer.analyze(baseURL, args.uncomment);

    if (args.args) {
        outputArgs(analyzer.results);
    } else {
        // hars
        const deps = deduplicateDEPs(
            analyzer.hars,
            deduplicationModeFromString(args.dep_deduplication)
        );

        outputDEPs(deps, args.output);
    }

    return 0;
}

(async () => {
    let exitStatus: number;

    try {
        exitStatus = await main();
    } catch (e) {
        process.stderr.write('Error: ' + e + '\nstack:\n' + e.stack + '\n');
        exitStatus = 1;
    }
    log('All done, exiting');
    process.exit(exitStatus);
})();
