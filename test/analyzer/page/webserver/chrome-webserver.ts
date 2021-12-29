import * as http from 'http';
import * as fs from 'fs';
import { normalize } from 'path';
import type { AddressInfo } from 'net';

import { LOCALHOST_BASE } from './common';

export class TestWebServer {
    private static instance: TestWebServer | null = null;
    
    private readonly server: http.Server;
    private port: number | null;

    private constructor() {
        this.server = http.createServer(this.serve.bind(this));
        this.port = null;
    }

    static async run(): Promise<TestWebServer> {
        if (TestWebServer.instance !== null) {
            return TestWebServer.instance;
        }
        const ws = new TestWebServer();
        TestWebServer.instance = ws;
        await ws.start();
        return ws;
    }

    start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.on('error', reject);
            try {
                this.server.listen(() => {
                    this.port = (this.server.address() as AddressInfo).port;
                    resolve();
                    this.server.off('error', reject);
                });
            } catch (err) {
                reject(err);
            }
        })
    }

    serve(req, res) {
        const path = __dirname + '/../www' + normalize(req.url.split('?')[0]);

        fs.stat(path, (err, stats) => {
            if (err !== null) {
                res.end(String(err));
                return;
            }    
            if (stats.isDirectory()) {
                res.end('directory');
                return;
            }
            fs.createReadStream(path).pipe(res);
        });
    }

    getFullURL(partialURL: string): string {
        if (this.port === null) {
            throw new Error('getFullURL called before server is initialized')
        }
        const url = new URL(partialURL, LOCALHOST_BASE + this.port);
        return url.href;
    }
}

export async function run(): Promise<TestWebServer> {
    return await TestWebServer.run();
}