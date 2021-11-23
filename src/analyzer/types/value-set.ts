import type { Value } from './generic';

import { isUnknown } from './unknown';
import { FormDataModel } from './form-data';
import { FunctionValue } from './function';

import { log } from '../logging';

import { deepCopyObject } from './deep-copy';

const VALUE_SET_MAX: number | null = 100;

type TravCb = (
    ob: Array<Value> | Record<string, Value> | FormDataModel,
    k: string | number
) => boolean;

function traverseObject(o: Value, f: TravCb): boolean {
    if (typeof o !== 'object' || o === null || isUnknown(o)) {
        return true;
    }
    if (
        o instanceof FunctionValue ||
        o instanceof RegExp ||
        o instanceof URL
    ) {
        return true;
    }
    if (o instanceof ValueSet) {
        throw new Error('Unexpected ValueSet');
    }
    if (Array.isArray(o)) {
        return traverseArrayObject(o, f);
    }
    return traverseKVObject(o as (Record<string, Value> | FormDataModel), f);
}

function traverseArrayObject(o: Value[], f: TravCb): boolean {
    for (let i = 0; i < o.length; i++) {
        let shouldContinue = f(o, i);
        if (!shouldContinue) {
            return false;
        }
        if (typeof o[i] === 'object' && o[i] !== null) {
            shouldContinue = traverseObject(o[i], f);
            if (!shouldContinue) {
                return false;
            }
        }
    }
    return true;
}

function traverseKVObject(
    o: Record<string, Value> | FormDataModel,
    f: TravCb
): boolean {
    for (const k of Object.keys(o)) {
        let shouldContinue = f(o as Record<string, Value>, k);

        if (!shouldContinue) {
            return false;
        }
        if (typeof o[k] === 'object' && o[k] !== null) {
            shouldContinue = traverseObject(o[k], f);
            if (!shouldContinue) {
                return false;
            }
        }
    }
    return true;
}

export class ValueSet {
    private readonly values: Set<Value>;

    static toStringToken = Symbol();

    constructor(values?: Iterable<Value>) {
        this.values = new Set(values);
    }

    static join(...sets: Value[]): ValueSet {
        const vs = new ValueSet();

        for (const s of sets) {
            if (s instanceof ValueSet) {
                for (const v of s.values) {
                    vs.add(v);
                }
            } else {
                vs.add(s);
            }
        }
        return vs;
    }

    add(elem: Value): void {
        if (VALUE_SET_MAX !== null && this.values.size >= VALUE_SET_MAX) {
            return;
        }
        this.values.add(elem);
    }

    clone(): ValueSet {
        return new ValueSet(this.values);
    }

    join(...sets: Value[]): ValueSet {
        return ValueSet.join([this as Value].concat(sets));
    }

    toString(tok?: symbol): string {
        if (tok === ValueSet.toStringToken) {
            return 'ValueSet {' + Array.from(this.values).join(', ') + '}';
        }
        log(
            'warning: ' + this.toString(ValueSet.toStringToken) +
            'converted to string'
        );
        return 'UNKNOWN';
        // throw new Error('ValueSet converted to string');
    }

    static map(v: Value, f: (Value) => Value): Value {
        if (v instanceof ValueSet) {
            return v.map(f);
        }
        return f(v);
    }

    map(f: (Value) => Value): ValueSet {
        const result = new ValueSet();

        for (const v of this.values) {
            result.add(f(v));
        }
        return result;
    }

    static map2(v1: Value, v2: Value, f: (x: Value, y: Value) => Value): ValueSet {
        const result = new ValueSet();

        const applyToFirst = val1 => {
            const applyToSecond = val2 => {
                result.add(f(val1, val2));
            };
            if (v2 instanceof ValueSet) {
                v2.values.forEach(val2 => applyToSecond(val2));
            } else {
                applyToSecond(v2);
            }
        };
        if (v1 instanceof ValueSet) {
            v1.values.forEach(val1 => applyToFirst(val1));
        } else {
            applyToFirst(v1);
        }
        return result;
    }

    private static _produceCombinations(ob: Value, results?: Value[]): Value[] {
        results = results || [];

        if (isUnknown(ob)) {
            return [ob];
        }

        if (typeof ob === 'function') {
            throw new Error('Did not expect to see a function');
        }

        if (typeof ob !== 'object') {
            return [ob];
        }

        const newObVersions: Value[] = [];

        traverseObject(ob, (innerObject, k) => {
            const v = innerObject[k];

            if (v instanceof ValueSet) {
                for (const el of v.values) {
                    innerObject[k] = el;
                    newObVersions.push(deepCopyObject(ob));
                }
                return false; // stop traversal here
            }
            return true;
        });

        if (newObVersions.length > 0) {
            for (const newOb of newObVersions) {
                ValueSet.produceCombinations(newOb, results);
            }
        } else {
            // no changes were made to ob - it did not contain ValueSets
            results.push(ob);
        }
        return results;
    }

    static produceCombinations(ob: Value, results?: Value[]): Value[] {
        return ValueSet._produceCombinations(deepCopyObject(ob), results);
    }

    getValues(): Value[] {
        return Array.from(this.values.values());
    }
}
