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
    params: KeyValue[];
}

export type FormRequestData = GETFormRequestData | POSTFormRequestData;

export function reqDataFromGETForm(form: HTMLFormElement): GETFormRequestData {
    let action = form.action;

    if (typeof action !== 'string') {
        // @ts-ignore
        const eltAction = action.formAction;
        if (typeof eltAction === 'string') {
            action = eltAction;
        } else {
            action = form.getAttribute('action') || '.';
        }
    }

    const url = new URL(action);

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
    // @ts-ignore
    const actionGetter = Object.getOwnPropertyDescriptor(
        HTMLFormElement.prototype,
        'action'
    ).get;
    // @ts-ignore
    const action = actionGetter.call(form);

    const url = new URL(action);

    const encType = form.enctype || defaultEncType;

    const searchParams: KeyValue[] = [];

    for (const el of form.elements) {
        if (!isSupportedFormInput(el)) {
            continue;
        }

        if (!el.name) {
            continue;
        }

        const param: KeyValue = {
            name: el.name,
            value: el.value
        };

        if (el instanceof HTMLInputElement) {
            param.type = el.type;
        }

        searchParams.push(param);
    }

    return {
        method: form.method,
        encType,
        action: url.href,
        params: searchParams
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

            const searchParams = new URLSearchParams();

            for (const param of reqData.params) {
                searchParams.append(param.name, param.value);
            }

            har.setPostData(searchParams.toString(), false, reqData.params);

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
