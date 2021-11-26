import type { Function as FunctionASTNode } from '@babel/types';


export class FunctionValue {
    ast: FunctionASTNode;

    constructor(ast: FunctionASTNode) {
        this.ast = ast;
    }
}
