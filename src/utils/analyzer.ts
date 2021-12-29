import { FormDataModel } from '../types/form-data';
import { FunctionValue } from '../types/function';
import { isUnknown } from '../types/unknown';
import { ValueSet } from '../types/value-set';
import { ClassObject, Instance } from '../types/classes';
import { GlobalWindowObject } from '../types/memory';
import { ModuleObject } from '../module-manager';
import { LibClass, LibObject } from '../types/lib-objects';

import type { Value } from '../types/generic';

type StringPrototype = typeof String.prototype;

type StringMethods = {
    [P in keyof StringPrototype]: StringPrototype[P];
};

function makeStringMethodsSnapshot(): StringMethods {
    const result: Record<string, unknown> = {};

    for (const methodName of Object.getOwnPropertyNames(String.prototype)) {
        if (methodName === 'constructor') {
            continue;
        }
        const method = String.prototype[methodName];

        if (typeof method !== 'function') {
            continue;
        }

        result[methodName] = method;
    }
    return result as StringMethods;
}

export const STRING_METHODS: StringMethods = makeStringMethodsSnapshot();

type RegExpPrototype = typeof RegExp.prototype;

type RegExpPropNames = (keyof RegExpPrototype)[];

function makeRegExpUnsettablePropNamesSnapshot(): RegExpPropNames {
    const result: string[] = [];
    const proto = RegExp.prototype;
    for (const propName of Object.getOwnPropertyNames(proto)) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, propName);
        if (descriptor?.get !== undefined && descriptor.set === undefined) {
            result.push(propName);
        }
    }
    return result as RegExpPropNames;
}

export const REGEXP_UNSETTABLE_PROPS: RegExpPropNames =
    makeRegExpUnsettablePropNamesSnapshot();

export function validateAnalysisPasses(ap: number): void {
    if (ap <= 0 || Math.floor(ap) !== ap) {
        throw new Error(`Invalid number of analysis passes given: ${ap}`);
    }
}

/* eslint complexity: ["error", 18] */

function traverseObject(
    v: Value,
    cb: (innerVal: Value, isCircular: boolean) => boolean,
    already?: Set<Value>
): boolean {
    already = new Set(already);

    const alreadySeen = already.has(v);

    const stop = cb(v, alreadySeen);

    if (alreadySeen || stop) {
        return stop;
    }

    already.add(v);

    if (
        typeof v !== 'object' || v === null || isUnknown(v) ||
        v instanceof URL || v instanceof RegExp ||
        v instanceof URLSearchParams || v instanceof GlobalWindowObject ||
        v instanceof ModuleObject || v instanceof FunctionValue ||
        v instanceof ClassObject || v instanceof LibClass ||
        v instanceof LibObject
    ) {
        return false;
    }

    if (Array.isArray(v) || v instanceof ValueSet) {
        return traverseObjectSequence(v, cb, already);
    }

    if (v instanceof FormDataModel) {
        v = v.getData();
    }

    return traverseKeyValueObject(v, cb, already);
}

function traverseObjectSequence(
    v: Value[] | ValueSet,
    cb: (innerVal: Value, isCircular: boolean) => boolean,
    already?: Set<Value>
): boolean {
    if (v instanceof ValueSet) {
        v = v.getValues();
    }
    for (const el of v) {
        const stop = traverseObject(el, cb, already);
        if (stop) {
            return true;
        }
    }
    return false;
}

function traverseKeyValueObject(
    v: {[key: string]: Value} | Instance,
    cb: (innerVal: Value, isCircular: boolean) => boolean,
    already?: Set<Value>
): boolean {
    for (const k of Object.keys(v)) {
        const stop = traverseObject(v[k], cb, already);

        if (stop) {
            return true;
        }
    }
    return false;
}

export function checkCircularOrValueSet(
    obj: Value
): { isCircular: boolean, hasValueSet: boolean } {
    const result = {
        isCircular: false,
        hasValueSet: false
    };
    traverseObject(obj, (val: Value, isCircular: boolean): boolean => {
        if (val instanceof ValueSet) {
            result.hasValueSet = true;
        }
        if (isCircular) {
            result.isCircular = true;
            return true;
        }
        return false;
    });
    return result;
}
