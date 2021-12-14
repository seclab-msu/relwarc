import { Function as FunctionASTNode } from '@babel/types';
import { FunctionValue } from './types/function';

export class FunctionManager {
    private readonly functions: Map<FunctionASTNode, FunctionValue>;

    constructor() {
        this.functions = new Map();
    }

    saveFunction(func: FunctionValue): void {
        this.functions.set(func.ast, func);
    }

    getOrCreate(node: FunctionASTNode): FunctionValue {
        let f = this.functions.get(node);

        if (typeof f === 'undefined') {
            f = new FunctionValue(node);
            this.functions.set(node, f);
        }
        return f;
    }
}
