import { Function as FunctionASTNode, isFunction } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { FunctionValue } from './types/function';

export class FunctionManager {
    private readonly functions: Map<FunctionASTNode, FunctionValue>;
    private readonly paths: Map<FunctionValue, NodePath>;

    constructor() {
        this.functions = new Map();
        this.paths = new Map();
    }

    saveFunction(func: FunctionValue): void {
        this.functions.set(func.getAST(), func);
    }

    saveFunctionWithPath(path: NodePath): void {
        const node = path.node;

        if (!isFunction(node)) {
            throw new Error('Expected function path');
        }
        this.paths.set(this.getOrCreate(node), path);
    }

    getOrCreate(node: FunctionASTNode): FunctionValue {
        let f = this.functions.get(node);

        if (typeof f === 'undefined') {
            f = new FunctionValue(node);
            this.functions.set(node, f);
        }
        return f;
    }

    getPath(func: FunctionValue): NodePath | null {
        return this.paths.get(func) || null;
    }
}
