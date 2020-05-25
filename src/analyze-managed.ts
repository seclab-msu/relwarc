const system = require('system');

declare const slimer: any;

import { WebsocketClient } from 'analyzer/websocket-client';
import { DynamicPageAnalyzer } from 'analyzer/dynamic-page-analyzer';
import { makeCallbackPromise } from 'analyzer/utils';

async function main(argc: number, argv: string[]): Promise<number> {
    if (argc < 2) {
        system.stderr.write('Usage: ' + argv[0] + ' <websocket controller url>\n');
        return 1;
    }

    const ws = new WebsocketClient();
    const analyzer = new DynamicPageAnalyzer();

    const [done, doneCallback] = makeCallbackPromise();

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

    return 0;
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