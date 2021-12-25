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
    Chrome = 'chrome'
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
    try {
        require('puppeteer');
        return BackendKind.Chrome;
    } catch {
        throw new Error('Running under unsupported backend');
    }
}

export const currentBackend: BackendKind = autodetectBackend();

function importChosenBackend() {
    switch (currentBackend) {
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
