import type { FormDataModel } from './form-data';
import type { FunctionValue } from './function';
import type { Unknown } from './unknown';


export type Value =
    | undefined
    | null
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
