const system = require('system');

const { create: createWebpage } = require('webpage');

const WindowEvents = require('./window-events');

import { getWrappedWindow } from '../utils/window';
import { wait, formatStack, ErrorStackTraceFrame } from '../utils/common';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0';

// TODO: replace with type definitions for slimerjs
interface ResourceResponse {
    stage: string;
}

// TODO: replace with type definitions for slimerjs
interface Webpage {
    open(url: string): Promise<string>;
    settings: {
        [userAgent: string]: string
    };
    onConsoleMessage: (msg: string) => void;
    onResourceRequested: () => void;
    onResourceReceived: (response: ResourceResponse) => void;
    onError: (message: string, stack: ErrorStackTraceFrame[]) => void;
}

export class HeadlessBot {
    onWindowCreated: null | ((win: object, doc: object) => void);

    private readonly webpage: Webpage;
    private readonly printPageErrors: boolean;

    private pendingRequestCount: number;
    private notifyAllRequestsAreDone: null | (() => void);

    constructor(printPageErrors=false, printPageConsoleLog=true) {
        this.webpage = createWebpage();
        this.printPageErrors = printPageErrors;

        if (printPageConsoleLog) {
            this.webpage.onConsoleMessage = msg => console.log('webpage> ' + msg);
        }

        this.webpage.settings.userAgent = USER_AGENT;

        this.onWindowCreated = null;
        this.pendingRequestCount = 0;
        this.notifyAllRequestsAreDone = null;

        WindowEvents.on(WindowEvents.DOCUMENT_CREATED_EVENT, (win, doc) => {
            if (
                win === getWrappedWindow(this.webpage) && this.onWindowCreated
            ) {
                this.onWindowCreated(win, doc);
            }
        });

        this.webpage.onResourceRequested = () => {
            this.pendingRequestCount++;
        };

        this.webpage.onResourceReceived = response => {
            if (response.stage !== 'end') {
                return;
            }
            this.pendingRequestCount--;
            if (
                this.pendingRequestCount === 0 && this.notifyAllRequestsAreDone
            ) {
                this.notifyAllRequestsAreDone();
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

    async navigate(url: string): Promise<void> {
        const status: string = await this.webpage.open(url);

        if (status !== 'success') {
            throw new Error('Failed to open URL ' + url);
        }

        const delay = wait(100);
        const allRequestsAreDone = new Promise(resolve => {
            this.notifyAllRequestsAreDone = resolve;
        });
        await delay;
        if (this.pendingRequestCount === 0 && this.notifyAllRequestsAreDone) {
            this.notifyAllRequestsAreDone();
        }
        await allRequestsAreDone;
    }
}
