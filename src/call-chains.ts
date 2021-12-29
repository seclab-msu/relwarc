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

export function callConfigEqual(cc1: CallConfig, cc2: CallConfig): boolean {
    if (cc1.func !== cc2.func) {
        return false;
    }
    if (cc1.chain.length !== cc2.chain.length) {
        return false;
    }
    for (let i = 0; i < cc1.chain.length; i++) {
        const fd1 = cc1.chain[i];
        const fd2 = cc2.chain[i];

        if (
            fd1.callSite !== fd2.callSite ||
            fd1.code !== fd2.code ||
            fd1.type !== fd2.type
        ) {
            return false;
        }
        if (fd1.args.length !== fd2.args.length) {
            return false;
        }
        for (let j = 0; j < fd1.args.length; j++) {
            if (fd1.args[j] !== fd2.args[j]) {
                return false;
            }
        }
    }
    return true;
}
