const system = require('system');

declare const slimer: {
    exit(status: number): void;
    isExiting(): boolean;
};

import { ArgumentParser } from 'argparse';

import { DynamicPageAnalyzer } from '../../dynamic-page-analyzer';
import { readTar } from '../../read-tar';
import {
    domainFilteringModeFromString,
    validDomainFilteringModeValues
} from '../../domain-filtering';
import {
    deduplicationModeFromString,
    validDeduplicationModeValues
} from '../../dep-comparison';
import { outputDEPs, outputArgs } from '../../output';

import { log } from '../../logging';

let targetURL;

/* eslint max-lines-per-function:off */
async function main(argc: number, argv: string[]): Promise<number> {
    const parser = new ArgumentParser({ prog: `slimerjs ${argv[0]}` });

    parser.add_argument('target_url');
    parser.add_argument('--tar-page', { type: String });
    parser.add_argument('--no-comments', { action: 'store_true' });
    parser.add_argument('--args', { action: 'store_true' });
    parser.add_argument('--dep-deduplication', {
        choices: validDeduplicationModeValues,
        default: 'none'
    });
    parser.add_argument('--no-html-deps', { action: 'store_true' });
    parser.add_argument('--no-dynamic-deps', { action: 'store_true' });
    parser.add_argument('--only-js-dynamic-deps', { action: 'store_true' });
    parser.add_argument('--log-requests', { action: 'store_true' });
    parser.add_argument('--debug-request-loading', { action: 'store_true' });
    parser.add_argument('--domain-scope', {
        choices: validDomainFilteringModeValues,
        default: 'second-level'
    });
    parser.add_argument('--no-static-filter', { action: 'store_true' });
    parser.add_argument('--load-timeout', { type: Number });
    parser.add_argument('--add-dynamic-html-dep-location', { action: 'store_true' });
    parser.add_argument('--record-request-stacks', { action: 'store_true' });
    parser.add_argument('--output', { type: String, default: null });
    parser.add_argument('--no-reload-page', { action: 'store_true' });
    parser.add_argument('--analyzer-debug', { action: 'store_true' });

    const args = parser.parse_args(argv.slice(1));

    if (slimer.isExiting()) { // this means arg parsing failed and called exit
        return 1;
    }

    targetURL = args.target_url;

    const analyzerOptions = {
        logRequests: args.log_requests,
        debugRequestLoading: args.debug_request_loading,
        domainFilteringMode: domainFilteringModeFromString(args.domain_scope),
        mapURLs: null as (object | null),
        mineDynamicDEPs: !args.no_dynamic_deps as boolean,
        onlyJSDynamicDEPs: args.only_js_dynamic_deps as boolean,
        loadTimeout: args.load_timeout || undefined,
        recordRequestStackTraces: args.record_request_stacks,
        filterStatic: !args.no_static_filter,
        debug: args.analyzer_debug
    };

    if (args.tar_page) {
        const [indexURL, mapURLs] = await readTar(args.tar_page);
        analyzerOptions.mapURLs = mapURLs;
        targetURL = indexURL;
    }

    const addHtmlDynamicDEPsLocation =
        args.add_dynamic_html_dep_location as boolean;

    const analyzer = new DynamicPageAnalyzer(analyzerOptions);

    await analyzer.run(
        targetURL,
        !args.no_html_deps,
        addHtmlDynamicDEPsLocation,
        !args.no_reload_page
    );

    if (args.args) {
        outputArgs(analyzer.analyzer.results, args.output);
    } else {
        // hars
        const deps = analyzer.getAllDeps(
            deduplicationModeFromString(args.dep_deduplication)
        );
        outputDEPs(deps, args.output);
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
    log(`All done on ${targetURL}, exiting`);
    if (!slimer.isExiting()) {
        slimer.exit(exitStatus);
    }
})();
