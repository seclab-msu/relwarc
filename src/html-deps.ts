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

export { mineDEPsFromHTML } from './backend';
