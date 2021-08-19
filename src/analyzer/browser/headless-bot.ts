const system = require('system');

const { create: createWebpage } = require('webpage');
const { enableRequestStackTraceRecording } = require('net-log');

const WindowEvents = require('./window-events');

import { observeMutations } from './mutation-observer';

import { KeyValue } from '../har';

import { getWrappedWindow } from '../utils/window';
import {
    wait,
    formatStack,
    ErrorStackTraceFrame,
    withTimeout, TimeoutError
} from '../utils/common';

import type { StackFrame } from './stack-frame';

import { log } from '../logging';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0';

const LOADED_COOLDOWN = 250;

const DEFAULT_LOAD_TIMEOUT = 180; // 180 seconds = 3 min

// TODO: replace with type definitions for slimerjs
export interface ResourceRequest {
    url: string;
    method: string;
    headers: KeyValue[];
    postData: string;
    isXHR: boolean;
    isFetch: boolean;
    loadType: number;
    stacktrace: StackFrame[] | null;
}

// TODO: replace with type definitions for slimerjs
interface ResourceResponse {
    stage: string;
    url: string;
    status: number;
    body: string | null;
}

// TODO: replace with type definitions for slimerjs
export interface NetworkRequest {
    changeUrl: (url: string) => void;
}

type WindowCreatedCallback = (win: Window, doc: object) => void;
type ResourceRequestedCallback = (req: ResourceRequest, netReq: NetworkRequest) => void; // eslint-disable-line max-len
type ResourceReceivedCallback = (response: ResourceResponse) => void;

// TODO: replace with type definitions for slimerjs
interface Webpage {
    open(url: string): Promise<string>;
    render(filename: string, options?: object);
    settings: {
        [userAgent: string]: string
    };
    onConsoleMessage: (msg: string) => void;
    onResourceRequested: null | ResourceRequestedCallback;
    onResourceReceived: null | ResourceReceivedCallback;
    onError: (message: string, stack: ErrorStackTraceFrame[]) => void;
    evaluate: (callback: () => void) => void;
    content: string;
    close(): void;
}

export interface HeadlessBotOptions {
    printPageErrors: boolean;
    printPageConsoleLog: boolean;
    logRequests: boolean;
    debugRequestLoading: boolean;
    recordRequestStackTraces?: boolean;
    loadTimeout?: number;
}

export class HeadlessBot {
    onWindowCreated: null | WindowCreatedCallback = null;
    requestCallback: null | ((req: ResourceRequest) => void);

    readonly webpage: Webpage;
    private readonly loadTimeout: number;
    protected readonly printPageErrors: boolean;
    protected readonly logRequests: boolean;
    protected readonly trackDOMMutations: boolean;
    protected initialContent: string;

    protected pendingRequestCount: number;
    protected readonly pendingRequests: string[] | null;
    protected notifyPageIsLoaded: null | (() => void);
    protected loadedWatchdog: number | null;
    protected lastDOMMutation: number | null;

    protected mutationObserver: MutationObserver | null;

    private closed: boolean;
    private windowCreatedCallback: null | WindowCreatedCallback = null;

    constructor({
        printPageErrors=false,
        printPageConsoleLog=true,
        logRequests=false,
        debugRequestLoading=false,
        recordRequestStackTraces=false,
        loadTimeout=DEFAULT_LOAD_TIMEOUT
    }: HeadlessBotOptions) {
        this.webpage = createWebpage();
        this.printPageErrors = printPageErrors;
        this.logRequests = logRequests;
        this.loadTimeout = (loadTimeout || DEFAULT_LOAD_TIMEOUT) * 1000;

        this.requestCallback = null;
        this.trackDOMMutations = true;

        if (printPageConsoleLog) {
            this.webpage.onConsoleMessage = msg => console.log('webpage> ' + msg);
        }

        this.webpage.settings.userAgent = USER_AGENT;
        this.pendingRequestCount = 0;
        this.notifyPageIsLoaded = null;
        this.loadedWatchdog = null;
        this.mutationObserver = null;
        this.lastDOMMutation = null;
        this.initialContent = '';

        if (debugRequestLoading) {
            this.pendingRequests = [];
        } else {
            this.pendingRequests = null;
        }

        this.setupEventHandlers();

        if (recordRequestStackTraces) {
            enableRequestStackTraceRecording(true);
        }

        this.closed = false;
    }

    private setupEventHandlers() {
        this.windowCreatedCallback = (win, doc) => {
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
        };

        WindowEvents.on(
            WindowEvents.DOCUMENT_CREATED_EVENT,
            this.windowCreatedCallback
        );
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

    triggerParsingOfEventHandlerAttributes(): void {
        if (this.closed) {
            throw new Error('headless bot is already closed');
        }

        this.webpage.evaluate(() => {
            const allElements = document.querySelectorAll('*');

            allElements.forEach(elem => {
                const eventHandlers = elem.getAttributeNames().filter(name => {
                    return !name.indexOf('on');
                });
                for (const eventHandler of eventHandlers) {
                    elem[eventHandler];
                }
            });
        });
    }

    protected handleRequest(req: ResourceRequest): void {
        this.pendingRequestCount++;
        if (this.pendingRequests !== null) {
            this.pendingRequests.push(req.url);
        }
        this.notifyLoadingContinues();
        if (this.logRequests) {
            log(
                `requested: ${req.method} ${req.url} count now ` +
                `${this.pendingRequestCount}`
            );
        }
        if (this.requestCallback) {
            this.requestCallback(req);
        }
    }

    protected handleResponse(response: ResourceResponse): void {
        if (response.stage !== 'end') {
            return;
        }
        this.pendingRequestCount--;
        if (this.logRequests) {
            log(
                `request done ${response.url} (status ${response.status}): ` +
                `count now ${this.pendingRequestCount}`
            );
        }
        if (this.pendingRequests !== null) {
            this.pendingRequests.splice(
                this.pendingRequests.indexOf(response.url),
                1
            );
        }
        if (this.pendingRequestCount === 0) {
            this.ensurePageIsLoaded();
        } else if (this.pendingRequests !== null) {
            log('currently, pending requests are:');

            for (const url of this.pendingRequests) {
                log(url);
            }
        }
        if (response.body) {
            this.initialContent = response.body;
        }
    }

    protected ensurePageIsLoaded(): void {
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

    protected notifyLoadingContinues(): void {
        if (this.loadedWatchdog !== null) {
            window.clearTimeout(this.loadedWatchdog);
            this.loadedWatchdog = null;
        }
    }

    async navigate(url: string): Promise<void> {
        if (this.closed) {
            throw new Error('can\'t navigate: headless bot is already closed');
        }

        let status: string | null = null;
        try {
            status = await withTimeout(
                this.webpage.open(url),
                this.loadTimeout
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
        const pageIsLoaded: Promise<void> = new Promise(resolve => {
            this.notifyPageIsLoaded = resolve;
        });
        await delay;

        if (this.pendingRequestCount === 0 && this.notifyPageIsLoaded) {
            this.ensurePageIsLoaded();
        }

        try {
            await withTimeout(pageIsLoaded, this.loadTimeout);
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

    getDecodedInitialContent(): string {
        const rawContentArray = new Uint8Array(this.initialContent.length);
        for (let i = 0; i < this.initialContent.length; i++) {
            rawContentArray[i] = this.initialContent.charCodeAt(i);
        }
        const utf8Decoder = new TextDecoder();
        return utf8Decoder.decode(rawContentArray);
    }

    close(): void {
        this.closed = true;

        WindowEvents.off(
            WindowEvents.DOCUMENT_CREATED_EVENT,
            this.windowCreatedCallback
        );
        this.webpage.onResourceRequested = null;
        this.webpage.onResourceReceived = null;
        this.onWindowCreated = null;
        this.requestCallback = null;
        if (this.notifyPageIsLoaded !== null) {
            this.notifyPageIsLoaded();
            this.notifyPageIsLoaded = null;
        }
        this.webpage.onError = () => {/* noop */};
        if (this.mutationObserver !== null) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
        this.webpage.close();
    }
}
