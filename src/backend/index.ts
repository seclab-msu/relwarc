import type {
    HeadlessBot as SlimerJSHeadlessBot
} from './slimerjs/analyzer/browser/headless-bot';

import type {
    DynamicDEPMiner as SlimerJSDynamicDEPMiner
} from './slimerjs/analyzer/dynamic-deps';

import type {
    mineDEPsFromHTML as SlimerJSMineDEPsFromHTML
} from './slimerjs/analyzer/html-deps';

import type {
    DynamicAnalyzerBackend as SlimerJSDynamicAnalyzerBackend
} from './slimerjs/analyzer/dynamic/analyzer';

import type {
    HeadlessBot as ChromeHeadlessBot
} from './chrome/headless-bot';

import type {
    DynamicDEPMiner as ChromeDynamicDEPMiner
} from './chrome/dynamic-deps';

import type {
    mineDEPsFromHTML as ChromeMineDEPsFromHTML
} from './chrome/html-deps';

import type {
    DynamicAnalyzerBackend as ChromeDynamicAnalyzerBackend
} from './chrome/dynamic-analyzer';

export enum BackendKind {
    SlimerJS = 'slimerjs',
    Chrome = 'chrome'
}

function importSlimerJSBackend() {
    const { HeadlessBot }: {
        HeadlessBot: typeof SlimerJSHeadlessBot
    } = require('./slimerjs/analyzer/browser/headless-bot');
    const { DynamicDEPMiner }: {
        DynamicDEPMiner: typeof SlimerJSDynamicDEPMiner
    } = require('./slimerjs/analyzer/dynamic-deps');
    const { mineDEPsFromHTML }: {
        mineDEPsFromHTML: typeof SlimerJSMineDEPsFromHTML
    } = require('./slimerjs/analyzer/html-deps');
    const { DynamicAnalyzerBackend }: {
        DynamicAnalyzerBackend: typeof SlimerJSDynamicAnalyzerBackend
    } = require('./slimerjs/analyzer/dynamic/analyzer');
    return {
        HeadlessBot,
        DynamicDEPMiner,
        mineDEPsFromHTML,
        DynamicAnalyzerBackend
    };
}

function importChromeBackend() {
    const { HeadlessBot }: {
        HeadlessBot: typeof ChromeHeadlessBot
    } = require('./chrome/headless-bot');
    const { DynamicDEPMiner }: {
        DynamicDEPMiner: typeof ChromeDynamicDEPMiner
    } = require('./chrome/dynamic-deps');
    const { mineDEPsFromHTML }: {
        mineDEPsFromHTML: typeof ChromeMineDEPsFromHTML
    } = require('./chrome/html-deps');
    const { DynamicAnalyzerBackend }: {
        DynamicAnalyzerBackend: typeof ChromeDynamicAnalyzerBackend
    } = require('./chrome/dynamic-analyzer');
    return {
        HeadlessBot,
        DynamicDEPMiner,
        mineDEPsFromHTML,
        DynamicAnalyzerBackend
    };
}

declare const slimer: object | undefined;

function autodetectBackend(): BackendKind {
    if (typeof slimer !== 'undefined') {
        return BackendKind.SlimerJS;
    }
    try {
        require('puppeteer');
        return BackendKind.Chrome;
    } catch {
        throw new Error('Running under unsupported backend');
    }
}

const currentBackend: BackendKind = autodetectBackend();

function importChosenBackend() {
    switch (currentBackend) {
    case BackendKind.SlimerJS:
        return importSlimerJSBackend();
    case BackendKind.Chrome:
        return importChromeBackend();
    default:
        throw new Error('Unknown backend kind: ' + currentBackend);
    }
}

export const {
    HeadlessBot,
    DynamicDEPMiner,
    mineDEPsFromHTML,
    DynamicAnalyzerBackend
} = importChosenBackend();
