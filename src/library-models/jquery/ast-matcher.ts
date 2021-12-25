import * as fs from 'fs';

import { Node as ASTNode, isFunction } from '@babel/types';
import { simpletraverse, TraverseCommand } from '../../utils/ast';

import { ASTPatternMatcher } from 'js-ast-matcher';

const astSignature = JSON.parse(
    fs.readFileSync(__dirname + '/ast-signature.json', 'utf8')
);

const matcher = new ASTPatternMatcher();

export function matchAST(node: ASTNode): boolean {
    if (node.type !== 'FunctionExpression') {
        return false;
    }
    const start = node.start;
    const end = node.end;
    if (typeof start !== 'number' || typeof end !== 'number') {
        throw new Error('Expected range to be present');
    }
    if (!node.id && end - start > astSignature['$length']) {
        const body = node.body.body;

        if (body.length === 0) {
            return false;
        }
        let matched = false;
        for (let i = 0; i < Math.min(5, body.length); i++) {
            for (const chk of astSignature.checks) {
                const n = body[body.length - 1 - i];

                simpletraverse(n, node => {
                    if (isFunction(node) && node !== n) {
                        return TraverseCommand.Skip;
                    }
                    if (matcher.matchSubtree(chk, node)) {
                        matched = true;
                        return TraverseCommand.Break;
                    }
                }, 4);
                if (matched) {
                    return true;
                }
            }
        }
    }
    return false;
}
