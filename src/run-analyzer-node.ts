import { promises as fs } from 'fs';

import { ArgumentParser } from 'argparse';

import { Analyzer } from './analyzer';

import {
    deduplicationModeFromString,
    validDeduplicationModeValues,
    deduplicateDEPs
} from './dep-comparison';
import { outputDEPs, outputArgs } from './output';

import { log } from './logging';

async function main(): Promise<number> {
    const parser = new ArgumentParser();

    parser.add_argument('script_path');
    parser.add_argument('base_url', { nargs: '?' });
    parser.add_argument('--no-comments', { action: 'store_true' });
    parser.add_argument('--args', { action: 'store_true' });
    parser.add_argument('--dep-deduplication', {
        choices: validDeduplicationModeValues,
        default: 'none'
    });
    parser.add_argument('--output', { type: String, default: null });
    parser.add_argument('--debug', { action: 'store_true' });

    const args = parser.parse_args();

    const baseURL = args.base_url || 'http://example.com/';

    const source = await fs.readFile(args.script_path, { encoding: 'utf8' });

    const analyzer = new Analyzer(null, { debug: args.debug });

    analyzer.addScript(source);

    analyzer.analyze(baseURL);

    if (args.args) {
        outputArgs(analyzer.results, args.output);
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
