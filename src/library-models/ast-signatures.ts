import { Node as ASTNode } from '@babel/types';

import { ASTPatternMatcher } from 'js-ast-matcher';

import type { Class } from '../types/classes';

const astMatcher = new ASTPatternMatcher();

type ASTSignature = Record<string, unknown>;

interface MethodSignature {
    params?: ASTSignature[];
    body?: ASTSignature;
}

interface ClassASTSignature {
    isAJAXCall: boolean;
    methods: Record<string, MethodSignature>;
}

export type ClassASTSignatureSet = Record<string, ClassASTSignature>;

function match(sgn: ASTSignature, node: ASTNode): boolean {
    return astMatcher.matchSubtree(sgn, node);
}

function matchSingleClassSignature(
    sgn: ClassASTSignature,
    cls: Class
): boolean {
    for (const [methodName, methodSgn] of Object.entries(sgn.methods)) {
        const m = cls.methodNames.get(methodName);
        if (typeof m === 'undefined') {
            return false;
        }
        if (methodSgn.params) {
            const params = m.params;
            if (methodSgn.params.length > params.length) {
                return false;
            }
            for (let i = 0; i < methodSgn.params.length; i++) {
                if (!match(methodSgn.params[i], params[i])) {
                    return false;
                }
            }
        }
        if (methodSgn.body && !match(methodSgn.body, m.body)) {
            return false;
        }
    }
    return true;
}

export function matchClassASTSignature(
    signature: ClassASTSignatureSet,
    cls: Class
): [string, boolean] | null {
    for (const [name, sgn] of Object.entries(signature)) {
        if (matchSingleClassSignature(sgn, cls)) {
            return [name, sgn.isAJAXCall];
        }
    }
    return null;
}
