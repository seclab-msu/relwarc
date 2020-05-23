"use strict"

const system = require('system');

const { create: createWebpage } = require('webpage');
const { getWrappedWindow, wait } = require('analyzer/utils');
const WindowEvents = require('analyzer/window-events');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0';

class HeadlessBot {
    constructor(printPageErrors=false) {
        this.webpage = createWebpage();
        this.printPageErrors = printPageErrors;

        this.webpage.onConsoleMessage = msg => console.log('webpage> ' + msg);

        this.webpage.settings.userAgent = USER_AGENT;

        this.onWindowCreated = null;
        this.pendingRequestCount = 0;
        this.notifyAllRequestsAreDone = null;

        WindowEvents.on(WindowEvents.DOCUMENT_CREATED_EVENT, (win, doc) => {
            if (win === getWrappedWindow(this.webpage) && this.onWindowCreated) {
                this.onWindowCreated(win, doc);
            }
        });

        this.webpage.onResourceRequested = () => {
            this.pendingRequestCount++;
        }

        this.webpage.onResourceReceived = response => {
            if (response.stage !== 'end') {
                return;
            }
            this.pendingRequestCount--;
            if (this.pendingRequestCount === 0 && this.notifyAllRequestsAreDone) {
                this.notifyAllRequestsAreDone();
            }
        }

        this.webpage.onError = (message, stack) => {
            if (this.printPageErrors) {
                system.stderr.write(
                    "JavaScript error: " + message + '\nStack:\n' +
                    formatStack(stack) + '\n'
                );
            }
        };

    }

    async navigate(url) {
        const status = await this.webpage.open(url);

        if (status !== 'success') {
            throw new Error('Failed to open URL ' + url);
        }

        const delay = wait(100);
        const allRequestsAreDone = new Promise(resolve => {
            this.notifyAllRequestsAreDone = resolve;
        });
        await delay;
        if (this.pendingRequestCount === 0) {
            this.notifyAllRequestsAreDone();
        }
        await allRequestsAreDone;
    }
}

module.exports = HeadlessBot;