import type { NodePath } from '@babel/traverse';
import type { CallExpression } from '@babel/types';

export enum CallConfigType {
    Function,
    Global
}

export interface FunctionDescription {
    type: CallConfigType;
    args: string[];
    code: NodePath;
}

export interface FunctionCallDescription extends FunctionDescription {
    callSite: CallExpression
}

export interface CallConfig {
    func: NodePath;
    chain: FunctionCallDescription[];
}
