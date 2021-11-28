import { HAR, KeyValue, BadURLError } from '../../../har';
import { getWrappedWindow } from './utils/window';
import { log } from '../../../logging';
import type { HeadlessBot as GenericHeadlessBot } from '../../../browser/headless-bot';

import { isSupportedFormInput, defaultEncType } from '../../../html-deps';

import { HeadlessBot } from './browser/headless-bot';


function harFromGETForm(form: HTMLFormElement): HAR | null {
    const url = new URL(form.action);

    for (const el of form.elements) {
        if (!isSupportedFormInput(el)) {
            continue;
        }

        if (!el.name) {
            continue;
        }
        url.searchParams.append(el.name, el.value);
    }

    let har;
    try {
        har = new HAR(url.href);
    } catch (err) {
        if (err instanceof BadURLError) {
            log('warning: BadURLError exception at ' + url.href);
            return null;
        } else {
            throw err;
        }
    }
    return har;
}

function harFromPOSTForm(form: HTMLFormElement): HAR | null {
    let har;
    try {
        har = new HAR(form.action);
    } catch (err) {
        if (err instanceof BadURLError) {
            log('warning: BadURLError exception at ' + form.action);
            return null;
        } else {
            throw err;
        }
    }

    const encType = form.enctype || defaultEncType;

    har.method = 'POST';
    har.headers.push({
        'name': 'Content-Type',
        'value': encType
    });

    const searchParamsDict = {};

    for (const el of form.elements) {
        if (!isSupportedFormInput(el)) {
            continue;
        }

        if (!el.name) {
            continue;
        }

        searchParamsDict[el.name] = el.value;
    }

    const searchParams = new URLSearchParams(searchParamsDict);
    if (encType === 'multipart/form-data') {
        const rawData: KeyValue[] = [];
        for (const [name, value] of searchParams) {
            rawData.push({ name, value });
        }
        har.setPostData(searchParams.toString(), false, rawData);
    } else {
        har.setPostData(searchParams.toString());
    }

    return har;
}

/* eslint-disable-next-line max-lines-per-function, complexity */
export function mineDEPsFromHTML(bot: GenericHeadlessBot): HAR[] {
    const result: HAR[] = [];

    if (!(bot instanceof HeadlessBot)) {
        throw new Error(
            'Slimer\'s mineDEPsFromHTML only supports Slimer\'s HeadlessBot'
        );
    }

    const window: Window = getWrappedWindow(bot.webpage);
    const document = window.document;

    for (const a of document.getElementsByTagName('a')) {
        if (a.href === '') {
            // empty href means href attr was not present at all
            // TODO: add test for it
            continue;
        }
        const origHref = a.getAttribute('href');
        if (origHref !== null && origHref.trim().startsWith('#')) {
            // links to fragments do not actually trigger requests to server
            continue;
        }

        let har;
        try {
            har = new HAR(a.href);
        } catch (err) {
            if (err instanceof BadURLError) {
                log('warning: BadURLError exception at ' + a.href);
                continue;
            } else {
                throw err;
            }
        }

        result.push(har);
    }

    for (const form of document.getElementsByTagName('form')) {
        if (form.method === 'get') {
            const har = harFromGETForm(form);
            if (har !== null) {
                result.push(har);
            }
        } else if (form.method === 'post') {
            const har = harFromPOSTForm(form);
            if (har !== null) {
                result.push(har);
            }
        } else {
            // TODO: implement other methods
            console.error('HTML DEPS: non-GET or non-POST forms not implemened yet');
            continue;
        }
    }
    return result;
}
