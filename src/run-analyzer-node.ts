import { promises as fs } from 'fs';

import { Analyzer } from './analyzer/analyzer';

async function main(argc: number, argv: string[]): Promise<number> {
    if (argc < 3) {
        process.stderr.write(`Usage: ${argv[0]} ${argv[1]} <path to script>\n`);
        return 1;
    }

    const scriptPath = argv[2];

    let baseURL = 'http://example.com/';

    if (argc > 3) {
        baseURL = argv[3];
    }

    const source = await fs.readFile(scriptPath, { encoding: 'utf8' });

    const analyzer = new Analyzer();

    analyzer.addScript(source);

    analyzer.analyze(baseURL);

    if (argv.includes('--args')) {
        for (const result of analyzer.results) {
            console.log(JSON.stringify(result, null, 4));
        }
    } else {
        // hars
        console.log(JSON.stringify(analyzer.hars, null, 4));
    }

    return 0;
}

(async () => {
    let exitStatus: number;

    try {
        const argv = process.argv;
        exitStatus = await main(argv.length, argv);
    } catch (e) {
        process.stderr.write('Error: ' + e + '\nstack:\n' + e.stack + '\n');
        exitStatus = 1;
    }
    process.exit(exitStatus);
})();
