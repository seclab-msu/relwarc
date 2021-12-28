import { HAR } from '../../har';

import type { HeadlessBot as GenericHeadlessBot } from '../../browser/headless-bot';
import { HeadlessBot } from './headless-bot';
import {
    defaultEncType,
    isSupportedFormInput,
    getLinkURLs,
    getFormReqData,
    harFromLinkURL,
    harFromFormReqData,
    reqDataFromGETForm,
    reqDataFromPOSTForm,
    FormRequestData
} from '../../html-deps';

interface MineReqDataResult {
    links: string[],
    forms: FormRequestData[]
}

const getResultCode = `return {
    links: [...getLinkURLs(document)],
    forms: [...getFormReqData(document)]
}`;

const clientCode = [
    `const defaultEncType = "${defaultEncType}";`,
    isSupportedFormInput,
    reqDataFromGETForm,
    reqDataFromPOSTForm,
    getLinkURLs,
    getFormReqData,
    getResultCode
].map(f => f.toString()).join('\n');

export async function mineDEPsFromHTML(
    bot: GenericHeadlessBot
): Promise<HAR[]> {
    if (!(bot instanceof HeadlessBot)) {
        throw new Error(
            'Chrome\'s mineDEPsFromHTML only supports Chrome\'s HeadlessBot'
        );
    }
    const page = bot.getPage();

    if (page === null) {
        throw new Error('mineDEPsFromHTML: bot has no page');
    }

    const code = `(() => {\n${clientCode}\n})()`;
    let data;

    try {
        data = await page.evaluate(code) as MineReqDataResult;
    } catch (err) {
        console.error('Error mining HTML DEPs:', err, err.stack);
        return [];
    }

    const result: HAR[] = [];

    for (const url of data.links) {
        const har = harFromLinkURL(url);

        if (har !== null) {
            result.push(har);
        }
    }

    for (const reqData of data.forms) {
        const har = harFromFormReqData(reqData);

        if (har !== null) {
            result.push(har);
        }
    }

    return result;
}
