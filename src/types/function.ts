import type { Function as FunctionASTNode } from '@babel/types';

import { debugEnabled } from '../debug';

export class FunctionValue {
    ast: FunctionASTNode;

    constructor(ast: FunctionASTNode) {
        this.ast = ast;
    }

    toString(): string {
        if (debugEnabled()) {
            let label = '<function';
            const name = this.ast['id']?.name;
            if (name) {
                label += ' ' + name;
            }
            label += '>';
            return label;
        }
        return 'UNKNOWN';
    }

    toJSON(): string {
        if (debugEnabled()) {
            return this.toString();
        }
        return 'UNKNOWN';
    }
}
