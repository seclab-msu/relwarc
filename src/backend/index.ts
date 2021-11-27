import {
    HeadlessBot as SlimerJSHeadlessBot
} from './slimerjs/analyzer/browser/headless-bot';

import {
    DynamicDEPMiner as SlimerJSDynamicDEPMiner
} from './slimerjs/analyzer/dynamic-deps';

import {
    mineDEPsFromHTML as SlimerJSMineDEPsFromHTML
} from './slimerjs/analyzer/html-deps';

import {
    DynamicAnalyzerBackend as SlimerJSDynamicAnalyzerBackend
} from './slimerjs/analyzer/dynamic/analyzer';

export enum BackendKind {
    SlimerJS = 'slimerjs'
    // Chrome
}

declare const slimer: object | undefined;

function autodetectBackend(): BackendKind {
    if (typeof slimer !== 'undefined') {
        return BackendKind.SlimerJS;
    }
    throw new Error('Running under unsupported backend');
}

const currentBackend: BackendKind = autodetectBackend();

export const HeadlessBot = (() => {
    switch (currentBackend) {
    case BackendKind.SlimerJS:
        return SlimerJSHeadlessBot;
    default:
        throw new Error('Unknown backend kind: ' + currentBackend);
    }
})();

export const DynamicDEPMiner = (() => {
    switch (currentBackend) {
    case BackendKind.SlimerJS:
        return SlimerJSDynamicDEPMiner;
    default:
        throw new Error('Unknown backend kind: ' + currentBackend);
    }
})();

export const mineDEPsFromHTML = (() => {
    switch (currentBackend) {
    case BackendKind.SlimerJS:
        return SlimerJSMineDEPsFromHTML;
    default:
        throw new Error('Unknown backend kind: ' + currentBackend);
    }
})();

export const DynamicAnalyzerBackend = (() => {
    switch (currentBackend) {
    case BackendKind.SlimerJS:
        return SlimerJSDynamicAnalyzerBackend;
    default:
        throw new Error('Unknown backend kind: ' + currentBackend);
    }
})();
