import { HAR, KeyValue } from './har';
import { getWrappedWindow } from './utils/window';

type SupportedFormInput =
    | HTMLInputElement
    | HTMLButtonElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

const defaultEncType = 'application/x-www-form-urlencoded';

function isSupportedFormInput(el: Element): el is SupportedFormInput {
    return el instanceof HTMLInputElement ||
        el instanceof HTMLButtonElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement;
}

function harFromGETForm(form: HTMLFormElement): HAR {
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
    return new HAR(url.href);
}

function harFromPOSTForm(form: HTMLFormElement): HAR {
    const har = new HAR(form.action);

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

export function mineDEPsFromHTML(webpage: object): HAR[] {
    const result: HAR[] = [];

    const window: Window = getWrappedWindow(webpage);
    const document = window.document;

    for (const a of document.getElementsByTagName('a')) {
        if (a.href === '') {
            // empty href means href attr was not present at all
            // TODO: add test for it
            continue;
        }
        result.push(new HAR(a.href));
    }

    for (const form of document.getElementsByTagName('form')) {
        if (form.method === 'get') {
            result.push(harFromGETForm(form));
        } else if (form.method === 'post') {
            result.push(harFromPOSTForm(form));
        } else {
            // TODO: implement other methods
            console.error('HTML DEPS: non-GET or non-POST forms not implemened yet');
            continue;
        }
    }
    return result;
}
