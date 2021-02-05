const system = require('system');

const { create: createWebpage } = require('webpage');

const WindowEvents = require('./window-events');

import { getWrappedWindow } from '../utils/window';
import {
    wait,
    formatStack,
    ErrorStackTraceFrame,
    withTimeout, TimeoutError
} from '../utils/common';

import { log } from '../logging';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0';

const LOADED_COOLDOWN = 400;

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
    render(filename: string, options?: any);
    settings: {
        [userAgent: string]: string
    };
    onConsoleMessage: (msg: string) => void;
    onResourceRequested: (req: ResourceRequest) => void;
    onResourceReceived: (response: ResourceResponse) => void;
    onError: (message: string, stack: ErrorStackTraceFrame[]) => void;
}

export class HeadlessBot {
    static readonly LOAD_TIMEOUT = 180 * 1000; // 3 minutes

    onWindowCreated: null | ((win: object, doc: object) => void);

    readonly webpage: Webpage;
    private readonly printPageErrors: boolean;
    private readonly logRequests: boolean;

    private pendingRequestCount: number;
    private notifyAllRequestsAreDone: null | (() => void);
    private loadedWatchdog: number | null;

    constructor(printPageErrors=false, printPageConsoleLog=true) {
        this.webpage = createWebpage();
        this.printPageErrors = printPageErrors;
        this.logRequests = true;

        if (printPageConsoleLog) {
            this.webpage.onConsoleMessage = msg => console.log('webpage> ' + msg);
        }

        this.webpage.settings.userAgent = USER_AGENT;

        this.onWindowCreated = null;
        this.pendingRequestCount = 0;
        this.notifyAllRequestsAreDone = null;
        this.loadedWatchdog = null;

        WindowEvents.on(WindowEvents.DOCUMENT_CREATED_EVENT, (win, doc) => {
            if (
                win === getWrappedWindow(this.webpage) && this.onWindowCreated
            ) {
                this.onWindowCreated(win, doc);
            }
        });

        this.webpage.onResourceRequested = (req) => {
            this.pendingRequestCount++;
            this.notifyLoadingContinues();
            if (this.logRequests) {
                log(
                    `requested: ${req.url} count now ` +
                    `${this.pendingRequestCount}`
                );
            }
        };

        this.webpage.onResourceReceived = response => {
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
                this.ensureAllRequestsAreDone();
            }
        };

        this.webpage.onError = (message, stack) => {
            if (this.printPageErrors) {
                system.stderr.write(
                    'JavaScript error: ' + message + '\nStack:\n' +
                    formatStack(stack) + '\n'
                );
            }
        };
    }

    ensureAllRequestsAreDone() {
        this.loadedWatchdog = window.setTimeout(() => {
            if (
                this.pendingRequestCount === 0 &&
                this.notifyAllRequestsAreDone
            ) {
                this.notifyAllRequestsAreDone();
                if (this.logRequests) {
                    console.log('all requests done');
                }
            }
         }, LOADED_COOLDOWN);
    }

    notifyLoadingContinues() {
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
                HeadlessBot.LOAD_TIMEOUT
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
        const allRequestsAreDone = new Promise(resolve => {
            this.notifyAllRequestsAreDone = resolve;
        });
        await delay;

        if (this.pendingRequestCount === 0 && this.notifyAllRequestsAreDone) {
            this.ensureAllRequestsAreDone();
        }

        try {
            await withTimeout(allRequestsAreDone, HeadlessBot.LOAD_TIMEOUT);
        } catch (e) {
            if (e instanceof TimeoutError) {
                log(
                    `Warning: timed out waiting for all requests from ${url} ` +
                    `to finish!`
                );
            } else {
                throw e;
            }
        }
    }
}
