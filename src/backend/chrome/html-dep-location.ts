import * as puppeteer from 'puppeteer';
import { readFileSync } from 'fs';

import { HAR, HTMLInfo } from '../../har';

import {
    LoadTypeTagAssociation,
    isElementWithSrc,
    srcSetContainsURL,
    getHTMLElementInfo,
    setElementLocation,
} from '../../html-dep-location';

import {
    findCssSelector,
    findNodeAndContainer,
    positionInNodeList
} from '../../browser/find-css-selector';

const getResult = `
const htmlInfo = getHTMLElementInfo(
    url, document, initiatorType
);
return htmlInfo;`;

const srcSetLib = `const srcsetModule = {};
(function(exports) {` +
readFileSync(require.resolve('srcset-parse')) +
`})(srcsetModule);
const parse = srcsetModule.default;`;

const findCSSSelectorRegex = /find_css_selector_[a-zA-Z0-9]+\./g;
const srcsetParseRegex = /srcset_parse_[a-zA-Z0-9]+\.default/g;

const clientLoadTypeTagAssociation = {};
for (const key of Object.keys(LoadTypeTagAssociation)) {
    clientLoadTypeTagAssociation[key] = LoadTypeTagAssociation[key];
}

const clientCode = [
    srcSetLib,
    `const LoadTypeTagAssociation = ${
        JSON.stringify(clientLoadTypeTagAssociation)
    };`,
    isElementWithSrc,
    srcSetContainsURL,
    getHTMLElementInfo,
    findCssSelector,
    findNodeAndContainer,
    positionInNodeList,
    getResult,
].map(f => f.toString()).join('\n').replace(findCSSSelectorRegex, '').replace(srcsetParseRegex, 'parse');

export async function addHTMLDynamicDEPLocation(
    har: HAR,
    page: puppeteer.Page,
    content: string,
): Promise<HAR> {
    if (har.initiator?.type && har.initiator.type in LoadTypeTagAssociation) {
        const code = `((url, initiatorType) => {
            ${clientCode}
        })('${har.url}', '${har.initiator?.type}')`;
        const htmlInfo = await page.evaluate(code) as HTMLInfo;
        har.initiator.htmlInfo = htmlInfo;
        const location = await page.evaluate(
            () => document.location.toString()
        );
        setElementLocation(har, content, location);
    }
    return har;
}
