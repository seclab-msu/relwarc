import type { HeadlessBot as GenericHeadlessBot } from '../../../browser/headless-bot';
import type { DynamicDEPMiner as GenericDynamicDEPMiner } from '../../../dynamic-deps';
import { ResourceRequest, HeadlessBot } from './browser/headless-bot';
import { decodeLoadType } from './browser/decode-load-type';
import { BadURLError } from '../../../har';
import { log } from '../../../logging';

import { HAR } from '../../../har';

function requestToHar(req: ResourceRequest): HAR | null {
    let har;

    try {
        har = new HAR(req.url);
    } catch (err) {
        if (err instanceof BadURLError) {
            log('warning: BadURLError exception at ' + req.url);
            return null;
        } else {
            throw err;
        }
    }
    har.headers = req.headers;
    har.method = req.method;
    har.initiator = {
        type: decodeLoadType(req.loadType)
    };
    if (req.postData) {
        har.setPostData(req.postData, false);
    }
    return har;
}

export class DynamicDEPMiner implements GenericDynamicDEPMiner {
    private readonly deps: HAR[];
    private bot: HeadlessBot | null;

    constructor(
        bot: GenericHeadlessBot,
        onlyJSDynamicDEPs: boolean,
        recordRequestStackTraces: boolean
    ) {
        if (!(bot instanceof HeadlessBot)) {
            throw new Error(
                'Slimer\'s DEP miner works only with Slimer\'s HeadlessBot'
            );
        }
        this.deps = [];
        bot.requestCallback = req => {
            if (onlyJSDynamicDEPs && (!req.isXHR && !req.isFetch)) {
                return;
            }
            const har = requestToHar(req);
            if (har === null) {
                log('dynamic-page-analyzer: can not create har');
                return;
            }
            if (recordRequestStackTraces) {
                if (typeof har.initiator == 'undefined') {
                    throw new Error('initiator not set by requestToHar');
                }
                const stacktrace = req.stacktrace;
                if (stacktrace !== null) {
                    har.initiator.stack = stacktrace;
                }
            }
            this.deps.push(har);
        };
        this.bot = bot;
    }
    getDEPs(): HAR[] {
        return this.deps;
    }
    close(): void {
        if (this.bot !== null) {
            this.bot.requestCallback = null;
            this.bot = null;
        }
    }
}
