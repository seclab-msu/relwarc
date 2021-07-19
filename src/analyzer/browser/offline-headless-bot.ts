const webServerFactory = require('webserver');
import { hasattr } from '../utils/common';

import {
    HeadlessBot, HeadlessBotOptions,
    ResourceRequest,
    NetworkRequest
} from './headless-bot';

const LOCALHOST_BASE = 'http://127.0.0.1:';

export class OfflineHeadlessBot extends HeadlessBot {
    private webserver;

    constructor(mapURLs: object, {
        printPageErrors=false,
        printPageConsoleLog=true,
        logRequests=false
    }: HeadlessBotOptions) {
        super({ printPageErrors, printPageConsoleLog, logRequests });
        this.createWebServer(mapURLs);
    }

    private createWebServer(mapURLs: object) {
        this.webserver = webServerFactory.create();
        this.webserver.listen(-1, function (request, response) {
            if (hasattr(mapURLs, request.url)) {
                response.statusCode = 200;
                response.write(mapURLs[request.url]);
            } else {
                response.statusCode = 404;
                response.write('Not found');
            }
            response.close();
        });
    }

    protected handleRequest(
        req: ResourceRequest,
        netReq?: NetworkRequest
    ): void {
        const reqUrl = new URL(req.url);
        const path = reqUrl.pathname + reqUrl.search;
        if (reqUrl.host !== '127.0.0.1:' + this.webserver.port) {
            if (netReq) {
                netReq.changeUrl(
                    LOCALHOST_BASE + this.webserver.port + path,
                );
            }
        }
        super.handleRequest(req);
    }
    getServerPort(): number {
        return this.webserver.port;
    }
}
