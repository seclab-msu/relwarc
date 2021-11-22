import type { Value } from './generic';
import { isUnknown } from './unknown';
import { FormDataModel } from './form-data';
import { FunctionValue } from './function';

import { ValueSet } from './value-set';

export function deepCopyObject(o: Value): Value {
    if (typeof o === 'function') {
        throw new Error('deepCopyObject: unexpected function');
    }
    if (typeof o !== 'object' || o === null) {
        return o;
    }
    if (isUnknown(o)) {
        return o;
    }
    if (Array.isArray(o)) {
        return o.map(el => deepCopyObject(el));
    }
    if (o instanceof ValueSet) {
        return o.clone();
    }
    if (o instanceof FormDataModel) {
        return o.copy();
    }
    if (o instanceof FunctionValue || o instanceof RegExp || o instanceof URL) {
        return o;
    }
    const result = {};
    for (const k of Object.keys(o)) {
        result[k] = deepCopyObject(o[k]);
    }
    return result;
}
