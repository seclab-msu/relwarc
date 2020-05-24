"use strict"


const system = require('system');

const { DynamicPageAnalyzer } = require('analyzer/dynamic-page-analyzer');

async function main(argc, argv) {
    if (argc < 2) {
        system.stderr.write('Usage: ' + argv[0] + ' <target url>\n');
        return 1;
    }

    const targetURL = argv[1];

    const analyzer = new DynamicPageAnalyzer();

    await analyzer.run(targetURL);
}

(async () => {
    let exitStatus;

    try {
        exitStatus = await main(system.args.length, system.args);
    } catch(e) {
        system.stderr.write('Error: ' + e + '\nstack:\n' + e.stack + '\n');
        exitStatus = 1;
    }
    slimer.exit(exitStatus);
})();