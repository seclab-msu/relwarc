import { log } from '../logging';

import type { Value } from './generic';
import { isUnknown, UNKNOWN } from './unknown';
import { FormDataModel } from './form-data';
import { FunctionValue } from './function';

import { ValueSet } from './value-set';

// eslint-disable-next-line max-lines-per-function, complexity
export function deepCopyObject(o: Value, already?: Map<Value, Value>): Value {
    const alreadyCopied: Map<Value, Value> = already || new Map();

    if (typeof o === 'function') {
        log('warning: deepCopyObject: unexpected function');
        return UNKNOWN;
        // throw new Error('deepCopyObject: unexpected function');
    }
    if (typeof o !== 'object' || o === null) {
        return o;
    }
    if (isUnknown(o)) {
        return o;
    }

    if (o instanceof FunctionValue || o instanceof RegExp || o instanceof URL) {
        return o;
    }

    if (alreadyCopied.has(o)) {
        return alreadyCopied.get(o);
    }

    if (Array.isArray(o)) {
        const result: Value[] = [];

        alreadyCopied.set(o, result);

        o.forEach(el => result.push(deepCopyObject(el, alreadyCopied)));

        return result;
    }
    if (o instanceof ValueSet) {
        const result = new ValueSet();

        alreadyCopied.set(o, result);

        o.forEach(el => result.add(deepCopyObject(el, alreadyCopied)));

        return result;
    }
    if (o instanceof FormDataModel) {
        const result = o.copy();

        alreadyCopied.set(o, result);

        return result;
    }

    const result = {};

    alreadyCopied.set(o, result);

    for (const k of Object.keys(o)) {
        result[k] = deepCopyObject(o[k], alreadyCopied);
    }
    return result;
}
