import { HAR } from './har';
import { getWrappedWindow } from './utils/window';

type SupportedFormInput =
    | HTMLInputElement
    | HTMLButtonElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

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
        if (form.method !== 'get') {
            // TODO: implement other methods
            console.error('HTML DEPS: non-GET forms not implemened yet');
            continue;
        }

        result.push(harFromGETForm(form));
    }
    return result;
}
