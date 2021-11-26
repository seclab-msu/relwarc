import {
    Node as ASTNode, Expression,
    isExpression,
    cloneNode
} from '@babel/types';

import * as stableStringify from 'json-stable-stringify';

export function allAreExpressions(nodes: ASTNode[]): nodes is Expression[] {
    return nodes.every((n: ASTNode): boolean => isExpression(n));
}

export function nodeKey(node: ASTNode): string {
    return stableStringify(cloneNode(node, true, true));
}
