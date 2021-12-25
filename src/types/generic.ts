import type { FormDataModel } from './form-data';
import type { FunctionValue } from './function';
import type { Unknown } from './unknown';
import type { ValueSet } from './value-set';
import type { ClassObject, Instance } from './classes';
import type { GlobalWindowObject } from './memory';
import type { ModuleObject } from '../module-manager';

export type TrivialValue = undefined | null;

export type NontrivialValue =
    | string
    | number
    | boolean
    | Record<string, unknown>
    | Unknown
    | RegExp
    | FunctionValue
    | FormDataModel
    | URL
    | URLSearchParams
    | ValueSet
    | ClassObject
    | Instance
    | Value[]
    | GlobalWindowObject
    | ModuleObject;

export type Value = TrivialValue | NontrivialValue;
