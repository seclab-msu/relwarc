import {Unknown, isUnknown, UNKNOWN} from 'analyzer/unknownvalues';

class FromArg extends Unknown {
    readonly tag: string = 'FROM_ARG';
}

export const FROM_ARG = new FromArg();

export function extractFormalArgs(val): [any, boolean] {
    if (val === FROM_ARG) {
        return [UNKNOWN, true];
    }
    if (typeof val === 'string' && val.indexOf('FROM_ARG') !== -1) {
        return [val.replace(/FROM_ARG/g, 'UNKNOWN'), true];
    }
    if (val === null) {
        return [val, false];
    }
    if (typeof val !== 'object' || isUnknown(val)) {
        return [val, false];
    }
    let haveArg = false,
        elt,
        haveArgHere;

    if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
            [elt, haveArgHere] = extractFormalArgs(val[i]);
            val[i] = elt;
            haveArg = haveArg || haveArgHere;
        }
        return [val, haveArg];
    }
    for (let propName of Object.getOwnPropertyNames(val)) {
        [elt, haveArgHere] = extractFormalArgs(val[propName]);
        val[propName] = elt;
        haveArg = haveArg || haveArgHere;
    }
    return [val, haveArg];
}
