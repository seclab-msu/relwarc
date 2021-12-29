import { FormDataModel } from './form-data';
import { FunctionValue } from './function';
import { ClassObject, Instance } from './classes';
import { GlobalWindowObject } from './memory';
import { ModuleObject } from '../module-manager';
import { LibClass, LibObject } from './lib-objects';
import type { SpecialObject } from './generic';

export function isSpecialObject(ob: unknown): ob is SpecialObject {
    return (
        ob instanceof FormDataModel ||
        ob instanceof FunctionValue ||
        ob instanceof LibObject ||
        ob instanceof LibClass ||
        ob instanceof ModuleObject ||
        ob instanceof ClassObject ||
        ob instanceof Instance ||
        ob instanceof GlobalWindowObject
    );
}

export function isSimpleObject(ob: unknown): boolean {
    if (typeof ob !== 'object') {
        return false;
    }
    if (isSpecialObject(ob)) {
        return false;
    }
    if (ob === null) {
        return false;
    }

    if (ob.constructor !== Object && ob.constructor !== undefined) {
        return false;
    }

    return true;
}

export function isEmptySimpleObject(ob: unknown): boolean {
    if (typeof ob !== 'object') {
        return false;
    }
    if (ob === null) {
        return true;
    }
    if (!isSimpleObject(ob)) {
        return false;
    }
    return Object.keys(ob).length === 0;
}

export function isNonemptyObject(ob: unknown): boolean {
    if (typeof ob !== 'object' || ob === null) {
        return false;
    }
    if (!isSimpleObject(ob)) {
        return true;
    }
    return Object.keys(ob).length > 0;
}
