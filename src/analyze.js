"use strict"


const system = require('system');

const { parse } = require('analyzer/parser');
const WebsocketClient = require('analyzer/websocket-client');

const { DynamicPageAnalyzer } = require('analyzer/dynamic-page-analyzer');


async function main(argc, argv) {
    if (argc < 2) {
        system.stderr.write('Usage: ' + argv[0] + ' <websocket controller url>\n');
        return 1;
    }

    const ws = new WebsocketClient();
    const analyzer = new DynamicPageAnalyzer();

    let doneCallback;

    const done = new Promise(resolve => {doneCallback = resolve});

    ws.on('navigate', async url => {
        await analyzer.run(url);
        for (const ast of analyzer.analyzer.scripts) {
            ws.emit('ast', ast);
        }
        ws.emit('done')
    });

    ws.on('exit', doneCallback);

    await ws.connect(argv[1]);
    await done;
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