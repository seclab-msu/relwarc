const system = require('system');

const { create: createWebpage } = require('webpage');
const { enableRequestStackTraceRecording } = require('net-log');

const WindowEvents = require('./window-events');

import { observeMutations } from './mutation-observer';

import { HAR, KeyValue } from '../../../../har';

import { getWrappedWindow } from '../utils/window';
import {
    wait,
    formatStack,
    ErrorStackTraceFrame,
    withTimeout, TimeoutError
} from '../../../../utils/common';

import type { StackFrame } from '../../../../browser/stack-frame';

import { log } from '../../../../logging';

import type {
    HeadlessBot as GenericHeadlessBot,
    WindowCreatedListener
} from '../../../../browser/headless-bot';

import {
    triggerParsingOfEventHandlerAttributes
} from '../../../../browser/event-handler-parsing-trigger';

import { HeadlessBotOptions } from '../../../../browser/options';

import { addHTMLDynamicDEPLocation } from './html-dep-location';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0';

const LOADED_COOLDOWN = 250;

const DEFAULT_LOAD_TIMEOUT = 180; // 180 seconds = 3 min

const LOADING_SCRIPT_MULTIPLIER = 0.6;

// TODO: replace with type definitions for slimerjs
export interface ResourceRequest {
    id: number;
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
    id: number;
    stage: string;
    url: string;
    status: number;
    body: string | null;
}

interface ResourceError {
    id: number;
    url: string;
    errorCode: number;
    errorString: string;
    status: number;
    statusText: string;
}

// TODO: replace with type definitions for slimerjs
export interface NetworkRequest {
    changeUrl: (url: string) => void;
}

type ResourceRequestedCallback = (req: ResourceRequest, netReq: NetworkRequest) => void; // eslint-disable-line max-len
type ResourceReceivedCallback = (response: ResourceResponse) => void;
type ResourceErrorCallback = (resError: ResourceError) => void;


// TODO: replace with type definitions for slimerjs
interface Webpage {
    open(url: string): Promise<string>;
    render(filename: string, options?: object);
    settings: {
        [userAgent: string]: string
    };
    onConsoleMessage: (msg: string) => void;
    onLongRunningScript: (msg: string) => void;
    onResourceRequested: null | ResourceRequestedCallback;
    onResourceReceived: null | ResourceReceivedCallback;
    onResourceError: null | ResourceErrorCallback;
    onError: (message: string, stack: ErrorStackTraceFrame[]) => void;
    onLoadFinished: (status: string, url: string, isFrame: boolean, httpStatus: number | null) => void; // eslint-disable-line max-len
    evaluate: (callback: () => void) => void;
    stopJavaScript: () => void;
    content: string;
    close(): void;
    stop(): void;
}

export class HeadlessBot implements GenericHeadlessBot {
    private readonly windowCreatedListeners: WindowCreatedListener[];
    requestCallback: null | ((req: ResourceRequest) => void);

    readonly webpage: Webpage;

    private readonly loadTimeout: number;
    private readonly printPageErrors: boolean;
    private readonly logRequests: boolean;
    private readonly debugRequestLoading: boolean;
    private readonly trackDOMMutations: boolean;
    private initialContent: string;

    private readonly pendingRequests: Map<number, string>;
    private notifyPageIsLoaded: null | (() => void);
    private loadedWatchdog: number | null;
    private lastDOMMutation: number | null;
    private loadStartTimestamp: number | null;

    private mutationObserver: MutationObserver | null;

    private closed: boolean;
    private windowCreatedCallback: ((win: Window) => void) | null = null;
    private pageLoadHTTPStatus: number | null = null;

    pageLoadingStopped: boolean;
    ignoreSSLError: boolean;

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
        this.debugRequestLoading = debugRequestLoading;
        this.loadTimeout = (loadTimeout || DEFAULT_LOAD_TIMEOUT) * 1000;

        this.requestCallback = null;
        this.trackDOMMutations = true;

        if (printPageConsoleLog) {
            this.webpage.onConsoleMessage = msg => console.log('webpage> ' + msg);
        }

        this.webpage.settings.userAgent = USER_AGENT;
        this.notifyPageIsLoaded = null;
        this.loadedWatchdog = null;
        this.mutationObserver = null;
        this.lastDOMMutation = null;
        this.loadStartTimestamp = null;
        this.initialContent = '';
        this.windowCreatedListeners = [];

        this.pendingRequests = new Map();

        this.setupEventHandlers();

        if (recordRequestStackTraces) {
            enableRequestStackTraceRecording(true);
        }

        this.ignoreSSLError = false;
        this.pageLoadingStopped = false;

        this.closed = false;
    }

    private setupEventHandlers() {
        this.windowCreatedCallback = (win: Window): void => {
            if (win === getWrappedWindow(this.webpage)) {
                for (const cb of this.windowCreatedListeners) {
                    cb(this);
                }
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
        this.webpage.onResourceError = this.handleError.bind(this);
        this.webpage.onLongRunningScript = this.onLongRunningScript.bind(this);

        this.webpage.onError = (message, stack) => {
            if (this.printPageErrors) {
                system.stderr.write(
                    'JavaScript error: ' + message + '\nStack:\n' +
                    formatStack(stack) + '\n'
                );
            }
        };

        this.webpage.onLoadFinished = (_, __, isSubframe, statusCode) => {
            if (!isSubframe) {
                this.pageLoadHTTPStatus = statusCode;
            }
        };
    }

    getPageLoadHTTPStatus(): number | null {
        return this.pageLoadHTTPStatus;
    }

    async triggerParsingOfEventHandlerAttributes(): Promise<void> {
        if (this.closed) {
            throw new Error('headless bot is already closed');
        }

        await triggerParsingOfEventHandlerAttributes(this.webpage);
    }

    protected onLongRunningScript(): void {
        if (this.loadStartTimestamp) {
            const loadingTime = Date.now() - this.loadStartTimestamp;
            if (loadingTime >= this.loadTimeout * LOADING_SCRIPT_MULTIPLIER) {
                this.webpage.stopJavaScript();
            }
        }
    }

    protected handleRequest(req: ResourceRequest): void {
        this.pendingRequests.set(req.id, req.url);

        this.notifyLoadingContinues();
        if (this.logRequests) {
            log(
                `requested: ${req.method} ${req.url} count now ` +
                `${this.pendingRequests.size}`
            );
        }
        if (this.requestCallback) {
            this.requestCallback(req);
        }
    }

    protected handleError(resError: ResourceError): void {
        this.pendingRequests.delete(resError.id);

        if (this.logRequests) {
            log(
                `request error ${resError.url} ` +
                `(error: ${resError.errorString}): ` +
                `count now ${this.pendingRequests.size}`
            );
        }

        if (
            resError.errorCode === 99 &&
            resError.errorString.includes('NS_ERROR_ABORT') &&
            !this.ignoreSSLError
        ) {
            log(
                `request: ${resError.url} was aborted ` +
                `with ${resError.errorCode} error code`
            );
            this.webpage.stop();
            this.webpage.close();
            this.pendingRequests.clear();
            this.pageLoadingStopped = true;
        }
    }

    protected handleResponse(response: ResourceResponse): void {
        if (response.stage !== 'end') {
            return;
        }

        this.pendingRequests.delete(response.id);

        if (this.logRequests) {
            log(
                `request done ${response.url} (status ${response.status}): ` +
                `count now ${this.pendingRequests.size}`
            );
        }

        if (this.pendingRequests.size === 0) {
            this.ensurePageIsLoaded();
        } else if (this.debugRequestLoading) {
            log('currently, pending requests are:');

            for (const url of this.pendingRequests.values()) {
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
                this.pendingRequests.size !== 0 ||
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

    getEventHandlerAttrs(): string[] {
        // this should not be needed under SlimerJS
        throw new Error('Not implemented under SlimerJS');
    }

    async navigate(url: string): Promise<void> {
        if (this.closed) {
            throw new Error('can\'t navigate: headless bot is already closed');
        }

        this.pageLoadingStopped = false;
        let status: string | null = null;
        try {
            this.loadStartTimestamp = Date.now();
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

        if (status !== null && status !== 'success' && !this.pageLoadingStopped) {
            throw new Error('Failed to open URL ' + url);
        }

        const delay = wait(LOADED_COOLDOWN);
        const pageIsLoaded: Promise<void> = new Promise(resolve => {
            this.notifyPageIsLoaded = resolve;
        });
        await delay;

        if (this.pendingRequests.size === 0 && this.notifyPageIsLoaded) {
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

    private getDecodedInitialContent(): string {
        const rawContentArray = new Uint8Array(this.initialContent.length);
        for (let i = 0; i < this.initialContent.length; i++) {
            rawContentArray[i] = this.initialContent.charCodeAt(i);
        }
        const utf8Decoder = new TextDecoder();
        return utf8Decoder.decode(rawContentArray);
    }

    async extractBaseURI(): Promise<string> {
        const window: Window = getWrappedWindow(this.webpage);
        const document = window.document;
        return document.baseURI;
    }

    addHTMLDynamicDEPLocation(har: HAR): HAR {
        return addHTMLDynamicDEPLocation(
            har,
            this.webpage,
            this.getDecodedInitialContent()
        );
    }

    addWindowCreatedListener(cb: WindowCreatedListener): void {
        this.windowCreatedListeners.push(cb);
    }

    resetWindowCreatedListeners(): void {
        this.windowCreatedListeners.length = 0;
    }

    async close(): Promise<void> {
        this.closed = true;

        WindowEvents.off(
            WindowEvents.DOCUMENT_CREATED_EVENT,
            this.windowCreatedCallback
        );
        this.webpage.onResourceRequested = null;
        this.webpage.onResourceReceived = null;
        this.windowCreatedListeners.length = 0;
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
