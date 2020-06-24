const webServerFactory = require("webserver");

const LOCALHOST_BASE = 'http://127.0.0.1:';


class TestWebServer {
    private static instance: TestWebServer | null = null;

    readonly port: number;

    private constructor() {
        const webServer = webServerFactory.create();
        webServer.registerDirectory('/', __dirname + '/www');
        webServer.listen(-1);
        this.port = webServer.port;
    }

    static run(): TestWebServer {
        if (TestWebServer.instance !== null) {
            return TestWebServer.instance;
        }
        const ws = new TestWebServer();
        TestWebServer.instance = ws
        return ws;
    }

    getFullURL(partialURL: string) {
        const url = new URL(partialURL, LOCALHOST_BASE + this.port);
        return url.href;
    }
}

export function run(): TestWebServer {
    return TestWebServer.run();
}
