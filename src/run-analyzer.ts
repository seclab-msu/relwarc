const system = require('system');

declare const slimer: {
    exit(status: number): void;
};

import { DynamicPageAnalyzer } from 'analyzer/dynamic-page-analyzer';
import { readTar } from './read-tar';


async function main(argc: number, argv: string[]): Promise<number> {
    if (argc < 2) {
        system.stderr.write('Usage: ' + argv[0] + ' <target url>\n');
        return 1;
    }

    let targetURL = argv[1];
    let analyzer: DynamicPageAnalyzer;

    if (argv.includes('--tar-page')) {
        const path = argv[argv.indexOf('--tar-page') + 1];
        const [mapURLs, resources] = await readTar(path);
        analyzer = new DynamicPageAnalyzer(mapURLs, resources);
        targetURL = mapURLs['index.html'];
    } else {
        analyzer = new DynamicPageAnalyzer();
    }

    await analyzer.run(targetURL, argv.includes('--uncomment'));

    if (argv.includes('--args')) {
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
    slimer.exit(exitStatus);
})();
