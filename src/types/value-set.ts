import type { Value } from './generic';

import { isUnknown } from './unknown';
import { FormDataModel } from './form-data';
import { FunctionValue } from './function';

// import { log } from '../logging';

import { deepCopyObject } from './deep-copy';

const VALUE_SET_MAX: number | null = 100;

type TravCb = (val: Value, replace: (newVal: Value) => void) => boolean;

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
        return traverseValueSet(o, f);
    }
    if (Array.isArray(o)) {
        return traverseArrayObject(o, f);
    }
    return traverseKVObject(o as (Record<string, Value> | FormDataModel), f);
}

function traverseValueSet(vs: ValueSet, f: TravCb): boolean {
    for (const el of vs.getValues()) {
        let shouldContinue = f(el, newVal => {
            vs.delete(el);
            vs.add(newVal);
        });
        if (!shouldContinue) {
            return false;
        }
        if (typeof el === 'object' && el !== null) {
            shouldContinue = traverseObject(el, f);
            if (!shouldContinue) {
                return false;
            }
        }
    }
    return true;
}

function traverseArrayObject(o: Value[], f: TravCb): boolean {
    for (let i = 0; i < o.length; i++) {
        let shouldContinue = f(o[i], newVal => {
            o[i] = newVal;
        });
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
        let shouldContinue = f(o[k], newVal => {
            o[k] = newVal;
        });

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
                for (const val of s.values) {
                    vs.add(val);
                }
            } else {
                vs.add(s);
            }
        }
        return vs;
    }

    add(elem: Value): void {
        if (elem instanceof ValueSet) {
            elem.forEach(el => this.add(el));
            return;
        }
        if (VALUE_SET_MAX !== null && this.values.size >= VALUE_SET_MAX) {
            return;
        }
        this.values.add(elem);
    }

    delete(elem: Value): void {
        this.values.delete(elem);
    }

    clone(already?: Map<Value, Value>): ValueSet {
        return this.map(el => deepCopyObject(el, already));
    }

    join(...sets: Value[]): ValueSet {
        return ValueSet.join(...[this as Value].concat(sets));
    }

    toString(tok?: symbol): string {
        if (tok === ValueSet.toStringToken) {
            return 'ValueSet {' + Array.from(this.values).map(
                v => JSON.stringify(v)
            ).join(', ') + '}';
        }
        // TODO(asterite): debug reasons for this
        /* log(
            'warning: ' + this.toString(ValueSet.toStringToken) +
            'converted to string'
        );*/
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

    static map2(
        v1: Value, v2: Value,
        f: (x: Value, y: Value) => Value
    ): ValueSet {
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

    private static _produceCombinations(ob: Value, results: Value[]): Value[] {
        if (isUnknown(ob)) {
            results.push(ob);
            return results;
        }

        if (typeof ob === 'function') {
            throw new Error('Did not expect to see a function');
        }

        if (typeof ob !== 'object') {
            results.push(ob);
            return results;
        }

        const newObVersions: Value[] = [];

        if (ob instanceof ValueSet) {
            ob.forEach(el => ValueSet.produceCombinations(el, results));
            return results;
        }

        traverseObject(ob, (v, replace) => {
            if (v instanceof ValueSet) {
                for (const el of v.values) {
                    replace(el);
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
        return ValueSet._produceCombinations(deepCopyObject(ob), results || []);
    }

    getValues(): Value[] {
        return Array.from(this.values.values());
    }
    forEach(f: (v: Value) => void): void {
        this.values.forEach(f);
    }
    toStringValueSet(): ValueSet {
        const result = new ValueSet();

        for (const v of this.values) {
            result.add(String(v));
        }
        return result;
    }
}
