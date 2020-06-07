const system = require('system');

import * as babel from './vendor/babel';

import {
    UNKNOWN,
    UNKNOWN_FUNCTION,
    UNKNOWN_FROM_FUNCTION,
    isUnknown
} from './unknownvalues';

import {FROM_ARG, extractFormalArgs} from './formalarg';

import { makeHAR } from './make-hars';

declare const Debugger: any;
require('./debugger').addDebuggerToGlobal(this);

type ASTNode = any;

const MAX_CALL_CHAIN = 5;

const FUNCTION_DECLARATIONS = [
    'ArrowFunctionExpression',
    'FunctionDeclaration',
    'FunctionExpression'
]

const jQueryAjaxFunctions = [
    'ajax',
    'get',
    'post',
    'load',
    'getJSON',
    'getScript'
];

const signatures = {
    freeStanding: ['fetch', '$http', 'axios'],
    bound: {
        'window': ['fetch'],
        'this': ['fetch'],
        '$': jQueryAjaxFunctions,
        'jQuery': jQueryAjaxFunctions,
        '$http': ['get', 'post', 'put', 'jsonp'],
        'axios': ['get', 'post', 'put']
    }
};

const SPECIAL_PROP_NAMES = ['prototype', '__proto__'];

type VarScope = {[varName: string]: any; };

enum CallConfigType {
    Function,
    Global
}

interface FunctionDescription {
    type: CallConfigType;
    args: string[];
    code: ASTNode;
}

interface FunctionCallDescription extends FunctionDescription {
    binding: any;
}

interface CallConfig {
    func: any;
    chain: FunctionCallDescription[];
}

enum AnalysisPhase {
    VarGathering,
    DEPExtracting
}


class FunctionValue {
    ast: ASTNode;

    constructor(ast: ASTNode) {
        this.ast = ast;
    }
}

export class Analyzer {
    readonly parsedScripts: ASTNode[];
    readonly results: any[];
    readonly scripts: Set<string>;
    readonly hars: any[];

    private readonly globalDefinitions: VarScope;
    private readonly argsStack: string[][];
    private readonly formalArgValues: VarScope;
    private readonly callQueue: CallConfig[];

    private callChain: FunctionCallDescription[];
    private callChainPosition: number;
    private selectedFunction: FunctionDescription | null;
    private formalArgs: string[];
    private currentBody: ASTNode | null;

    private readonly functionsStack: any[];
    private mergedProgram: ASTNode;

    private readonly memory: WeakMap<any, any>;
    private readonly functions: WeakMap<any, any>;
    private readonly functionToBinding: WeakMap<ASTNode, any[]>;

    private currentPath: any;

    private stage: AnalysisPhase | null;

    private argsStackOffset: number | null;

    constructor() {
        this.parsedScripts = [];
        this.results = [];
        this.scripts = new Set();

        this.globalDefinitions = { undefined };
        this.argsStack = [];
        this.formalArgs = [];
        this.formalArgValues = {};

        this.callQueue = [];
        this.callChain = [];
        this.callChainPosition = 0;

        this.hars = [];

        this.functionsStack = [];

        this.memory = new WeakMap();
        this.functions = new WeakMap();
        this.functionToBinding = new WeakMap();

        this.currentPath = null;
        this.stage = null;
        this.selectedFunction = null;
        this.argsStackOffset = null;
    }
    attachDebugger(win: object): void {
        const dbg = new Debugger(win);

        dbg.onNewScript = (script: any): void => {
            const text: string = script.source.text;

            if (this.scripts.has(text)) {
                return;
            }
            this.scripts.add(text);
        }
    }

    private addFunctionBinding(funcAST: ASTNode, binding: any) {
        if (this.functionToBinding.has(funcAST)) {
            const already = <any[]>this.functionToBinding.get(funcAST);
            already.push(binding);
        } else {
            this.functionToBinding.set(funcAST, [binding]);
        }
    }

    private setVariableIfNotLessConcrete(binding, name: string, value, op: string) {
        let isGlobal: boolean = false;

        if (typeof binding === 'undefined') {
            isGlobal = true;
        }

        let newValue;

        let isUnk: boolean = isUnknown(value);

        if (op === '=') {
            // TODO: this is bad
            isUnk = isUnk || (typeof value === 'string' && value.includes('UNKNOWN'));

            if (isUnk) {
                if (!isGlobal && this.memory.has(binding) && !isUnknown(this.memory.get(binding))) {
                    return
                }
                if (isGlobal && this.globalDefinitions.hasOwnProperty(name) && !isUnknown(this.globalDefinitions[name])) {
                    return
                }
            }
        }

        if (op === '=') {
            newValue = value;
         } else if (op === '+=') {
            let oldValue;
            if (isGlobal) {
                oldValue = this.globalDefinitions[name];
            } else {
                oldValue = this.memory.get(binding);
            }
            newValue = oldValue + value;
        } else {
            return;
        }

        if (!isGlobal) {
            this.memory.set(binding, newValue);
        } else {
            this.globalDefinitions[name] = newValue;
        }
    }

    private shouldSetObjectProperty(name: string, value: any): boolean {
        // try to avoid problems with some special properties
        // TODO: reconsider
        if (SPECIAL_PROP_NAMES.includes(name)) {
            return false;
        }
        if (name === 'length' && typeof value !== 'number') {
            return false;
        }
        return true;
    }

    private setObjectProperty(node, value) {
        const prop = node.property;
        let propName;

        if (node.computed) {
            propName = this.valueFromASTNode(prop);
        } else {
            propName = prop.name;
        }

        if (typeof propName === 'undefined' || propName === null || isUnknown(propName)) {
            return;
        }

        if (!this.shouldSetObjectProperty(propName, value)) {
            return;
        }

        const ob = this.valueFromASTNode(node.object);

        if (ob && typeof ob === 'object' && !isUnknown(ob)) {
            ob[propName] = value;
        }

    }

    private setVariable(path) {
        const node = path.node;
        const type = node.type;
        if (type === 'VariableDeclarator' && node.init) {
            const binding = path.scope.getBinding(node.id.name);
            const value = this.valueFromASTNode(node.init);

            this.memory.set(binding, value);
            if (value instanceof FunctionValue) {
                this.addFunctionBinding(value.ast, binding);
            }
        } else if (type === 'AssignmentExpression') {
            const value = this.valueFromASTNode(node.right);
            if (node.left.type === 'Identifier') {
                const binding = path.scope.getBinding(node.left.name);
                this.setVariableIfNotLessConcrete(binding, node.left.name, value, node.operator);
            } else if (node.left.type === 'MemberExpression') {
                this.setObjectProperty(node.left, value)
            }
        }
    }

    private gatherVariableValues() {
        this.stage = AnalysisPhase.VarGathering;
        babel.traverse(this.mergedProgram, {
            exit: (path) => {
                this.currentPath = path;
                const node = path.node;
                if (node.type === 'VariableDeclarator' || node.type === 'AssignmentExpression') {
                    this.setVariable(path);
                } else if (node.type === 'FunctionDeclaration') {
                    const binding = path.scope.getBinding(node.id.name);

                    this.functions.set(binding, path);
                    this.addFunctionBinding(node, binding);
                }
            }
        });
    }

    processFunctionCall(node: ASTNode) {
        const callee = node.callee;
        const encoders = {escape, encodeURIComponent, encodeURI};


        if (callee.type === 'Identifier') {
            if (encoders.hasOwnProperty(callee.name)) {
                const argValue = this.valueFromASTNode(node.arguments[0]);

                if (isUnknown(argValue)) {
                    return argValue;
                }

                if (typeof argValue === 'string') {
                    return encoders[callee.name](argValue);
                }
                return argValue;
            }
        }

        if (callee.type === 'MemberExpression') {
            const ob = callee.object;
            const prop = callee.property;

            if (ob.type === 'Identifier' && prop.type === 'Identifier') {
                if (ob.name === 'JSON' && prop.name === 'stringify') {
                    return JSON.stringify(this.valueFromASTNode(node.arguments[0]));
                }
                if (ob.name === 'Math' && prop.name === 'random') {
                    return 0.8782736846632295;
                }
            }
        }

        return UNKNOWN_FROM_FUNCTION;
    }

    private processNewExpression(node: ASTNode) {
        const callee = node.callee;

        if (callee.type !== 'Identifier') {
            return UNKNOWN_FROM_FUNCTION;
        }

        if (callee.name === 'Headers') {
            return this.valueFromASTNode(node.arguments[0]);
        } else if (callee.name === 'Object') {
            return {};
        }
        return UNKNOWN_FROM_FUNCTION;
    }

    processBinaryExpression(node: ASTNode) {
        if (node.operator === '+') {
            return this.valueFromASTNode(node.left) + this.valueFromASTNode(node.right);
        }
        return UNKNOWN;
    }

    private processUnaryExpression(node: ASTNode) {
        if (node.operator === '!') {
            const operand = this.valueFromASTNode(node.argument);
            if (isUnknown(operand)) {
                return UNKNOWN;
            }
            return !operand;
        }
        return UNKNOWN;
    }

    getVariable(name: string) {
        const binding = this.currentPath.scope.getBinding(name);

        if (typeof binding !== 'undefined') {
            if (this.memory.has(binding)) {
                return this.memory.get(binding);
            }
            if (this.functions.has(binding)) {
                return UNKNOWN_FUNCTION;
            }
        }

        let formalArgs: string[] = this.formalArgs;

        if (this.argsStackOffset !== null) {
            formalArgs = this.argsStack[this.argsStack.length - this.argsStackOffset - 1];
        }

        if (~formalArgs.indexOf(name) || this.selectedFunction) {
            if (this.formalArgValues.hasOwnProperty(name)) {
                return this.formalArgValues[name];
            }
            return FROM_ARG;
        }
        if (this.globalDefinitions.hasOwnProperty(name)) {
            return this.globalDefinitions[name];
        }
        return UNKNOWN;
    }

    processMemberExpression(node) {
        const ob = this.valueFromASTNode(node.object);
        if (!ob || isUnknown(ob)) {
            return UNKNOWN;
        }
        if (!node.computed) {
            return ob[node.property.name];
        }
        let propName = this.valueFromASTNode(node.property);
        if (!propName || isUnknown(propName)) {
            return UNKNOWN;
        }
        return ob[propName];
    }

    private processConditionalExpression(node) {
        const test = this.valueFromASTNode(node.test);

        let [first, second] = [node.consequent, node.alternate];

        // try to preserve evaluation order && lazyness
        if (!isUnknown(test) && !test) {
            [second, first] = [first, second];
        }

        const firstValue = this.valueFromASTNode(first);

        if (!isUnknown(firstValue)) {
            return firstValue;
        }

        return this.valueFromASTNode(second);
    }

    valueFromASTNode(node) {
        if (node.type.endsWith('Literal')) {
            return node.value;
        }
        if (node.type === 'Identifier') {
            return this.getVariable(node.name);
        }
        if (node.type === 'ObjectExpression') {
            const result = {};
            for (let prop of node.properties) {
                let key;

                if (prop.key.type === 'Identifier') {
                    key = prop.key.name;
                } else if (prop.key.type.endsWith('Literal')) {
                    key = prop.key.value
                } else {
                    return UNKNOWN;
                }
                result[key] = this.valueFromASTNode(prop.value);
            }
            return result;
        }

        if (node.type === 'ArrayExpression') {
            return node.elements.map(elem => elem !== null ? this.valueFromASTNode(elem) : undefined);
        }

        if (node.type === 'CallExpression') {
            return this.processFunctionCall(node);
        }

        if (node.type === 'NewExpression') {
            return this.processNewExpression(node);
        }

        if (node.type === 'UnaryExpression') {
            return this.processUnaryExpression(node);
        }

        if (node.type === 'BinaryExpression') {
            return this.processBinaryExpression(node);
        }

        if (node.type === 'MemberExpression') {
            return this.processMemberExpression(node);
        }

        if (node.type === 'ConditionalExpression') {
            return this.processConditionalExpression(node);
        }

        if (~node.type.indexOf('Function')) {
            if (this.stage === AnalysisPhase.DEPExtracting) {
                return UNKNOWN_FUNCTION;
            } else if (this.stage === AnalysisPhase.VarGathering) {
                return new FunctionValue(node);
            } else {
                throw new Error('Unexpected stage: ' + this.stage);
            }
        }
        return UNKNOWN;
    }

    private getFunctionForCallSite(path) {
        path = path.scope.path;
        while(path && path.scope && path.scope.parent && path.node && !path.node.type.includes('Function')) {
            path = path.scope.parent.path;
        }
        return path;
    }

    private findCallSitesForBinding(binding): any[] {
        // based on https://github.com/babel/babel/blob/429840d/packages/babel-traverse/src/scope/lib/renamer.js#L5
        const scope = binding.scope;
        const identifier = binding.identifier;
        const name = identifier.name;
        const result: any[] = [];

        scope.traverse(binding.scope.block, {
            ReferencedIdentifier(path) {
                if (path.node.name === name && path.scope.getBinding(path.node.name) === binding) {
                    result.push(path);
                }
            },
            Scope(path) {
                // TODO: this should skip traversal if name is shadowed, test it
                if (!path.scope.bindingIdentifierEquals(name, identifier)) {
                    path.skip();
                }
            }
        });
        return result;
    }

    private makeFunctionDescription(path): FunctionDescription {
        const node = path.node;
        if (node.type.includes('Function')) {
            return {
                type: CallConfigType.Function,
                args: this.argNamesForFunctionNode(node),
                code: path
            };
        } else if (node.type === 'Program') {
            return {
                type: CallConfigType.Global,
                args: [],
                code: path
            };
        } else {
            throw new Error('Unexpected function node type: ' + node.type);
        }
    }

    private findClosestFrameWithArgs(): number {
        const argsStackLength = this.argsStack.length;

        for (let i = 0; i < argsStackLength; i += 1) {
            if (this.argsStack[argsStackLength - i - 1].length > 0) {
                return i;
            }
        }
        return -1;
    }

    private buildCallChainsForMissingArgs() {
        let func;

        if (this.callChain.length + 1 >= MAX_CALL_CHAIN) {
            return;
        }

        if (this.selectedFunction) {
            func = this.selectedFunction;
        } else {
            const offset = this.argsStackOffset || 0;
            func = this.functionsStack[this.functionsStack.length - 1 - offset];
        }
        const bindings = this.functionToBinding.get(func.node);
        if (typeof bindings === 'undefined') {
            return;
        }

        for (const binding of bindings) {
            const callSites = this.findCallSitesForBinding(binding);

            for (const callSite of callSites) {
                const caller = this.getFunctionForCallSite(callSite);
                const funcDescr = this.makeFunctionDescription(func);
                const callDescr: FunctionCallDescription = {binding, ...funcDescr};
                const chain = [callDescr].concat(this.callChain);
                this.callQueue.push({func: caller, chain});
            }

        }
    }

    private extractDEPFromArgs(funcName, args) {
        let argsDependOnFormalArg = false;

        this.argsStackOffset = null;

        if (!this.selectedFunction) {
            const offset = this.findClosestFrameWithArgs();

            if (offset !== -1) {
                this.argsStackOffset = offset;
            }
        }

        this.results.push([
            funcName,
            args.map(arg => {
                let v = this.valueFromASTNode(arg),
                    haveFormalArg;

                [v, haveFormalArg] = extractFormalArgs(v);
                if (haveFormalArg) {
                    argsDependOnFormalArg = true;
                }
                return v;
            })
        ]);
        if (argsDependOnFormalArg) {
            this.buildCallChainsForMissingArgs();
        }
        this.argsStackOffset = null;
    }

    setArgValues(actualArgs, formalArgs) {
        for (let i = 0; i < formalArgs.length; i++) {
            if (i >= actualArgs.length) {
                break;
            }
            this.formalArgValues[formalArgs[i]] = this.valueFromASTNode(actualArgs[i]);
        }
    }

    proceedAlongCallChain(node) {
        const f = this.callChain[this.callChainPosition];
        this.setArgValues(node.arguments, f.args);
        this.callChainPosition++;
        this.extractDEPs(f.code, f);
        this.callChainPosition--;
    }

    private mergeASTs() {
        const result = {
            type: 'File',
            program: {
                'type': 'Program',
                'body': <any[]>[],
                'sourceType': 'script'
            }
        };
        for (const ast of this.parsedScripts) {
            result.program.body.push(...ast.program.body);
        }
        this.mergedProgram = result;
    }

    private argNamesForFunctionNode(node) {
        return node.params.map(param => param.name);
    }

    extractDEPs(ast, funcInfo: FunctionDescription|null) {
        this.functionsStack.length = 0;
        this.stage = AnalysisPhase.DEPExtracting;
        if (funcInfo !== null) {
            this.formalArgs = funcInfo.args;
            this.currentBody = ast;
        } else {
            this.formalArgs = [];
            this.currentBody = null;
        }

        const visitor = {
            enter: (path) => {
                const node = path.node;
                this.currentPath = path;
                if (~FUNCTION_DECLARATIONS.indexOf(node.type)) {
                    this.argsStack.push(this.argNamesForFunctionNode(node));
                    this.formalArgs = this.argsStack[this.argsStack.length - 1];
                    this.functionsStack.push(path);
                }
                if (this.functionsStack.length > 0 && node.type === 'VariableDeclarator' || node.type === 'AssignmentExpression') {
                    this.setVariable(path);
                }

                if (node.type !== 'CallExpression') {
                    return;
                }

                const callee = node.callee;

                if (this.callChain.length > 0 && this.callChainPosition < this.callChain.length && node.callee.type === 'Identifier') {
                    const binding = path.scope.getBinding(node.callee.name);
                    if (this.callChain[this.callChainPosition].binding === binding) {
                        this.proceedAlongCallChain(node);
                    }
                }

                if (callee.type === 'Identifier') {
                    if (~signatures.freeStanding.indexOf(callee.name)) {
                        this.extractDEPFromArgs(callee.name, node.arguments);
                    }
                    return;
                }

                if (callee.type !== 'MemberExpression') {
                    return;
                }

                const prop = callee.property;
                const ob = callee.object;

                if (prop.type !== 'Identifier') {
                    return;
                }

                let obName;

                if (ob.type === 'Identifier') {
                    obName = ob.name;
                } else if (ob.type === 'MemberExpression' && ob.property.type === 'Identifier') {
                    // handle case a.b.x.$http.post(...)
                    obName = ob.property.name;
                } else {
                    return;
                }

                if (
                    !signatures.bound.hasOwnProperty(obName) ||
                    !~(signatures.bound[obName].indexOf(prop.name))
                ) {
                    return;
                }
                this.extractDEPFromArgs(obName + '.' + prop.name, node.arguments);
            },
            exit: (path) => {
                if (~FUNCTION_DECLARATIONS.indexOf(path.node.type)) {
                    this.argsStack.pop();
                    this.functionsStack.pop();
                }
            }
        };

        if (ast.traverse) {
            ast.traverse(visitor);
        } else {
            babel.traverse(ast, visitor);
        }
    }

    extractDEPsWithCallChain(callConfig: CallConfig) {
        this.callChain = callConfig.chain;
        this.callChainPosition = 0;

        const func = callConfig.func;

        this.selectedFunction = func;
        this.extractDEPs(func, this.makeFunctionDescription(func));
    }

    analyze(url: string) {
        for (const script of this.scripts) {
            try {
                this.parsedScripts.push(babel.parser.parse(script));
            } catch (err) {
                system.stderr.write('Script parsing error: ' + err + '\n');
            }
        }

        this.mergeASTs();

        this.gatherVariableValues();

        this.extractDEPs(this.mergedProgram, null);

        while (this.callQueue.length > 0) {
            let callConfig: CallConfig = <CallConfig> this.callQueue.shift();

            this.extractDEPsWithCallChain(callConfig);
        }

        for (const result of this.results) {
            const har = makeHAR(result[0], result[1], url);

            if (har === null) {
                continue;
            }

            this.hars.push(har);
        }
    }
}
