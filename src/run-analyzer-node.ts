import { promises as fs } from 'fs';

import { ArgumentParser } from 'argparse';

import { Analyzer } from './analyzer/analyzer';

import { prettyPrintHAR, stdoutIsTTY } from './analyzer/pretty-deps';
import {
    deduplicationModeFromString,
    validDeduplicationModeValues,
    deduplicateDEPs
} from './analyzer/dep-comparison';

async function main(): Promise<number> {
    const parser = new ArgumentParser();

    parser.add_argument('script_path');
    parser.add_argument('base_url', { nargs: '?' });
    parser.add_argument('--uncomment', { action: 'store_true' });
    parser.add_argument('--args', { action: 'store_true' });
    parser.add_argument('--deduplicate-deps', {
        choices: validDeduplicationModeValues,
        default: 'none'
    });

    const args = parser.parse_args();

    const baseURL = args.base_url || 'http://example.com/';

    const source = await fs.readFile(args.script_path, { encoding: 'utf8' });

    const analyzer = new Analyzer();

    analyzer.addScript(source);

    analyzer.analyze(baseURL, args.uncomment);

    if (args.args) {
        for (const result of analyzer.results) {
            console.log(JSON.stringify(result, null, 4));
        }
    } else {
        // hars
        const deps = deduplicateDEPs(
            analyzer.hars,
            deduplicationModeFromString(args.deduplicate_deps)
        );

        if (stdoutIsTTY()) {
            console.log('\nDEPS (' + deps.length + '):');
            deps.forEach(prettyPrintHAR);
        } else {
            console.log(JSON.stringify(deps, null, 4));
        }
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
    process.exit(exitStatus);
})();
