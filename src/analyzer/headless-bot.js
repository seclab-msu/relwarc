"use strict"

const { create: createWebpage } = require('webpage');
const { getWrappedWindow, wait } = require('analyzer/utils');
const WindowEvents = require('analyzer/window-events');

class HeadlessBot {
    constructor() {
        this.webpage = createWebpage();

        this.webpage.onConsoleMessage = msg => console.log('webpage> ' + msg);

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