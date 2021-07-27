const system = require('system');

declare const slimer: {
    exit(status: number): void;
    isExiting(): boolean;
};

import { ArgumentParser } from 'argparse';

import { DynamicPageAnalyzer } from 'analyzer/dynamic-page-analyzer';
import { readTar } from './read-tar';
import {
    domainFilteringModeFromString,
    validDomainFilteringModeValues
} from './analyzer/domain-filtering';

import { prettyPrintHAR, stdoutIsTTY } from './analyzer/pretty-deps';
console.log('');

/* eslint max-lines-per-function:off */
async function main(argc: number, argv: string[]): Promise<number> {
    const parser = new ArgumentParser({ prog: `slimerjs ${argv[0]}` });

    parser.add_argument('target_url');
    parser.add_argument('--tar-page', { type: String });
    parser.add_argument('--uncomment', { action: 'store_true' });
    parser.add_argument('--args', { action: 'store_true' });
    parser.add_argument('--deduplicate-deps', { action: 'store_true' });
    parser.add_argument('--no-html-deps', { action: 'store_true' });
    parser.add_argument('--no-dynamic-deps', { action: 'store_true' });
    parser.add_argument('--only-js-dynamic-deps', { action: 'store_true' });
    parser.add_argument('--log-requests', { action: 'store_true' });
    parser.add_argument('--domain-scope', {
        choices: validDomainFilteringModeValues,
        default: 'subdomain'
    });
    parser.add_argument('--load-timeout', { type: Number });

    const args = parser.parse_args(argv.slice(1));

    if (slimer.isExiting()) { // this means arg parsing failed and called exit
        return 1;
    }

    let targetURL = args.target_url;

    const analyzerOptions = {
        logRequests: args.log_requests,
        domainFilteringMode: domainFilteringModeFromString(args.domain_scope),
        mapURLs: null as (object | null),
        mineDynamicDEPs: !args.no_dynamic_deps as boolean,
        onlyJSDynamicDEPs: args.only_js_dynamic_deps as boolean,
        loadTimeout: args.load_timeout || undefined
    };

    if (args.tar_page) {
        const [indexURL, mapURLs] = await readTar(args.tar_page);
        analyzerOptions.mapURLs = mapURLs;
        targetURL = indexURL;
    }

    const analyzer = new DynamicPageAnalyzer(analyzerOptions);

    const mineHTMLDEPs = !args.no_html_deps;

    await analyzer.run(targetURL, args.uncomment, mineHTMLDEPs);

    if (args.args) {
        for (const result of analyzer.analyzer.results) {
            console.log(JSON.stringify(result, null, 4));
        }
    } else {
        // hars
        const deps = analyzer.getAllDeps(args.deduplicate_deps);

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
        exitStatus = await main(system.args.length, system.args);
    } catch (e) {
        system.stderr.write('Error: ' + e + '\nstack:\n' + e.stack + '\n');
        exitStatus = 1;
    }
    if (!slimer.isExiting()) {
        slimer.exit(exitStatus);
    }
})();
