const system = require('system');

declare const slimer: {
    exit(status: number): void;
    isExiting(): boolean;
};

import { ArgumentParser } from 'argparse';

import { DynamicPageAnalyzer } from 'analyzer/dynamic-page-analyzer';
import { readTar } from './read-tar';


async function main(argc: number, argv: string[]): Promise<number> {
    const parser = new ArgumentParser({ prog: `slimerjs ${argv[0]}` });

    parser.add_argument('target_url');
    parser.add_argument('--tar-page', { type: String });
    parser.add_argument('--uncomment', { action: 'store_true' });
    parser.add_argument('--args', { action: 'store_true' });
    parser.add_argument('--no-html-deps', { action: 'store_true' });

    const args = parser.parse_args(argv.slice(1));

    if (slimer.isExiting()) { // this means arg parsing failed and called exit
        return 1;
    }

    let analyzer: DynamicPageAnalyzer;
    let targetURL = args.target_url;

    if (args.tar_page) {
        const [mapURLs, resources] = await readTar(args.tar_page);
        analyzer = new DynamicPageAnalyzer(mapURLs, resources);
        targetURL = mapURLs['index.html'];
    } else {
        analyzer = new DynamicPageAnalyzer();
    }

    const mineHTMLDEPs = !args.no_html_deps;

    await analyzer.run(targetURL, args.uncomment, mineHTMLDEPs);

    if (args.args) {
        for (const result of analyzer.analyzer.results) {
            console.log(JSON.stringify(result, null, 4));
        }
    } else {
        // hars
        console.log(JSON.stringify(
            analyzer.analyzer.hars.concat(analyzer.htmlDEPs),
            null,
            4
        ));
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
