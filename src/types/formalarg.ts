import { Unknown, isUnknown, UNKNOWN } from './unknown';
import type { Value, NontrivialValue } from './generic';
import { ValueSet } from './value-set';

class FromArg extends Unknown {
    readonly tag: string = 'FROM_ARG';
}

export const FROM_ARG = new FromArg();

function extractFormalArgsFromObject(
    val: NontrivialValue,
    computed: Value[]
): [NontrivialValue, boolean] {
    let haveArg = false,
        elt,
        haveArgHere,
        newPropName;

    for (const propName of Object.getOwnPropertyNames(val)) {
        [newPropName, haveArgHere] = extractFormalArgs(propName, computed);
        if (haveArgHere) {
            haveArg = true;
            val[newPropName] = val[propName];
            delete val[propName];
        }

        [elt, haveArgHere] = extractFormalArgs(val[newPropName], computed);
        val[newPropName] = elt;

        haveArg = haveArg || haveArgHere;
    }
    return [val, haveArg];
}

function extractFormalArgsFromValueSet(
    val: ValueSet,
    computed: Value[]
): [Value, boolean] {
    const replacements: Array<[Value, Value]> = [];
    let haveArg = false;

    val.forEach(v => {
        const [nv, haveArgHere] = extractFormalArgs(v, computed);
        haveArg = haveArg || haveArgHere;
        if (nv !== v) {
            replacements.push([v, nv]);
        }
    });
    for (const [oldVal, newVal] of replacements) {
        val.delete(oldVal);
        val.add(newVal);
    }
    return [val, haveArg];
}

export function extractFormalArgs(
    val: Value,
    computed: Value[] = []
): [Value, boolean] {
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

    if (computed.includes(val)) {
        return [{}, false];
    }
    computed.push(val);

    if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
            [elt, haveArgHere] = extractFormalArgs(val[i], computed);
            val[i] = elt;
            haveArg = haveArg || haveArgHere;
        }
        return [val, haveArg];
    }

    if (val instanceof ValueSet) {
        return extractFormalArgsFromValueSet(val, computed);
    }

    return extractFormalArgsFromObject(val, computed);
}
