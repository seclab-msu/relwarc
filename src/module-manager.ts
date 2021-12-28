import {
    File as AST,
    Node as ASTNode,
    Function as FunctionASTNode,
    Statement, FunctionExpression, ArrowFunctionExpression,
    isExpressionStatement, isFunctionExpression,
    isArrowFunctionExpression, isFile,
    identifier, blockStatement, functionExpression,
    program as makeProgram,
    file as makeFile,
    expressionStatement as makeExpressionStatement,
} from '@babel/types';

import { Debundler } from 'page-disassembler';

import { Value } from './types/generic';
import { UNKNOWN, isUnknown } from './types/unknown';
import { FunctionValue } from './types/function';

import { debugEnabled } from './debug';
import { NodePath } from '@babel/traverse';

function wrapModule(module: ASTNode): AST {
    if (!isFunctionExpression(module) && !isArrowFunctionExpression(module)) {
        throw new Error('Function expression wanted for wrapping, but got ' + module.type);
    }
    return makeFile(makeProgram([makeExpressionStatement(module)]));
}

class Module {
    readonly name: string;
    readonly code: FunctionExpression | ArrowFunctionExpression;
    readonly moduleObject: ModuleObject;
    exports: Value;

    constructor(
        name: string,
        code: FunctionExpression | ArrowFunctionExpression
    ) {
        this.name = name;
        this.code = code;
        this.exports = {};
        this.moduleObject = new ModuleObject(this);
    }
}

class RequireDefine extends FunctionValue {
    constructor() {
        super(functionExpression(
            identifier('require_define'),
            [],
            blockStatement([])
        ));
    }
}

export const REQUIRE_DEFINE = new RequireDefine();

class RequireFunction extends FunctionValue {
    d: RequireDefine = REQUIRE_DEFINE;
    constructor() {
        super(functionExpression(
            identifier('require'),
            [],
            blockStatement([])
        ));
    }
}

export const REQUIRE_FUNCTION = new RequireFunction();

export class ModuleObject {
    #owner: Module;

    constructor(owner: Module) {
        this.#owner = owner;
    }

    toString() {
        if (debugEnabled()) {
            return '<Module>';
        }
        return 'UNKNOWN';
    }
    toJSON() {
        return this.toString();
    }
    get exports() {
        return this.#owner.exports;
    }
}

export class ModuleManager {
    private readonly debundler: Debundler;
    private rawModules: Array<[string, ASTNode]>;
    private readonly modulesByName: Map<string, Module>;
    private readonly modulesByFn: Map<
        FunctionExpression | ArrowFunctionExpression, Module
    >;
    private readonly moduleObject2Module: Map<ModuleObject, Module>;
    private renamedModules: Set<ASTNode>;

    constructor() {
        this.rawModules = [];
        this.debundler = new Debundler();
        this.modulesByName = new Map();
        this.modulesByFn = new Map();
        this.moduleObject2Module = new Map();
        this.renamedModules = new Set();
    }

    addModule(parsedScript: AST, name: string): boolean {
        const detectedBundle = this.debundler.debundle(parsedScript, name);

        if (detectedBundle) {
            this.rawModules.push(...this.debundler.getModules());
        }

        return detectedBundle;
    }

    getModuleCount(): number {
        return this.rawModules.length;
    }

    prepareModules(cb: (name: string, moduleNode: AST) => Statement): void {
        for (const [name, moduleNode] of this.rawModules) {
            if (name === '__runtime' || name === '__rest' || name === '__main') {
                if (!isFile(moduleNode)) {
                    throw new Error(`Unexpected type of ${name} module: ${moduleNode.type}`);
                }
                cb(name, moduleNode);
                // TODO: revisit this. These are not actual modules
                continue;
            }
            const wrappedModule = wrapModule(moduleNode);
            const node = cb(name, wrappedModule);

            if (!isExpressionStatement(node)) {
                throw new Error('Expected node to be ExpressionStatement');
            }
            const fn = node.expression;
            if (!isFunctionExpression(fn) && !isArrowFunctionExpression(fn)) {
                throw new Error('Expected node.expression to be a func expr');
            }
            const m = new Module(name, fn);
            this.modulesByName.set(name, m);
            this.modulesByFn.set(fn, m);
        }
    }

    isModule(node: FunctionASTNode): boolean {
        return this.modulesByFn.has(node as FunctionExpression);
    }

    getModuleVars(node: FunctionASTNode): Record<string, Value> {
        const m = this.modulesByFn.get(node as FunctionExpression);
        if (!m) {
            throw new Error('No module found for node');
        }
        this.moduleObject2Module.set(m.moduleObject, m);
        return {
            require: REQUIRE_FUNCTION,
            exports: m.exports,
            module: m.moduleObject
        };
    }
    exportsForName(name: string): Value {
        const m = this.modulesByName.get(name);
        if (typeof m === 'undefined') {
            return UNKNOWN;
        }
        return m.exports;
    }
    setExportsObject(moduleObject: ModuleObject, exports: Value): void {
        if (isUnknown(exports)) {
            return;
        }
        const m = this.moduleObject2Module.get(moduleObject);

        if (typeof m === 'undefined') {
            throw new Error('No module for module object');
        }

        m.exports = exports;
    }

    renameRequireInModules(path: NodePath): void {
        const node = path.node;
        if (this.renamedModules.has(node)) {
            return;
        }

        for (const [name, moduleNode] of this.rawModules) {
            if (moduleNode === node) {
                const bundleClass = this.debundler.getBundleClassByName(
                    name
                );
                if (typeof bundleClass !== 'undefined') {
                    Debundler.renameRequire(null, bundleClass, false, path);
                }
                break;
            }
        }

        this.renamedModules.add(node);
    }
}
