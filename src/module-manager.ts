import {
    Function as FunctionASTNode,
    Statement, FunctionExpression,
    isExpressionStatement, isFunctionExpression,
    identifier, blockStatement, functionExpression
} from '@babel/types';

import { Debundler } from 'page-disassembler';

import { Value } from './types/generic';
import { UNKNOWN, isUnknown } from './types/unknown';
import { FunctionValue } from './types/function';

import { debugEnabled } from './debug';

// import { log } from './logging';

function wrapModule(src: string): string {
    return `(function(module, exports, require) {\n${src}\n})`;
}

class Module {
    readonly name: string;
    readonly sourceText: string;
    readonly code: FunctionExpression;
    readonly moduleObject: ModuleObject;
    exports: Value;

    constructor(name: string, sourceText: string, code: FunctionExpression) {
        this.name = name;
        this.sourceText = sourceText;
        this.code = code;
        this.exports = {};
        this.moduleObject = new ModuleObject(this);
    }
}

class RequireFunction extends FunctionValue {
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
    private rawModules: Map<string, string> | null;
    private readonly modulesByName: Map<string, Module>;
    private readonly modulesByFn: Map<FunctionExpression, Module>;
    private readonly moduleObject2Module: Map<ModuleObject, Module>;

    constructor() {
        this.rawModules = null;
        this.debundler = new Debundler();
        this.modulesByName = new Map();
        this.modulesByFn = new Map();
        this.moduleObject2Module = new Map();
    }

    addScript(sourceText: string, name: string): boolean {
        return this.debundler.debundle(sourceText, name);
    }

    getModuleCount(): number {
        return this.getRawModules().size;
    }

    parseModules(cb: (name: string, src: string) => Statement): void {
        for (const [name, src] of this.getRawModules()) {
            if (name === '__runtime' || name === '__rest') {
                cb(name, src);
                // TODO: revisit this. These are not actual modules
                continue;
            }
            const wrappedSrc = wrapModule(src);
            const node = cb(name, wrappedSrc);

            if (!isExpressionStatement(node)) {
                throw new Error('Expected node to be ExpressionStatement');
            }
            const fn = node.expression;
            if (!isFunctionExpression(fn)) {
                throw new Error('Expected node.expression to be a func expr');
            }
            const m = new Module(name, src, fn);
            this.modulesByName.set(name, m);
            this.modulesByFn.set(fn, m);
        }
    }

    private getRawModules(): Map<string, string> {
        this.rawModules = this.rawModules || this.debundler.getModules();
        return this.rawModules;
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
}
