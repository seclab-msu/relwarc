const webServerFactory = require('webserver');

import {
    HeadlessBot,
    ResourceRequest,
    NetworkRequest
} from './headless-bot';

const LOCALHOST_BASE = 'http://127.0.0.1:';

export class OfflineHeadlessBot extends HeadlessBot {
    private webserver;

    constructor(
        printPageErrors=false,
        printPageConsoleLog=true,
        mapURLs: object,
        resources: object,
    ) {
        super(printPageErrors, printPageConsoleLog);
        this.createWebServer(mapURLs, resources);
    }

    private createWebServer(mapURLs: object, resources: object) {
        this.webserver = webServerFactory.create();
        this.webserver.listen(-1);
        for (const [filename, url] of Object.entries(mapURLs)) {
            const reqUrl = new URL(url);
            this.webserver.registerPathHandler(
                reqUrl.pathname + reqUrl.search,
                function (request, response) {
                    response.statusCode = 200;
                    response.write(resources[filename]);
                    response.close();
                }
            );
        }
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
}
