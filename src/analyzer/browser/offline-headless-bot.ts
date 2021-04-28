const system = require('system');

const { create: createWebpage } = require('webpage');
const webServerFactory = require('webserver');

const WindowEvents = require('./window-events');

import { observeMutations } from './mutation-observer';

import { getWrappedWindow } from '../utils/window';
import {
    wait,
    formatStack,
    ErrorStackTraceFrame,
    withTimeout, TimeoutError
} from '../utils/common';

import { log } from '../logging';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0';
const LOCALHOST_BASE = 'http://127.0.0.1:';

const LOADED_COOLDOWN = 250;

// TODO: replace with type definitions for slimerjs
interface ResourceRequest {
    url: string;
}

// TODO: replace with type definitions for slimerjs
interface ResourceResponse {
    stage: string;
    url: string;
}

// TODO: replace with type definitions for slimerjs
interface Webpage {
    open(url: string): Promise<string>;
    render(filename: string, options?: object);
    settings: {
        [userAgent: string]: string
    };
    onConsoleMessage: (msg: string) => void;
    onResourceRequested: (requestData, networkRequest) => void;
    onResourceReceived: (response: ResourceResponse) => void;
    onError: (message: string, stack: ErrorStackTraceFrame[]) => void;
}

export class OfflineHeadlessBot {
    static readonly LOAD_TIMEOUT = 180 * 1000; // 3 minutes

    onWindowCreated: null | ((win: object, doc: object) => void);

    readonly webpage: Webpage;
    private webserver;
    private readonly printPageErrors: boolean;
    private readonly logRequests: boolean;
    private readonly trackDOMMutations: boolean;

    private pendingRequestCount: number;
    private notifyPageIsLoaded: null | (() => void);
    private loadedWatchdog: number | null;
    private lastDOMMutation: number | null;

    private mutationObserver: MutationObserver | null;

    constructor(
        printPageErrors=false,
        printPageConsoleLog=true,
        mapURLs: object,
        resources: object,
    ) {
        this.createWebServer(mapURLs, resources);
        this.webpage = createWebpage();
        this.printPageErrors = printPageErrors;
        this.logRequests = true;
        this.trackDOMMutations = true;

        if (printPageConsoleLog) {
            this.webpage.onConsoleMessage = msg => console.log('webpage> ' + msg);
        }

        this.webpage.settings.userAgent = USER_AGENT;

        this.onWindowCreated = null;
        this.pendingRequestCount = 0;
        this.notifyPageIsLoaded = null;
        this.loadedWatchdog = null;
        this.mutationObserver = null;
        this.lastDOMMutation = null;

        WindowEvents.on(WindowEvents.DOCUMENT_CREATED_EVENT, (win, doc) => {
            if (
                win === getWrappedWindow(this.webpage) && this.onWindowCreated
            ) {
                this.onWindowCreated(win, doc);
                if (this.trackDOMMutations) {
                    this.mutationObserver = observeMutations(win, () => {
                        this.lastDOMMutation = Date.now();
                    });
                }
            }
        });

        this.webpage.onResourceRequested = this.handleRequest.bind(this);
        this.webpage.onResourceReceived = this.handleResponse.bind(this);

        this.webpage.onError = (message, stack) => {
            if (this.printPageErrors) {
                system.stderr.write(
                    'JavaScript error: ' + message + '\nStack:\n' +
                    formatStack(stack) + '\n'
                );
            }
        };
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

    private handleRequest(req: ResourceRequest, networkRequest): void {
        const reqUrl = new URL(req.url);
        const path = reqUrl.pathname + reqUrl.search;
        if (reqUrl.host !== '127.0.0.1:' + this.webserver.port) {
            networkRequest.changeUrl(
                LOCALHOST_BASE + this.webserver.port + path,
            );
        }

        this.pendingRequestCount++;
        this.notifyLoadingContinues();
        if (this.logRequests) {
            log(
                `requested: ${req.url} count now ` +
                `${this.pendingRequestCount}`
            );
        }
    }

    private handleResponse(response: ResourceResponse): void {
        if (response.stage !== 'end') {
            return;
        }
        this.pendingRequestCount--;
        if (this.logRequests) {
            log(
                `request done ${response.url}: ` +
                `count now ${this.pendingRequestCount}`
            );
        }
        if (this.pendingRequestCount === 0) {
            this.ensurePageIsLoaded();
        }
    }

    private ensurePageIsLoaded(): void {
        this.loadedWatchdog = window.setTimeout(() => {
            if (
                this.pendingRequestCount !== 0 ||
                this.notifyPageIsLoaded === null
            ) {
                return;
            }

            if (this.trackDOMMutations) {
                let sinceLastMutation = Infinity;

                if (this.lastDOMMutation !== null) {
                    sinceLastMutation = Date.now() - this.lastDOMMutation;
                }

                if (sinceLastMutation < LOADED_COOLDOWN) {
                    if (this.logRequests) {
                        log('DOM was mutated, wait a bit more to load!');
                    }
                    this.ensurePageIsLoaded();
                    return;
                }
            }

            this.notifyPageIsLoaded();
            if (this.logRequests) {
                log('all requests done and page is loaded');
            }
        }, LOADED_COOLDOWN);
    }

    private notifyLoadingContinues(): void {
        if (this.loadedWatchdog !== null) {
            window.clearTimeout(this.loadedWatchdog);
            this.loadedWatchdog = null;
        }
    }

    async navigate(url: string): Promise<void> {
        let status: string | null = null;
        try {
            status = await withTimeout(
                this.webpage.open(url),
                OfflineHeadlessBot.LOAD_TIMEOUT
            );
        } catch (e) {
            if (e instanceof TimeoutError) {
                log(
                    `Warning: timed out waiting for page ${url} to load`
                );
            } else {
                throw e;
            }
        }

        if (status !== null && status !== 'success') {
            throw new Error('Failed to open URL ' + url);
        }

        const delay = wait(LOADED_COOLDOWN);
        const pageIsLoaded = new Promise(resolve => {
            this.notifyPageIsLoaded = resolve;
        });
        await delay;

        if (this.pendingRequestCount === 0 && this.notifyPageIsLoaded) {
            this.ensurePageIsLoaded();
        }

        try {
            await withTimeout(pageIsLoaded, OfflineHeadlessBot.LOAD_TIMEOUT);
        } catch (e) {
            if (e instanceof TimeoutError) {
                log(
                    `Warning: timed out waiting for all requests from ${url} ` +
                    `to finish!`
                );
            } else {
                throw e;
            }
        } finally {
            if (this.mutationObserver !== null) {
                this.mutationObserver.disconnect();
            }
        }
    }
}
