const webServerFactory = require('webserver');

import {
    HeadlessBot, HeadlessBotOptions,
    ResourceRequest,
    NetworkRequest
} from './headless-bot';

const LOCALHOST_BASE = 'http://127.0.0.1:';

export class OfflineHeadlessBot extends HeadlessBot {
    private webserver;

    constructor(mapURLs: object, resources: object, {
        printPageErrors=false,
        printPageConsoleLog=true,
        logRequests=false
    }: HeadlessBotOptions) {
        super({ printPageErrors, printPageConsoleLog, logRequests });
        this.createWebServer(mapURLs, resources);
    }

    private createWebServer(mapURLs: object, resources: object) {
        this.webserver = webServerFactory.create();
        this.webserver.listen(-1, function (request, response) {
            for (const [filename, url] of Object.entries(mapURLs)) {
                const reqUrl = new URL(url);
                if (request.url === reqUrl.pathname + reqUrl.search) {
                    response.statusCode = 200;
                    response.write(resources[filename]);
                    response.close();
                    return;
                }
            }
            response.statusCode = 404;
            response.write('Not found');
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
