import type { Value, NontrivialValue } from '../types/generic';
import { isUnknown } from '../types/unknown';

export function safeStringFromPrimitive(v: NontrivialValue): string | null {
    switch (typeof v) {
    case 'string':
        return v;
    case 'number':
    case 'boolean':
        return String(v);
    default:
        // NOTE: when type of v is 'object' or any other unexpected, we just
        // refuse to cast it to string
        return null;
    }
}

export function safeToString(v: Value): string {
    if (typeof v === 'undefined' || v === null) {
        return String(v);
    }
    if (isUnknown(v)) {
        return 'UNKNOWN';
    }
    if (v instanceof URL || v instanceof URLSearchParams) {
        return String(v);
    }
    const sv = safeStringFromPrimitive(v);

    if (sv === null) {
        return 'UNKNOWN';
    }
    return sv;
}

export function safeToStringOrRegexp(v: Value): string | RegExp {
    if (v instanceof RegExp) {
        return v;
    }
    return safeToString(v);
}
