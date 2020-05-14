const system = require('system');

const { parse } = require('analyzer/parser');
const WebsocketClient = require('analyzer/websocket-client');
const HeadlessBot = require('analyzer/headless-bot');

require('analyzer/debugger').addDebuggerToGlobal(this);

class Analyzer {
    constructor(ws) {
        this.ws = ws;
    }
    attachDebugger(win, doc) {
        const dbg = new Debugger(win);

        dbg.onNewScript = (script, global) => {
            this.ws.emit(
                "ast",
                parse(script.source.text, {loc: false})
            );
        }
    }
}

async function main(argc, argv) {
    if (argc < 2) {
        system.stderr.write('Usage: ' + argv[0] + ' <websocket controller url>\n');
        return 1;
    }

    const ws = new WebsocketClient();
    const analyzer = new Analyzer(ws);
    const bot = new HeadlessBot();

    bot.onWindowCreated = analyzer.attachDebugger.bind(analyzer);

    let doneCallback;

    const done = new Promise(resolve => {doneCallback = resolve});

    ws.on('navigate', async url => {
        await bot.navigate(url);
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