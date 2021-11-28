import { HAR, KeyValue, BadURLError } from './har';

import { log } from './logging';

type SupportedFormInput =
    | HTMLInputElement
    | HTMLButtonElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

export const defaultEncType = 'application/x-www-form-urlencoded';

export function isSupportedFormInput(el: Element): el is SupportedFormInput {
    return el instanceof HTMLInputElement ||
        el instanceof HTMLButtonElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement;
}

export function* getLinkURLs(document: HTMLDocument): Generator<string> {
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
        yield a.href;
    }
}

interface GenericFormRequestData {
    method: string;
    action: string;
}

interface GETFormRequestData extends GenericFormRequestData {
    method: 'get';
    action: string;
}

interface POSTFormRequestData extends GenericFormRequestData {
    method: string;
    action: string;
    encType: string;
    params: Record<string, string>;
}

export type FormRequestData = GETFormRequestData | POSTFormRequestData;

export function reqDataFromGETForm(form: HTMLFormElement): GETFormRequestData {
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

    return {
        method: 'get',
        action: url.href
    };
}

export function reqDataFromPOSTForm(
    form: HTMLFormElement
): POSTFormRequestData {
    const url = new URL(form.action);

    const encType = form.enctype || defaultEncType;

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

    return {
        method: form.method,
        encType,
        action: url.href,
        params: searchParamsDict
    };
}

export function* getFormReqData(
    document: HTMLDocument
): Generator<FormRequestData> {
    for (const form of document.getElementsByTagName('form')) {
        if (form.method === 'get') {
            yield reqDataFromGETForm(form);
        } else if (form.method === 'post') {
            yield reqDataFromPOSTForm(form);
        }
    }
}

export function harFromLinkURL(url: string): HAR | null {
    try {
        return new HAR(url);
    } catch (err) {
        if (err instanceof BadURLError) {
            log('warning: BadURLError exception at ' + url);
            return null;
        } else {
            throw err;
        }
    }
}

export function harFromFormReqData(reqData: FormRequestData): HAR | null {
    try {
        if (reqData.method === 'get') {
            return new HAR(reqData.action);
        } else if (reqData.method === 'post') {
            const har = new HAR(reqData.action);

            har.method = 'POST';
            har.headers.push({
                'name': 'Content-Type',
                'value': reqData.encType
            });

            const searchParams = new URLSearchParams(reqData.params);

            if (reqData.encType === 'multipart/form-data') {
                const rawData: KeyValue[] = [];
                for (const [name, value] of searchParams) {
                    rawData.push({ name, value });
                }
                har.setPostData(searchParams.toString(), false, rawData);
            } else {
                har.setPostData(searchParams.toString());
            }

            return har;
        } else {
            // TODO: implement other methods
            console.error('HTML DEPS: non-GET or non-POST forms not implemened yet');
            return null;
        }
    } catch (err) {
        if (err instanceof BadURLError) {
            log('warning: BadURLError exception at ' + reqData.action);
            return null;
        } else {
            throw err;
        }
    }
}

export { mineDEPsFromHTML } from './backend';
