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

import { uncommenterRetry } from '../../uncommenter';

let targetURL;

// TODO: deduplicate this with slimer's run-analyzer.ts

/* eslint max-lines-per-function:off */
async function main(): Promise<number> {
    const parser = new ArgumentParser();

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
    parser.add_argument('-p', '--proxy', { type: String });
    parser.add_argument('--debug', { action: 'store_true' });

    const args = parser.parse_args();

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
        proxy: args.proxy,
        debug: args.debug
    };

    if (args.tar_page) {
        const [indexURL, mapURLs] = await readTar(args.tar_page);
        analyzerOptions.mapURLs = mapURLs;
        targetURL = indexURL;
    }

    const addHtmlDynamicDEPsLocation =
        args.add_dynamic_html_dep_location as boolean;

    await uncommenterRetry(async uncomment => {
        const analyzer = new DynamicPageAnalyzer(analyzerOptions);

        await analyzer.run(
            targetURL,
            uncomment,
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
    }, !args.no_comments);

    return 0;
}


(async () => {
    let exitStatus: number;

    // @ts-ignore (See: https://github.com/nodejs/node/issues/6379)
    process.stdout._handle.setBlocking(true);

    try {
        exitStatus = await main();
    } catch (e) {
        process.stderr.write('Error: ' + e + '\nstack:\n' + e.stack + '\n');
        exitStatus = 1;
    }
    log(`All done on ${targetURL}, exiting`);
    process.exit(exitStatus);
})();
