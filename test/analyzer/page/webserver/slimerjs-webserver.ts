const webServerFactory = require("webserver");

import { LOCALHOST_BASE } from './common';

export class TestWebServer {
    private static instance: TestWebServer | null = null;

    readonly port: number;

    private constructor() {
        const webServer = webServerFactory.create();
        webServer.registerDirectory('/', __dirname + '/../www');
        webServer.listen(-1);
        this.port = webServer.port;
    }

    static async run(): Promise<TestWebServer> {
        if (TestWebServer.instance !== null) {
            return TestWebServer.instance;
        }
        const ws = new TestWebServer();
        TestWebServer.instance = ws;
        return ws;
    }

    getFullURL(partialURL: string) {
        const url = new URL(partialURL, LOCALHOST_BASE + this.port);
        return url.href;
    }
}

export async function run(): Promise<TestWebServer> {
    return await TestWebServer.run();
}
