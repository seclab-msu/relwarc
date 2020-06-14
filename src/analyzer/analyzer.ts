import * as parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import type { Binding } from '@babel/traverse';

import {
    // node types
    Node as ASTNode,
    Function as FunctionASTNode,
    File, CallExpression, BinaryExpression, UnaryExpression,
    MemberExpression, NewExpression, Statement, ConditionalExpression,
    Literal, ObjectExpression,
    // validators
    isLiteral, isIdentifier, isNullLiteral, isObjectMethod, isRegExpLiteral,
    isTemplateLiteral, isSpreadElement, isFunction
} from '@babel/types';

import {
    UNKNOWN,
    UNKNOWN_FUNCTION,
    UNKNOWN_FROM_FUNCTION,
    isUnknown,
    isUnknownOrUnknownString,
    Unknown
} from './unknownvalues';

import { hasattr } from './utils/common';

import { FROM_ARG, extractFormalArgs } from './formalarg';

import { HAR, makeHAR } from './hars';

import { FormDataModel } from './form-data-model';


const MAX_CALL_CHAIN = 5;

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
    },
    boundToCall: {
        '$': ['load'],
        'jQuery': ['load']
    }
};

const SPECIAL_PROP_NAMES = ['prototype', '__proto__'];


type AST = File;

type Value
    = undefined
    | null
    | string
    | number
    | boolean
    | Record<string, unknown>
    | Unknown
    | RegExp
    | FunctionValue
    | FormDataModel
    | URL
    | Value[];

type VarScope = {[varName: string]: Value; };

enum CallConfigType {
    Function,
    Global
}

interface FunctionDescription {
    type: CallConfigType;
    args: string[];
    code: NodePath;
}

interface FunctionCallDescription extends FunctionDescription {
    binding: Binding;
}

interface CallConfig {
    func: NodePath;
    chain: FunctionCallDescription[];
}

interface SinkCall {
    funcName: string;
    args: Value[];
}

enum AnalysisPhase {
    VarGathering,
    DEPExtracting
}


class FunctionValue {
    ast: FunctionASTNode;

    constructor(ast: FunctionASTNode) {
        this.ast = ast;
    }
}

export class Analyzer {
    readonly parsedScripts: AST[];
    readonly results: SinkCall[];
    readonly scripts: Set<string>;
    readonly hars: HAR[];

    private readonly globalDefinitions: VarScope;
    private readonly argsStack: string[][];
    private readonly formalArgValues: VarScope;
    private readonly callQueue: CallConfig[];

    private callChain: FunctionCallDescription[];
    private callChainPosition: number;
    private selectedFunction: NodePath | null;
    private formalArgs: string[];

    private readonly functionsStack: NodePath[];
    private mergedProgram: AST | null;

    private readonly memory: WeakMap<Binding, Value>;
    private readonly functions: WeakMap<Binding, NodePath>;
    private readonly functionToBinding: WeakMap<ASTNode, Binding[]>;

    private currentPath: NodePath | null;

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
        this.mergedProgram = null;
    }

    addScript(source: string): void {
        if (this.scripts.has(source)) {
            return;
        }
        this.scripts.add(source);
    }

    private addFunctionBinding(funcAST: FunctionASTNode, binding: Binding): void {
        const already = this.functionToBinding.get(funcAST);
        if (already) {
            already.push(binding);
        } else {
            this.functionToBinding.set(funcAST, [binding]);
        }
    }

    private lessConcreteThanOldVal(key: string|Binding, value: Value): boolean {
        // TODO: this is bad
        if (!isUnknownOrUnknownString(value)) {
            return false;
        }
        if (typeof key === 'string') {
            // global variable
            if (!hasattr(this.globalDefinitions, key)) {
                return false;
            }
            return !isUnknown(this.globalDefinitions[key]);
        }

        // local variable
        if (!this.memory.has(key)) {
            return false;
        }
        return !isUnknown(this.memory.get(key));
    }

    private setLocalVariable(binding: Binding, value: Value, op: string): void {
        if (op === '=' && this.lessConcreteThanOldVal(binding, value)) {
            return;
        }

        let newValue: Value;

        if (op === '=') {
            newValue = value;
        } else if (op === '+=') {
            const oldValue = this.memory.get(binding);
            // @ts-ignore
            newValue = oldValue + value;
        } else {
            // TODO: support other type of assignment
            return;
        }
        this.memory.set(binding, newValue);
    }

    private setGlobalVariable(name: string, value: Value, op: string): void {
        if (op === '=' && this.lessConcreteThanOldVal(name, value)) {
            return;
        }

        let newValue: Value;

        if (op === '=') {
            newValue = value;
        } else if (op === '+=') {
            const oldValue = this.globalDefinitions[name];
            // @ts-ignore
            newValue = oldValue + value;
        } else {
            return;
        }
        this.globalDefinitions[name] = newValue;
    }

    private shouldSetObjectProperty(name: string, value: Value): boolean {
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

    private setObjectProperty(node: MemberExpression, value): void {
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

        if (ob && typeof ob === 'object' && !isUnknown(ob) && ob !== this.globalDefinitions.location) {
            ob[propName] = value;
        }
    }

    private setVariable(path: NodePath): void {
        const node: ASTNode = path.node;
        if (node.type === 'VariableDeclarator' && node.init) {
            if (node.id.type !== 'Identifier') {
                return;
            }
            const binding = path.scope.getBinding(node.id.name);

            if (binding === null || typeof binding === 'undefined') {
                console.error('Warning: no binding for declared local var');
                return;
            }

            const value = this.valueFromASTNode(node.init);

            this.memory.set(binding, value);
            if (value instanceof FunctionValue) {
                this.addFunctionBinding(value.ast, binding);
            }
        } else if (node.type === 'AssignmentExpression') {
            const value = this.valueFromASTNode(node.right);
            if (node.left.type === 'Identifier') {
                const binding = path.scope.getBinding(node.left.name);
                const op = node.operator;
                if (typeof binding !== 'undefined') {
                    this.setLocalVariable(binding, value, op);
                } else {
                    this.setGlobalVariable(name, value, op);
                }
            } else if (node.left.type === 'MemberExpression') {
                this.setObjectProperty(node.left, value);
            }
        }
    }

    private gatherVariableValues(): void {
        this.stage = AnalysisPhase.VarGathering;
        if (this.mergedProgram === null) {
            throw new Error('gatherVariableValues was called before mergeASTs');
        }
        traverse(this.mergedProgram, {
            exit: (path: NodePath) => {
                this.currentPath = path;
                const node: ASTNode = path.node;
                if (node.type === 'VariableDeclarator' || node.type === 'AssignmentExpression') {
                    this.setVariable(path);
                } else if (node.type === 'FunctionDeclaration') {
                    if (node.id === null) {
                        console.error(
                            'Warning: id is null for function declaration: ' +
                            JSON.stringify(node)
                        );
                        return;
                    }

                    const binding = path.scope.getBinding(node.id.name);

                    if (typeof binding === 'undefined') {
                        console.error(
                            'Warning: no binding function declaration: ' +
                            JSON.stringify(node)
                        );
                        return;
                    }

                    this.functions.set(binding, path);
                    this.addFunctionBinding(node, binding);
                }
            }
        });
    }

    private processStringMethod(val: string, methodName: string, argNodes: ASTNode[]): Value {
        if (!hasattr(String.prototype, methodName)) {
            return UNKNOWN;
        }
        const args = argNodes.map(n => this.valueFromASTNode(n));

        if (!args.every(v => !isUnknown(v))) {
            return UNKNOWN;
        }

        // eslint-disable-next-line @typescript-eslint/ban-types
        const method: Function = String.prototype[methodName];

        return method.apply(val, args);
    }

    private processFreeStandingFunctionCall(name: string, args: ASTNode[]): Value {
        const encoders = { escape, encodeURIComponent, encodeURI };

        if (hasattr(encoders, name)) {
            const argValue = this.valueFromASTNode(args[0]);

            if (isUnknown(argValue)) {
                return argValue;
            }

            if (typeof argValue === 'string') {
                return encoders[name](argValue);
            }
            return argValue;
        }
    }

    private processMethodCall(callee: MemberExpression, args: ASTNode[]): Value {
        const ob = callee.object;
        const prop = callee.property;

        if (ob.type === 'Identifier' && prop.type === 'Identifier') {
            if (ob.name === 'JSON' && prop.name === 'stringify') {
                return JSON.stringify(this.valueFromASTNode(args[0]));
            }
            if (ob.name === 'Math' && prop.name === 'random') {
                return 0.8782736846632295;
            }
            const obValue = this.valueFromASTNode(ob);

            if (typeof obValue === 'string') {
                return this.processStringMethod(obValue, prop.name, args);
            }
        }
    }

    private processFunctionCall(node: CallExpression): Value {
        const callee = node.callee;

        if (callee.type === 'Identifier') {
            return this.processFreeStandingFunctionCall(
                callee.name,
                node.arguments
            );
        }

        if (callee.type === 'MemberExpression') {
            return this.processMethodCall(callee, node.arguments);
        }

        return UNKNOWN_FROM_FUNCTION;
    }

    private processNewExpression(node: NewExpression): Value {
        const callee = node.callee;

        if (callee.type !== 'Identifier') {
            return UNKNOWN_FROM_FUNCTION;
        }

        if (callee.name === 'Headers') {
            return this.valueFromASTNode(node.arguments[0]);
        } else if (callee.name === 'Object') {
            return {};
        } else if (callee.name === 'FormData') {
            return new FormDataModel();
        }
        return UNKNOWN_FROM_FUNCTION;
    }

    processBinaryExpression(node: BinaryExpression): Value {
        if (node.operator === '+') {
            // @ts-ignore
            return this.valueFromASTNode(node.left) + this.valueFromASTNode(node.right);
        }
        return UNKNOWN;
    }

    private processUnaryExpression(node: UnaryExpression): Value {
        if (node.operator === '!') {
            const operand = this.valueFromASTNode(node.argument);
            if (isUnknown(operand)) {
                return UNKNOWN;
            }
            return !operand;
        }
        return UNKNOWN;
    }

    getVariable(name: string): Value {
        if (this.currentPath === null) {
            throw new Error('getVariable called without currentPath set');
        }

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
            if (hasattr(this.formalArgValues, name)) {
                return this.formalArgValues[name];
            }
            return FROM_ARG;
        }
        if (hasattr(this.globalDefinitions, name)) {
            return this.globalDefinitions[name];
        }
        return UNKNOWN;
    }

    processMemberExpression(node: MemberExpression): Value {
        const ob = this.valueFromASTNode(node.object);
        if (!ob || isUnknown(ob)) {
            return UNKNOWN;
        }
        if (!node.computed) {
            return ob[node.property.name];
        }
        const propName = this.valueFromASTNode(node.property);
        if (!propName || isUnknown(propName)) {
            return UNKNOWN;
        }
        // @ts-ignore
        return ob[propName];
    }

    private processConditionalExpression(node: ConditionalExpression): Value {
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

    private valueFromLiteral(node: Literal): Value {
        if (isNullLiteral(node)) {
            return null;
        }
        if (isRegExpLiteral(node)) {
            return new RegExp(node.pattern);
        }
        if (isTemplateLiteral(node)) {
            // TODO: add support for template strings: #1123
            return UNKNOWN;
        }
        return node.value;
    }

    private processObjectExpression(node: ObjectExpression): Value {
        const result = {};
        for (const prop of node.properties) {
            let key;

            if (isSpreadElement(prop)) {
                // TODO: add support for object destructuring
                continue;
            }

            if (isObjectMethod(prop)) {
                // NOTE: object methods are note supported for now
                continue;
            }

            if (isIdentifier(prop.key)) {
                key = prop.key.name;
            } else {
                key = prop.key.value;
            }
            result[key] = this.valueFromASTNode(prop.value);
        }
        return result;
    }

    private valueFromASTNode(node: ASTNode): Value {
        if (isLiteral(node)) {
            return this.valueFromLiteral(node);
        }
        if (isIdentifier(node)) {
            return this.getVariable(node.name);
        }
        if (node.type === 'ObjectExpression') {
            return this.processObjectExpression(node);
        }

        if (node.type === 'ArrayExpression') {
            return node.elements.map(elem => elem !== null ?
                this.valueFromASTNode(elem) : undefined
            );
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

        if (isFunction(node)) {
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

    private getFunctionForCallSite(path: NodePath): NodePath {
        path = path.scope.path;
        while (path?.scope?.parent && path.node && !isFunction(path.node)) {
            path = path.scope.parent.path;
        }
        return path;
    }

    private findCallSitesForBinding(binding: Binding): NodePath[] {
        // based on https://github.com/babel/babel/blob/429840d/packages/babel-traverse/src/scope/lib/renamer.js#L5
        const scope = binding.scope;
        const identifier = binding.identifier;
        const name = identifier.name;
        const result: NodePath[] = [];

        scope.traverse(binding.scope.block, {
            // XXX: ReferencedIdentifier is not defined in Babel's TypeScript
            // type definitions, but it is used in Babel's own code
            // @ts-ignore
            ReferencedIdentifier(path) {
                console.log('ReferencedIdentifier called');
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

    private makeFunctionDescription(path: NodePath): FunctionDescription {
        const node = path.node;
        if (isFunction(node)) {
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

    private buildCallChainsForMissingArgs(): void {
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
                const callDescr: FunctionCallDescription = {
                    binding,
                    ...funcDescr
                };
                const chain = [callDescr].concat(this.callChain);
                this.callQueue.push({ func: caller, chain });
            }
        }
    }

    private extractDEPFromArgs(funcName: string, args: ASTNode[]): void {
        let argsDependOnFormalArg = false;

        this.argsStackOffset = null;

        if (!this.selectedFunction) {
            const offset = this.findClosestFrameWithArgs();

            if (offset !== -1) {
                this.argsStackOffset = offset;
            }
        }

        this.results.push({
            funcName,
            args: args.map(arg => {
                let v = this.valueFromASTNode(arg),
                    haveFormalArg;

                [v, haveFormalArg] = extractFormalArgs(v);
                if (haveFormalArg) {
                    argsDependOnFormalArg = true;
                }
                return v;
            })
        });
        if (argsDependOnFormalArg) {
            this.buildCallChainsForMissingArgs();
        }
        this.argsStackOffset = null;
    }

    setArgValues(actualArgs: ASTNode[], formalArgs: string[]): void {
        for (let i = 0; i < formalArgs.length; i++) {
            if (i >= actualArgs.length) {
                break;
            }
            this.formalArgValues[formalArgs[i]] = this.valueFromASTNode(actualArgs[i]);
        }
    }

    proceedAlongCallChain(node: CallExpression): void {
        const f = this.callChain[this.callChainPosition];
        this.setArgValues(node.arguments, f.args);
        this.callChainPosition++;
        this.extractDEPs(f.code, f);
        this.callChainPosition--;
    }

    private mergeASTs(): void {
        const result = {
            type: 'File',
            program: {
                'type': 'Program',
                'body': [] as Statement[],
                'sourceType': 'script'
            }
        } as File;
        for (const ast of this.parsedScripts) {
            result.program.body.push(...ast.program.body);
        }
        this.mergedProgram = result;
    }

    private argNamesForFunctionNode(node: FunctionASTNode): string[] {
        return node.params.map(param => {
            if (isIdentifier(param)) {
                return param.name;
            }
            // TODO: support other parameter forms
            return 'unknownParam';
        });
    }

    private processFormDataAppend(fd: FormDataModel, methNode: ASTNode, argNodes: ASTNode[]): void {
        const args = argNodes.map(v => this.valueFromASTNode(v));

        if (!isUnknown(args[0])) {
            fd.append(args[0], args[1]);
        }
    }

    extractDEPs(code: AST|NodePath|null, funcInfo: FunctionDescription|null):void {
        if (code === null) {
            throw new Error(
                'extractDEPs called with null code (mergeASTs was not called?)'
            );
        }

        this.functionsStack.length = 0;
        this.stage = AnalysisPhase.DEPExtracting;
        if (funcInfo !== null) {
            this.formalArgs = funcInfo.args;
        } else {
            this.formalArgs = [];
        }

        const visitor = {
            enter: (path: NodePath): void => {
                const node = path.node;
                this.currentPath = path;
                if (isFunction(node)) {
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

                let obName: string;
                let objectIsCall = false;

                if (ob.type === 'Identifier') {
                    obName = ob.name;
                    if (prop.name === 'append') {
                        const obValue = this.valueFromASTNode(ob);
                        if (obValue instanceof FormDataModel) {
                            this.processFormDataAppend(
                                obValue,
                                prop,
                                node.arguments
                            );
                            return;
                        }
                    }
                } else if (ob.type === 'MemberExpression' && ob.property.type === 'Identifier') {
                    // handle case a.b.x.$http.post(...)
                    obName = ob.property.name;
                } else if (ob.type === 'CallExpression' && ob.callee.type === 'Identifier') {
                    // handle case $(...).load(...)
                    obName = ob.callee.name;
                    objectIsCall = true;
                } else {
                    return;
                }

                let obSignatures: {[obName: string]: string[]};

                if (!objectIsCall) {
                    obSignatures = signatures.bound;
                } else {
                    obSignatures = signatures.boundToCall;
                }

                if (
                    !hasattr(obSignatures, obName) ||
                    !~(obSignatures[obName].indexOf(prop.name))
                ) {
                    return;
                }

                this.extractDEPFromArgs(obName + '.' + prop.name, node.arguments);
            },
            exit: (path: NodePath): void => {
                if (isFunction(path.node)) {
                    this.argsStack.pop();
                    this.functionsStack.pop();
                }
            }
        };

        if (code instanceof NodePath) {
            code.traverse(visitor);
        } else {
            traverse(code, visitor);
        }
    }

    extractDEPsWithCallChain(callConfig: CallConfig): void {
        this.callChain = callConfig.chain;
        this.callChainPosition = 0;

        const func = callConfig.func;

        this.selectedFunction = func;
        this.extractDEPs(func, this.makeFunctionDescription(func));
    }

    private seedGlobalScope(url: string): void {
        const globals = this.globalDefinitions;

        globals.location = new URL(url);
        globals.document = {
            location: globals.location
        };
        globals.window = globals;
    }

    onNewHAR(har: HAR): void {
        this.hars.push(har);
    }

    parseCode(): void {
        for (const script of this.scripts) {
            try {
                this.parsedScripts.push(parser.parse(script));
            } catch (err) {
                console.error('Script parsing error: ' + err + '\n');
            }
        }
        this.mergeASTs();
    }

    analyze(url: string): void {
        this.parseCode();

        this.seedGlobalScope(url);

        this.gatherVariableValues();

        this.extractDEPs(this.mergedProgram, null);

        while (this.callQueue.length > 0) {
            const callConfig: CallConfig = this.callQueue.shift() as CallConfig;

            this.extractDEPsWithCallChain(callConfig);
        }

        for (const result of this.results) {
            const har = makeHAR(result.funcName, result.args, url);

            if (har === null) {
                continue;
            }

            this.onNewHAR(har);
        }
    }
}
