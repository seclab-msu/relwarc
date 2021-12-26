import type { FormDataModel } from './form-data';
import type { FunctionValue } from './function';
import type { Unknown } from './unknown';
import type { ValueSet } from './value-set';
import type { ClassObject, Instance } from './classes';
import type { GlobalWindowObject } from './memory';
import type { ModuleObject } from '../module-manager';
import type { LibClass, LibObject } from './lib-objects';

export type TrivialValue = undefined | null;

export type SpecialObject =
    | FormDataModel
    | LibObject
    | LibClass
    | ModuleObject
    | ClassObject
    | Instance
    | GlobalWindowObject
    | FunctionValue;

export type NontrivialValue =
    | string
    | number
    | boolean
    | { [key: string]: TrivialValue | NontrivialValue }
    | Unknown
    | RegExp
    | URL
    | URLSearchParams
    | ValueSet
    | Value[]
    | SpecialObject;

export type Value = TrivialValue | NontrivialValue;
