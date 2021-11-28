import { HAR } from '../../../har';
import { getWrappedWindow } from './utils/window';
import type { HeadlessBot as GenericHeadlessBot } from '../../../browser/headless-bot';

import {
    getLinkURLs,
    getFormReqData,
    harFromLinkURL,
    harFromFormReqData
} from '../../../html-deps';

import { HeadlessBot } from './browser/headless-bot';

export async function mineDEPsFromHTML(
    bot: GenericHeadlessBot
): Promise<HAR[]> {
    const result: HAR[] = [];

    if (!(bot instanceof HeadlessBot)) {
        throw new Error(
            'Slimer\'s mineDEPsFromHTML only supports Slimer\'s HeadlessBot'
        );
    }

    const window: Window = getWrappedWindow(bot.webpage);
    const document = window.document;

    for (const url of getLinkURLs(document)) {
        const har = harFromLinkURL(url);

        if (har !== null) {
            result.push(har);
        }
    }

    for (const reqData of getFormReqData(document)) {
        const har = harFromFormReqData(reqData);

        if (har !== null) {
            result.push(har);
        }
    }
    return result;
}
