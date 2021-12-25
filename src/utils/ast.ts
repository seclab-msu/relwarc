import {
    Node as ASTNode, Expression,
    isExpression,
    cloneNode,
    VISITOR_KEYS
} from '@babel/types';

import * as stableStringify from 'json-stable-stringify';

import { hasattr } from './common';

export function allAreExpressions(nodes: ASTNode[]): nodes is Expression[] {
    return nodes.every((n: ASTNode): boolean => isExpression(n));
}

export function nodeKey(node: ASTNode): string {
    return stableStringify(cloneNode(node, true, true));
}

export enum TraverseCommand {
    Break = 'break',
    Skip = 'skip'
}

type simpletraverseVisitor = (node: ASTNode) => TraverseCommand | void;
type maybeNode = ASTNode | undefined | null;

// eslint-disable-next-line complexity
export function simpletraverse(
    node: ASTNode,
    visitor: simpletraverseVisitor,
    maxDepth?: number
): TraverseCommand | undefined {
    if (maxDepth === 0 || (typeof maxDepth === 'number' && maxDepth < 0)) {
        return;
    }

    let ret: TraverseCommand | void;

    ret = visitor(node);

    if (ret === TraverseCommand.Break) {
        return TraverseCommand.Break;
    }
    if (ret === TraverseCommand.Skip) {
        return;
    }

    const t = node.type;
    const visitorKeys = VISITOR_KEYS[t];

    if (!hasattr(VISITOR_KEYS, t) || typeof visitorKeys === 'undefined') {
        throw new Error(`Unknown node type: "${t}"`);
    }

    const d = typeof maxDepth !== 'undefined' ? maxDepth - 1 : maxDepth;

    if (d === 0) {
        return;
    }

    for (const fieldName of visitorKeys) {
        const field: maybeNode | maybeNode[] = node[fieldName];
        if (Array.isArray(field)) {
            for (const el of field) {
                ret = traverseIfNode(el, visitor, d);
                if (ret === TraverseCommand.Break) {
                    return TraverseCommand.Break;
                }
            }
        } else if (typeof field === 'object') {
            ret = traverseIfNode(field, visitor, d);
            if (ret === TraverseCommand.Break) {
                return TraverseCommand.Break;
            }
        }
    }
}

function traverseIfNode(
    n: maybeNode,
    visitor: simpletraverseVisitor,
    d: number | undefined
): TraverseCommand | undefined {
    if (n && 'type' in n && typeof n.type === 'string') {
        return simpletraverse(n, visitor, d);
    }
}
