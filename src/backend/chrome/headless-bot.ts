import * as puppeteer from 'puppeteer';

import { Crawler } from 'minicrawler';

import { HAR } from '../../har';

import {
    DEFAULT_LOAD_TIMEOUT,
    LOADED_COOLDOWN
} from '../../browser/headless-bot';

import type {
    HeadlessBot as GenericHeadlessBot,
    WindowCreatedListener
} from '../../browser/headless-bot';

import { HeadlessBotOptions } from '../../browser/options';

import {
    triggerParsingOfEventHandlerAttributes
} from '../../browser/event-handler-parsing-trigger';

import { withTimeout, TimeoutError, isPromise } from '../../utils/common';

import { log } from '../../logging';

import { addHTMLDynamicDEPLocation } from './html-dep-location';

const EVENT_HANDLER_ATTRIBUTES_ARRIVE_TIMEOUT = 4 * 1000; // 4 sec

type RequestCallback = (request: puppeteer.HTTPRequest) => Promise<void> | void;

export class HeadlessBot implements GenericHeadlessBot {
    private crawler: Crawler | null;
    private pageLoadHTTPStatus: number | null;
    private readonly windowCreatedListeners: WindowCreatedListener[];
    private internalRequestCallback: RequestCallback | null;
    private eventHandlerAttrs: string[] | null;
    private initialContent: string | null;
    private readonly loadTimeout: number;
    private proxy?: string;

    // these fields are used as hacks/workarounds in Slimer, useless here
    readonly pageLoadingStopped: false;
    ignoreSSLError: boolean;

    waitForScriptsCallback: ((scripts: string[]) => Promise<void>) | null;
    requestCallback: RequestCallback | null;

    constructor({
        printPageErrors=false,
        printPageConsoleLog=true,
        logRequests=false,
        debugRequestLoading=false,
        loadTimeout=DEFAULT_LOAD_TIMEOUT,
        proxy=undefined,
    }: HeadlessBotOptions) {
        this.crawler = null;

        this.pageLoadHTTPStatus = null;
        this.pageLoadingStopped = false;
        this.ignoreSSLError = false;
        this.windowCreatedListeners = [];
        this.waitForScriptsCallback = null;
        this.internalRequestCallback = null;
        this.requestCallback = null;
        this.eventHandlerAttrs = null;
        this.initialContent = null;
        this.proxy = proxy;

        this.loadTimeout = loadTimeout * 1000;

        // TODO:
        if (printPageErrors || logRequests || debugRequestLoading) {
            throw new Error(
                'not supported yet: printPageErrors, logRequests, ' +
                'debugRequestLoading'
            );
        }
        if (printPageConsoleLog) {
            log('warning: printPageConsoleLog is not supported yet');
        }
    }

    async navigate(url: string): Promise<void> {
        const crawler = new Crawler(url, true, {}, this.proxy, {
            logXHR: false,
            waitMode: 'load',
            loadedCooldown: LOADED_COOLDOWN,
            timeout: this.loadTimeout,
            extraArgs: ['--no-sandbox', '--ignore-certificate-errors']
        });

        this.crawler = crawler;

        await crawler.pageIsCreated;

        const internalRequestCallback = this.handleRequest.bind(this);

        await crawler.handleRequest(internalRequestCallback);

        this.internalRequestCallback = internalRequestCallback;

        const response = await crawler.loadPage();

        if (response !== null) {
            this.initialContent = await response.text();
        }
        this.pageLoadHTTPStatus = response?.status() || null;
    }
    getPage(): puppeteer.Page | null {
        return this.crawler?.page || null;
    }
    getPageLoadHTTPStatus(): number | null {
        return this.pageLoadHTTPStatus;
    }

    private async handleRequest(request: puppeteer.HTTPRequest): Promise<void> {
        try {
            await this.handleRequestInternal(request);
        } finally {
            request.continue();
        }
    }

    private async handleRequestInternal(
        request: puppeteer.HTTPRequest
    ): Promise<void> {
        const page = this.getPage();
        const main = page?.mainFrame();
        const isOur = request.frame() === main;
        const parent = request.frame()?.parentFrame();
        const isNav = request.isNavigationRequest();
        const isSubframe = parent ? isNav && parent === main : false;

        if (!isOur && !isSubframe) {
            return;
        }

        if (isOur && isNav) {
            for (const cb of this.windowCreatedListeners) {
                const result = cb(this);
                if (isPromise(result)) {
                    await result;
                }
            }
        }
        if (this.requestCallback) {
            this.requestCallback(request);
        }
    }

    async triggerParsingOfEventHandlerAttributes(): Promise<void> {
        const page = this.getPage();
        if (page === null) {
            throw new Error('triggerParsingOfEventHandlerAttributes: no page');
        }
        const handlers = await triggerParsingOfEventHandlerAttributes(page);

        if (!Array.isArray(handlers)) {
            throw new Error('expected handlers to be an array');
        }

        this.eventHandlerAttrs = handlers;

        if (this.waitForScriptsCallback === null) {
            throw new Error('expected waitForScriptsCallback to be present');
        }
        try { // TODO: add tests for this
            await withTimeout(
                this.waitForScriptsCallback(handlers as string[]),
                EVENT_HANDLER_ATTRIBUTES_ARRIVE_TIMEOUT
            );
        } catch (err) {
            if (err instanceof TimeoutError) {
                log('warning: timed out waiting for event handler attrs');
            } else {
                log('Error from waiting for handlers:' + err + ' ' + err.stack);
                throw err;
            }
        }
    }
    getEventHandlerAttrs(): string[] {
        if (this.eventHandlerAttrs === null) {
            throw new Error('Attrs not ready yet');
        }
        return this.eventHandlerAttrs;
    }
    async extractBaseURI(): Promise<string> {
        const page = this.getPage();
        if (page === null) {
            throw new Error('extractBaseURI: page is null');
        }
        return await page.evaluate('window.document.baseURI') as string;
    }

    async addHTMLDynamicDEPLocation(har: HAR): Promise<HAR> {
        const page = this.getPage();
        if (page === null || this.initialContent === null) {
            return har;
        }

        return await addHTMLDynamicDEPLocation(
            har,
            page,
            this.initialContent,
        );
    }
    addWindowCreatedListener(cb: WindowCreatedListener): void {
        this.windowCreatedListeners.push(cb);
    }
    resetWindowCreatedListeners(): void {
        this.windowCreatedListeners.length = 0;
    }
    async close(): Promise<void> {
        if (this.crawler?.page && this.internalRequestCallback) {
            this.crawler?.page?.off('request', this.internalRequestCallback);
            this.internalRequestCallback = null;
        }
        if (this.crawler !== null) {
            await this.crawler.close();
            this.crawler = null;
        }
    }
}
