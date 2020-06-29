import type { FormDataModel } from './form-data';
import type { FunctionValue } from './function';
import type { Unknown } from './unknown';

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
    | Value[];

export type Value = TrivialValue | NontrivialValue;
