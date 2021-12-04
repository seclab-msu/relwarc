import type { FormDataModel } from './form-data';
import type { FunctionValue } from './function';
import type { Unknown } from './unknown';
import type { ValueSet } from './value-set';
import type { ClassObject, Instance } from './classes';

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
    | ValueSet
    | ClassObject
    | Instance
    | Value[];

export type Value = TrivialValue | NontrivialValue;
