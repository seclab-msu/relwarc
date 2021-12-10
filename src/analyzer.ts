import * as parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import type { Binding } from '@babel/traverse';

import * as stableStringify from 'json-stable-stringify';

import {
    // node types
    Node as ASTNode,
    File as AST,
    Function as FunctionASTNode,
    Comment as CommentASTNode,
    CallExpression, BinaryExpression, UnaryExpression, AssignmentExpression,
    MemberExpression, NewExpression, Statement, ConditionalExpression,
    Literal, ObjectExpression, Identifier, TemplateLiteral, SourceLocation,
    FunctionDeclaration, ClassDeclaration, ClassExpression, ReturnStatement,
    // validators
    isLiteral, isIdentifier, isNullLiteral, isObjectMethod, isRegExpLiteral,
    isTemplateLiteral, isSpreadElement, isFunction,
    isAssignmentPattern, isMemberExpression, isIfStatement, isSwitchStatement,
    isFunctionDeclaration, isClassDeclaration, isArrowFunctionExpression,
    isFunctionExpression
} from '@babel/types';

import {
    UNKNOWN,
    UNKNOWN_FUNCTION,
    UNKNOWN_FROM_FUNCTION,
    isUnknown,
    isUnknownOrUnknownString,
    Unknown
} from './types/unknown';

import { DynamicAnalyzer } from './dynamic/analyzer';

import { FROM_ARG, extractFormalArgs } from './types/formalarg';
import { FormDataModel } from './types/form-data';
import { FunctionValue } from './types/function';
import { Value, NontrivialValue } from './types/generic';
import { ValueSet } from './types/value-set';
import { ClassObject, ClassManager, Instance, isVanillaMethod } from './types/classes';

import {
    CallConfigType,
    FunctionDescription,
    FunctionCallDescription,
    CallConfig
} from './call-chains';

import { CallManager } from './call-manager';
import { FunctionManager } from './function-manager';

import { hasattr } from './utils/common';
import { allAreExpressions, nodeKey } from './utils/ast';
import { STRING_METHODS, REGEXP_UNSETTABLE_PROPS } from './utils/analyzer';

import { HAR, BadURLError } from './har';
import { makeHAR } from './library-models/sinks';

import {
    combineComments,
    parseComments
} from './uncommenter';

import { LoadType } from './load-type';

import {
    matchFreeStandingCallSignature,
    matchMethodCallSignature,
    callSequenceMethodNames
} from './library-models/signatures';

import {
    CallSequence,
    TrackedCallSequence,
    wrapSeqInObjectExpressions
} from './call-sequence';

import { log } from './logging';
import { setDebug, logCallChains, logCallStep, debugFuncLabel } from './debug';

const MAX_CALL_CHAIN = 5;
const MAX_ACCUMULATED_STRING = 10000;

const SPECIAL_PROP_NAMES = [
    'constructor',
    'prototype',
    '__proto__',
    '__defineGetter__',
    '__defineSetter__',
    'hasOwnProperty',
    '__lookupGetter__',
    '__lookupSetter__'
];

const PREDEFINED_CLASSES = [
    'Headers',
    'HttpRequest',
    'Object',
    'FormData',
    'URL',
    'URLSearchParams'
];

type VarScope = { [varName: string]: Value };

export interface SinkCall {
    funcName: string;
    args: Value[];
    location?: SourceLocation|null;
}

enum AnalysisPhase {
    VarGathering,
    DEPExtracting
}

interface Script {
    sourceText: string;
    startLine?: number;
    url?: string;
    sourceType?: string;
}

export interface AnalyzerOptions {
    debug: boolean;
    debugCallChains: boolean;
    debugValueSets: boolean;
}

export class Analyzer {
    readonly parsedScripts: AST[];
    readonly results: SinkCall[];
    readonly scripts: Script[];
    readonly hars: HAR[];

    private readonly dynamic: DynamicAnalyzer | null;

    private readonly globalDefinitions: VarScope;
    private readonly argsStack: string[][];
    private readonly callQueue: CallConfig[];

    private callChain: FunctionCallDescription[];
    private callChainPosition: number;
    private selectedFunction: NodePath | null;
    private formalArgs: string[];

    readonly classManager: ClassManager;
    private readonly thisStack: Array<Instance | Unknown>;

    private readonly callManager: CallManager;
    private readonly functionManager: FunctionManager;

    private readonly functionsStack: NodePath[];
    private mergedProgram: AST | null;

    private readonly memory: WeakMap<Binding, Value>;
    private readonly functionToBinding: WeakMap<ASTNode, Binding[]>;

    private currentPath: NodePath | null;

    private stage: AnalysisPhase | null;

    private argsStackOffset: number | null;

    private resultsAlready: Set<string>;

    private trackedCallSequencesStack: Map<string, TrackedCallSequence>[];

    private readonly ifStack: number[];

    harFilter: null | ((har: HAR) => boolean);

    suppressedError: boolean;

    private readonly debug: boolean;

    private readonly options: AnalyzerOptions;

    constructor(
        dynamicAnalyzer: DynamicAnalyzer | null = null,
        options?: Partial<AnalyzerOptions>
    ) {
        this.options = {
            debug: false,
            debugCallChains: false,
            debugValueSets: false,
            ...options
        };

        this.parsedScripts = [];
        this.results = [];
        this.scripts = [];

        this.dynamic = dynamicAnalyzer;

        if (dynamicAnalyzer !== null) {
            dynamicAnalyzer.newScriptCallback = this.addScript.bind(this);
        }

        this.globalDefinitions = { undefined };
        this.argsStack = [];
        this.formalArgs = [];

        this.classManager = new ClassManager();
        this.thisStack = [UNKNOWN];

        this.functionManager = new FunctionManager();
        this.callManager = new CallManager(this.functionManager);

        this.callQueue = [];
        this.callChain = [];
        this.callChainPosition = 0;

        this.hars = [];

        this.functionsStack = [];

        this.memory = new WeakMap();
        this.functionToBinding = new WeakMap();

        this.currentPath = null;
        this.stage = null;
        this.selectedFunction = null;
        this.argsStackOffset = null;
        this.mergedProgram = null;
        this.harFilter = null;

        this.resultsAlready = new Set();

        this.trackedCallSequencesStack = [new Map()];
        this.suppressedError = false;

        this.ifStack = [0];

        this.debug = this.options.debug;
        setDebug(this.debug);
    }

    addScript(
        sourceText: string,
        startLine = 0,
        url?: string,
        sourceType?: string
    ): void {
        if (this.scripts.find(scr => scr.sourceText === sourceText)) {
            return;
        }

        if (url !== undefined) {
            sourceText = this.adjustSource(sourceText, url);
        }

        this.scripts.push({
            sourceText,
            startLine,
            url,
            sourceType
        } as Script);
    }

    private adjustSource(sourceText: string, url: string): string {
        if (url.startsWith('dynamically evaled code')) {
            sourceText = '{' + sourceText + '}';
        } else if (url.startsWith('code from new Function constructor')) {
            sourceText = '(function () {' + sourceText + '})';
        } else if (url.startsWith('code from inline event handler')) {
            sourceText = '(function () {' + sourceText + '})';
        }
        return sourceText;
    }

    adjustScripts(adjustCb: (scr: Script) => Script): void {
        for (let i = 0; i < this.scripts.length; i++) {
            const s = this.scripts[i];

            const oldURL = s.url;

            this.scripts[i] = adjustCb(s);

            const newURL = this.scripts[i].url;

            if (newURL && newURL !== oldURL) {
                this.scripts[i].sourceText = this.adjustSource(
                    this.scripts[i].sourceText,
                    newURL
                );
            }
        }
    }

    private addFunctionBinding(
        funcAST: FunctionASTNode,
        binding: Binding
    ): void {
        const already = this.functionToBinding.get(funcAST);
        if (already) {
            already.push(binding);
        } else {
            this.functionToBinding.set(funcAST, [binding]);
        }
    }

    private lessConcreteThanOldVal(
        key: string | Binding,
        value: Value
    ): boolean {
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

    private probeAddition(left: Value, right: Value): Value {
        // TODO: custom toString is not supported, leads to UNKNOWN result
        try {
            // @ts-ignore
            return left + right;
        } catch {
            if (typeof left === 'string') {
                return left + UNKNOWN;
            } else if (typeof right === 'string') {
                return UNKNOWN + right;
            }

            return UNKNOWN;
        }
    }

    private setLocalVariable(binding: Binding, value: Value, op: string): void {
        if (op === '=' && this.lessConcreteThanOldVal(binding, value)) {
            return;
        }

        if (this.currentPath === null) {
            throw new Error('setLocalVariable called without currentPath set');
        }

        if (
            op === '+=' &&
            !this.memory.has(binding) &&
            !this.formalArgs.includes(binding.identifier.name) &&
            this.currentPath.scope.hasOwnBinding(binding.identifier.name)
        ) {
            return;
        }

        const oldValue: Value = (() => { // Rust style
            if (!this.memory.has(binding)) {
                if (this.formalArgs.includes(binding.identifier.name)) {
                    return FROM_ARG;
                } else {
                    return UNKNOWN;
                }
            } else {
                return this.memory.get(binding);
            }
        })();

        let newValue: Value;

        if (op === '=') {
            newValue = value;
        } else if (op === '+=') {
            if (
                isUnknownOrUnknownString(oldValue) &&
                isUnknownOrUnknownString(value)
            ) {
                // things are already bad, let's not make them worse
                return;
            }

            if ((oldValue instanceof ValueSet) || (value instanceof ValueSet)) {
                newValue = ValueSet.map2(oldValue, value, (l, r) => {
                    return this.probeAddition(l, r);
                });
            } else {
                newValue = this.probeAddition(oldValue, value);
            }

            if (
                typeof newValue === 'string' &&
                newValue.length > MAX_ACCUMULATED_STRING
            ) {
                return;
            }
        } else {
            // TODO: support other type of assignment
            return;
        }
        if (oldValue !== newValue && this.ifStack[0] > 0) {
            newValue = ValueSet.join(oldValue, newValue);
        }
        this.memory.set(binding, newValue);
    }

    private setGlobalVariable(name: string, value: Value, op: string): void {
        if (name === 'location') {
            return;
        }

        if (op === '=' && this.lessConcreteThanOldVal(name, value)) {
            return;
        }

        let newValue: Value;

        const oldValue = this.globalDefinitions[name];

        if (op === '=') {
            newValue = value;
        } else if (op === '+=') {
            if (
                isUnknownOrUnknownString(oldValue) &&
                isUnknownOrUnknownString(value)
            ) {
                return;
            }

            if ((oldValue instanceof ValueSet) || (value instanceof ValueSet)) {
                newValue = ValueSet.map2(oldValue, value, (l, r) => {
                    return this.probeAddition(l, r);
                });
            } else {
                newValue = this.probeAddition(oldValue, value);
            }

            if (
                typeof newValue === 'string' &&
                newValue.length > MAX_ACCUMULATED_STRING
            ) {
                return;
            }
        } else {
            return;
        }
        if (oldValue !== newValue && this.ifStack[0] > 0) {
            newValue = ValueSet.join(oldValue, newValue);
        }
        this.globalDefinitions[name] = newValue;
    }

    private shouldSetObjectProperty(
        ob: NontrivialValue,
        name: string,
        value: Value,
    ): boolean {
        // try to avoid problems with some special properties
        // TODO: reconsider
        if (SPECIAL_PROP_NAMES.includes(name)) {
            return false;
        }
        if (
            ob instanceof RegExp &&
            REGEXP_UNSETTABLE_PROPS.includes(<keyof RegExp> name)
        ) {
            return false;
        }
        if (Array.isArray(ob) && name === 'length') {
            if (typeof value !== 'number') {
                if (value instanceof ValueSet) {
                    return true;
                }
                return false;
            }
            if (isNaN(value)) {
                return false;
            }
        }
        return true;
    }

    private shouldGetObjectProperty(name: string): boolean {
        // TODO: see shouldSetObjectProperty
        if (SPECIAL_PROP_NAMES.includes(name)) {
            return false;
        }
        return true;
    }

    private setArrayLengthFromSet(arr: Array<Value>, length: ValueSet): void {
        const numbers: number[] = [];
        length.forEach(
            v => typeof v === 'number' && numbers.push(v)
        );
        if (numbers.length > 0) {
            arr.length = Math.max(...numbers);
        }
    }

    private stringFromPrimitive(v: Value): string | null {
        switch (typeof v) {
        case 'string':
            return v;
        case 'number':
        case 'boolean':
        case 'undefined':
            return String(v);
        case 'object':
            return v === null ? String(v) : null;
        }
        return null;
    }

    private setObjectProperty(node: MemberExpression, value: Value): void {
        const prop = node.property;
        let propName;
        if (node.computed) {
            propName = this.valueFromASTNode(prop);
        } else {
            if (!isIdentifier(prop)) {
                log('Warning: non-computed prop is not identifier');
                return;
            }
            propName = prop.name;
        }

        if (
            typeof propName === 'undefined' ||
            propName === null ||
            isUnknown(propName)
        ) {
            return;
        }

        const updatedObject = this.valueFromASTNode(node.object);

        const safeName = this.stringFromPrimitive(propName);

        if (ClassManager.nodeIsProbablyVanillaPrototypeMethod(node)) {
            if (node.object.type !== 'MemberExpression') {
                throw new Error('Expected node.object to be MemberExpression');
            }
            const clsValue = this.valueFromASTNode(node.object.object);
            this.classManager.tryToAddVanillaPrototypeMethod(
                clsValue,
                value,
                safeName
            );
        }

        const update = ob => {
            if (
                ob &&
                typeof ob === 'object' &&
                !isUnknown(ob) &&
                ob !== this.globalDefinitions.location
            ) {
                if (propName instanceof ValueSet) {
                    // TODO(asterite): maybe implement this somehow
                    if (propName.size === 1) {
                        propName = propName.getValues()[0];
                    } else {
                        if (this.options.debugValueSets) {
                            log(
                                'Warning: assigning a prop with ValueSet ' +
                                'name: trying to pick some value'
                            );
                        }
                        propName = propName.tryToPeekConcrete();
                    }
                }
                if (!this.shouldSetObjectProperty(ob, propName, value)) {
                    return;
                }
                if (Array.isArray(ob) && propName === 'length' && value instanceof ValueSet) {
                    this.setArrayLengthFromSet(ob, value);
                    return;
                }
                if (ob instanceof Instance) {
                    if (
                        value instanceof FunctionValue &&
                        isVanillaMethod(value.ast)
                    ) {
                        this.classManager.addMethodForInstance(
                            ob,
                            value.ast,
                            safeName
                        );
                    }
                    if (!(value instanceof ValueSet)) {
                        value = new ValueSet([value]);
                    }
                    if (hasattr(ob, propName)) {
                        value = value.join(ob[propName]);
                    }
                }
                ob[propName] = value;
            }
        };

        if (updatedObject instanceof ValueSet) {
            updatedObject.forEach(update);
        } else {
            update(updatedObject);
        }
    }

    private getObjectProperty(ob: NontrivialValue, propName: string): Value {
        const getProp = (ob: Value): Value => {
            if (!ob || !this.shouldGetObjectProperty(propName)) {
                return undefined;
            }
            if (typeof ob !== 'object') {
                return undefined; // NOTE: maybe UNKNOWN is better here?
            }

            if (ob instanceof Instance) {
                const m = this.classManager.getMethodForInstance(ob, propName);
                if (m !== null) {
                    return this.functionManager.getOrCreate(m);
                }
            }

            return ob[propName];
        };
        if (ob instanceof ValueSet) {
            return ob.map(getProp);
        } else {
            return getProp(ob);
        }
    }

    private setVariable(path: NodePath): void {
        const node: ASTNode = path.node;
        if (node.type === 'VariableDeclarator') {
            if (node.id.type !== 'Identifier') {
                return;
            }

            const binding = path.scope.getBinding(node.id.name);

            if (binding === null || typeof binding === 'undefined') {
                log('Warning: no binding for declared local var');
                return;
            }

            if (!node.init) {
                this.memory.set(binding, undefined);
                return;
            }

            const value = this.valueFromASTNode(node.init);

            if (binding.scope.block.type === 'Program') {
                this.globalDefinitions[node.id.name] = value;
            } else {
                this.memory.set(binding, value);
            }

            if (value instanceof FunctionValue) {
                this.addFunctionBinding(value.ast, binding);
            }
        } else if (node.type === 'AssignmentExpression') {
            const value = this.valueFromASTNode(node.right);
            if (node.left.type === 'Identifier') {
                const binding = path.scope.getBinding(node.left.name);
                const op = node.operator;
                if (typeof binding === 'undefined' || binding.scope.block.type === 'Program') {
                    this.setGlobalVariable(node.left.name, value, op);
                } else {
                    this.setLocalVariable(binding, value, op);
                }
            } else if (node.left.type === 'MemberExpression') {
                this.setObjectProperty(node.left, value);
            }
        }
    }

    private declare(node: FunctionDeclaration | ClassDeclaration): void {
        const path = this.currentPath;

        if (node.id === null || typeof node.id === 'undefined') {
            log('Warning: id is null for declaration: ' + JSON.stringify(node));
            return;
        }

        if (path === null || path.parentPath === null) {
            return;
        }

        const name = node.id.name;

        const binding = path.parentPath.scope.getBinding(name);

        if (typeof binding === 'undefined') {
            log('Warning: no binding for declaration: ' + JSON.stringify(node));
            return;
        }

        let declaredValue: FunctionValue | ClassObject;
        if (isFunctionDeclaration(node)) {
            if (!this.classManager.containsClass(node)) {
                this.classManager.createVanillaClass(node);
            }
            declaredValue = this.functionManager.getOrCreate(node);
            this.addFunctionBinding(node, binding);
        } else if (isClassDeclaration(node)) {
            const cls = this.classManager.createModernClass(node);
            declaredValue = cls;
        } else {
            throw new Error('Unexpected value');
        }

        this.memory.set(binding, declaredValue);

        if (binding.scope.block.type === 'Program') {
            this.globalDefinitions[name] = declaredValue;
        }
    }

    private pushCurrentThis(t: Instance | Unknown): void {
        this.thisStack.push(t);
    }

    private popCurrentThis() {
        this.thisStack.pop();
    }

    private addCurrentThis(node: FunctionASTNode): void {
        const inst = this.classManager.getClassInstanceForMethod(node);

        if (inst !== null) {
            this.pushCurrentThis(inst);
        } else if (!isArrowFunctionExpression(node)) {
            this.pushCurrentThis(UNKNOWN);
        }
    }

    private restoreCurrentThis(node: FunctionASTNode): void {
        if (!isArrowFunctionExpression(node)) {
            this.popCurrentThis();
        }
    }

    private currentFunction(applyOffset=false): NodePath {
        let index = this.functionsStack.length - 1;

        if (applyOffset) {
            index -= this.argsStackOffset || 0;
        }

        return this.functionsStack[index];
    }

    private saveReturnValue(path: NodePath<ReturnStatement>): void {
        const currentFunction = this.currentFunction();
        if (!currentFunction) {
            log('warning: return statement without current function');
            return;
        }
        const functionNode = currentFunction.node;
        if (!isFunction(functionNode)) {
            log('warning: node of current function is not a function node');
            return;
        }
        this.currentPath = path;
        if (!path.node.argument) {
            return;
        }
        const v = this.valueFromASTNode(path.node.argument);
        const f = this.functionManager.getOrCreate(functionNode);
        this.callManager.saveReturnValue(f, v);
    }

    private saveCallInfo(path: NodePath<CallExpression>): void {
        const calleeValue = this.valueFromASTNode(path.node.callee);

        if (CallManager.hasFunctions(calleeValue)) {
            const args = path.node.arguments.map(
                a => this.valueFromASTNode(a)
            );
            this.callManager.saveCallInfo(path, calleeValue, args);
        }
    }

    private gatherVariableValues(): void {
        this.stage = AnalysisPhase.VarGathering;
        if (this.mergedProgram === null) {
            throw new Error('gatherVariableValues was called before mergeASTs');
        }
        traverse(this.mergedProgram, {
            enter: (path: NodePath) => {
                const node: ASTNode = path.node;
                this.currentPath = path;
                if (
                    isFunctionDeclaration(node) || isClassDeclaration(node)
                ) {
                    this.declare(node);
                }
                if (isFunction(node)) {
                    this.argsStack.push(this.argNamesForFunctionNode(node));
                    this.ifStack.unshift(0);
                    this.addCurrentThis(node);
                    this.functionsStack.push(path);
                }
                if (isIfStatement(node) || isSwitchStatement(node)) {
                    this.ifStack[0]++;
                } else if (
                    node.type === 'VariableDeclarator' ||
                    node.type === 'AssignmentExpression'
                ) {
                    this.setVariable(path);
                }
            },
            exit: (path: NodePath) => {
                this.currentPath = path;
                const node: ASTNode = path.node;
                if (isFunction(node)) {
                    this.argsStack.pop();
                    this.ifStack.shift();
                    this.restoreCurrentThis(node);
                    this.functionsStack.pop();
                }
                if (isIfStatement(node) || isSwitchStatement(node)) {
                    this.ifStack[0]--;
                }
            },
            CallExpression: path => {
                const node = path.node;

                const callee = node.callee;

                this.saveCallInfo(path);

                if (!isMemberExpression(callee)) {
                    return;
                }

                const ob = callee.object;
                const prop = callee.property;

                if (!isIdentifier(ob) || !isIdentifier(prop)) {
                    return;
                }
                if (
                    this.debug &&
                    ob.name === '$analyzer' &&
                    prop.name === 'log'
                ) {
                    this.debugLogValues(node.arguments);
                }
            },
            ReturnStatement: path => this.saveReturnValue(path)
        });
        this.argsStack.length = 0; // clear args stack just in case
    }

    private processStringMethod(
        val: string,
        methodName: string,
        argNodes: ASTNode[]
    ): Value {
        if (!hasattr(STRING_METHODS, methodName)) {
            return UNKNOWN;
        }
        let args = this.valuesForArgs(argNodes);

        const applyMethod = args => {
            if (methodName === 'concat') {
                args = args.map(arg => String(arg));
            } else if (methodName === 'replace' || methodName === 'replaceAll') {
                if (isUnknown(args[0])) {
                    return UNKNOWN;
                }
                args = [args[0]].concat(args.slice(1).map(arg => String(arg)));
            } else {
                if (!args.every(v => !isUnknown(v))) {
                    return UNKNOWN;
                }
            }

            const method = STRING_METHODS[methodName];

            return method.apply(val, args);
        };

        if (!args.some(a => a instanceof ValueSet)) {
            return applyMethod(args);
        }
        args = args.map(a => {
            if (a instanceof ValueSet) {
                return a.toStringValueSet();
            }
            return a;
        });
        const result = new ValueSet();
        for (const argSet of ValueSet.produceCombinations(args)) {
            result.add(applyMethod(argSet));
        }
        return result;
    }

    private debugLogValues(args: ASTNode[]): void {
        const output: string[] = [];
        for (const a of args) {
            const v = this.valueFromASTNode(a);

            output.push(JSON.stringify(v, null, 4));
        }
        console.log(output.join(' '));
    }

    private maybeCallBuiltinFreeStanding(
        name: string,
        args: ASTNode[]
    ): [boolean, Value] {
        const encoders = { escape, encodeURIComponent, encodeURI };
        const decoders = { parseInt, parseFloat };

        if (!hasattr(encoders, name) && !hasattr(decoders, name)) {
            return [false, undefined];
        }

        const argValue = this.valueFromASTNode(args[0]);

        const f = val => {
            if (hasattr(encoders, name)) {
                if (
                    ['number', 'boolean', 'undefined'].includes(typeof val) ||
                    val === null
                ) {
                    val = String(val);
                }
                if (!isUnknown(val) && typeof val === 'string') {
                    return encoders[name](val);
                }
                if (isUnknown(val)) {
                    return val;
                }
                return UNKNOWN_FROM_FUNCTION;
            }

            if (hasattr(decoders, name)) {
                if (isUnknown(val)) {
                    return val;
                }
                const radix = args.length > 1 ?
                    this.valueFromASTNode(args[1]) : undefined;
                return decoders[name](val, radix);
            }
        };

        let result: Value;

        if (argValue instanceof ValueSet) {
            result = argValue.map(f);
        } else {
            result = f(argValue);
        }

        return [true, result];
    }

    private processFreeStandingFunctionCall(
        name: string,
        args: ASTNode[]
    ): Value {
        const [wasCalled, res] = this.maybeCallBuiltinFreeStanding(name, args);
        if (wasCalled) {
            return res;
        }
        return UNKNOWN_FROM_FUNCTION;
    }

    private processMethodCall(
        callee: MemberExpression,
        args: ASTNode[]
    ): Value {
        const ob = callee.object;
        const prop = callee.property;
        let propIsIdentifier = false;
        let propName = '';
        if (prop.type === 'Identifier') {
            propIsIdentifier = true;
            propName = prop.name;
        }
        if (ob.type === 'Identifier' && propIsIdentifier) {
            if (ob.name === 'JSON' && propName === 'stringify') {
                try {
                    return JSON.stringify(this.valueFromASTNode(args[0]));
                } catch (err) {
                    log(
                        'warning: suppressing exception from JSON.stringify: ' +
                        err
                    );
                    this.suppressedError = true;
                    return UNKNOWN;
                }
            }
            if (ob.name === 'Math' && propName === 'random') {
                return 0.8782736846632295;
            }
        }
        const obValue = this.valueFromASTNode(ob);

        let propStr: string;

        if (propIsIdentifier) {
            propStr = propName;
        } else {
            propStr = String(this.valueFromASTNode(prop));
        }

        if (propStr === 'toString') {
            const f = v => {
                if (isUnknown(v)) {
                    return v;
                }
                return String(v);
            };
            return obValue instanceof ValueSet ? obValue.map(f) : f(obValue);
        }

        if (typeof obValue === 'string') {
            return this.processStringMethod(obValue, propStr, args);
        }

        return UNKNOWN_FROM_FUNCTION;
    }

    private processFunctionCall(node: CallExpression): Value {
        const callee = node.callee;
        let result: Value = UNKNOWN_FROM_FUNCTION;

        if (callee.type === 'Identifier') {
            result = this.processFreeStandingFunctionCall(
                callee.name,
                node.arguments
            );
        }

        if (callee.type === 'MemberExpression') {
            result = this.processMethodCall(callee, node.arguments);
        }

        if (!isUnknown(result) && result !== 'UNKNOWN') {
            return result;
        }

        const transpiledClass = this.classManager.createTranspiledClass(node);

        if (transpiledClass !== null) {
            return transpiledClass;
        }

        const returnValues = this.callManager.getReturnValuesForCallSite(node);

        if (returnValues === null) {
            return result;
        }

        const resultIsFromArg = result === FROM_ARG;

        if (!resultIsFromArg && returnValues.size === 1) {
            return returnValues.getValues()[0]; // sugar
        }

        if (resultIsFromArg) {
            return returnValues.join([FROM_ARG]);
        }

        return returnValues;
    }

    private constructAngularHttpRequest(node: NewExpression): Value {
        if (node.arguments.length < 2) {
            log(
                `Warning: expected new HttpRequest args length ` +
                `to be at least 2, but got ${node.arguments.length}`
            );
            return {};
        }

        let method = this.valueFromASTNode(node.arguments[0]) || 'GET';
        method = method.toString();

        let body,
            settings = {};

        if (
            ['DELETE', 'GET', 'HEAD', 'JSONP', 'OPTIONS'].includes(method.toUpperCase()) &&
            node.arguments.length <= 3
        ) {
            if (node.arguments.length === 3) {
                settings = this.valueFromASTNode(node.arguments[2]) || {};
            }
        } else {
            if (node.arguments.length === 4) {
                settings = this.valueFromASTNode(node.arguments[3]) || {};
            }

            body = this.valueFromASTNode(node.arguments[2]);
        }

        return {
            method: method,
            url: this.valueFromASTNode(node.arguments[1]),
            body: body,
            headers: settings['headers'] || {},
            params: settings['params'] || {}
        };
    }

    private tryCreatingURLClass(node: NewExpression): Value {
        let base: Value;
        if (node.arguments.length === 2) {
            base = this.valueFromASTNode(node.arguments[1]);
            if (base instanceof ValueSet) {
                base = base.tryToPeekConcrete();
            }
        }

        const createURLClass = (url: Value): Value => {
            if (base !== undefined && typeof base !== 'string') {
                base = undefined;
            }
            try {
                return new URL(String(url), base);
            } catch {
                return UNKNOWN;
            }
        };

        const url = this.valueFromASTNode(node.arguments[0]);
        if (url instanceof ValueSet) {
            return url.map(createURLClass);
        } else {
            return createURLClass(url);
        }
    }

    private tryCreatingURLSearchParamsClass(node: NewExpression): Value {
        if (node.arguments.length === 0) {
            return new URLSearchParams();
        }

        const createURLSearchParams = (arg: Value): Value => {
            if (typeof arg === 'object') {
                for (const key in arg) {
                    if (arg[key] instanceof ValueSet) {
                        arg[key] = arg[key].tryToPeekConcrete();
                    }
                }
            }
            if (typeof arg === 'string' || typeof arg === 'object') {
                try {
                    // @ts-ignore
                    return new URLSearchParams(arg);
                } catch {
                    log(
                        `Warning: failed to create URLSearchParams with ${arg}`
                    );
                }
            }
            return new URLSearchParams();
        };

        const arg = this.valueFromASTNode(node.arguments[0]);

        if (arg instanceof ValueSet) {
            return arg.map(createURLSearchParams);
        } else {
            return createURLSearchParams(arg);
        }
    }

    private constructPredefinedClass(name: string, node: NewExpression): Value {
        switch (name) {
        case 'Headers':
            if (typeof node.arguments[0] === 'object') {
                return this.valueFromASTNode(node.arguments[0]);
            } else { // TODO: add test for this case
                if (typeof node.arguments[0] !== 'undefined') {
                    log(
                        `Warning: expected new Headers arg to be either an ` +
                        `object or undefined, but got ${node.arguments[0]})`
                    );
                }
                return {};
            }
            break;
        case 'HttpRequest':
            return this.constructAngularHttpRequest(node);
            break;
        case 'Object':
            return {};
            break;
        case 'FormData':
            return new FormDataModel();
            break;
        case 'URL':
            return this.tryCreatingURLClass(node);
            break;
        case 'URLSearchParams':
            return this.tryCreatingURLSearchParamsClass(node);
            break;
        default:
            throw new Error('Unexpected predefined class: ' + name);
        }
    }

    private processNewExpression(node: NewExpression): Value {
        const callee = node.callee;

        if (isIdentifier(callee) && PREDEFINED_CLASSES.includes(callee.name)) {
            return this.constructPredefinedClass(callee.name, node);
        }

        const cls = this.valueFromASTNode(callee);

        if (cls instanceof ClassObject) {
            // NB(asterite): ctor arguments are currently ignored
            const ctorNode = this.classManager.getMethodForClassObject(
                cls,
                'constructor'
            );
            if (ctorNode) {
                const ctorFunc = this.functionManager.getOrCreate(ctorNode);
                this.callManager.saveCallArgs(ctorFunc, node.arguments.map(
                    v => this.valueFromASTNode(v)
                ));
            }
            const inst = this.classManager.getClassInstanceForClassObject(cls);
            return inst || UNKNOWN_FROM_FUNCTION;
        } else if (cls instanceof FunctionValue) {
            this.callManager.saveCallArgs(cls, node.arguments.map(
                v => this.valueFromASTNode(v)
            ));
            const inst = this.classManager.getClassInstanceForMethod(cls.ast);
            return inst || UNKNOWN_FROM_FUNCTION;
        }

        return UNKNOWN_FROM_FUNCTION;
    }

    private addValues(left: Value, right: Value): Value {
        if ((left instanceof ValueSet) || (right instanceof ValueSet)) {
            return ValueSet.map2(left, right, (l, r) => {
                return this.probeAddition(l, r);
            });
        }
        return this.probeAddition(left, right);
    }

    private processBinaryExpression(node: BinaryExpression): Value {
        if (node.operator === '+') {
            const left = this.valueFromASTNode(node.left);
            const right = this.valueFromASTNode(node.right);
            return this.addValues(left, right);
        }
        return UNKNOWN;
    }

    private processUnaryExpression(node: UnaryExpression): Value {
        let op: (Value) => Value;
        switch (node.operator) {
        case '!':
            op = x => !x;
            break;
        case '-':
            op = x => -x;
            break;
        default:
            return UNKNOWN;
        }
        const operand = this.valueFromASTNode(node.argument);

        if (operand instanceof ValueSet) {
            return operand.map(op);
        }

        if (isUnknown(operand)) {
            return UNKNOWN;
        }
        return op(operand);
    }

    private upperArgumentExists(name: string): boolean {
        const offset = this.argsStackOffset !== null ? this.argsStackOffset : 0;

        for (let i = this.argsStack.length - offset - 1; i >= 0; i--) {
            if (this.argsStack[i].includes(name)) {
                return true;
            }
        }
        return false;
    }

    private getArgumentValue(index: number): Value {
        const isDepExtraction = this.stage === AnalysisPhase.DEPExtracting;
        const unknown = isDepExtraction ? FROM_ARG : UNKNOWN;
        const cf = this.currentFunction();
        if (!cf) {
            return unknown;
        }
        const possibleArgs = this.callManager.getArgument(cf.node, index);
        if (possibleArgs) {
            return possibleArgs.join(FROM_ARG);
        }
        return unknown;
    }

    getVariable(name: string): Value {
        if (this.currentPath === null) {
            throw new Error('getVariable called without currentPath set');
        }

        const binding = this.currentPath.scope.getBinding(name);

        if (typeof binding !== 'undefined' && binding.scope.block.type !== 'Program') {
            if (this.memory.has(binding)) {
                return this.memory.get(binding);
            }
        }

        let formalArgs: string[] = this.formalArgs;

        if (this.argsStackOffset !== null) {
            formalArgs = this.argsStack[
                this.argsStack.length - this.argsStackOffset - 1
            ];
        } else if (
            this.stage === AnalysisPhase.VarGathering &&
            this.argsStack.length > 0 &&
            binding
        ) {
            formalArgs = this.argsStack[this.argsStack.length - 1];
        }
        if (formalArgs.includes(name)) {
            return this.getArgumentValue(formalArgs.indexOf(name));
        }
        if (this.upperArgumentExists(name)) {
            return UNKNOWN;
        }
        if (hasattr(this.globalDefinitions, name)) {
            return this.globalDefinitions[name];
        }
        return UNKNOWN;
    }

    private processMemberExpression(node: MemberExpression): Value {
        const ob = this.valueFromASTNode(node.object);
        if (!ob || isUnknown(ob)) {
            return UNKNOWN;
        }
        if (!node.computed) {
            if (!isIdentifier(node.property)) {
                log('Warning: non-computed prop is not identifier');
                return UNKNOWN;
            }
            return this.getObjectProperty(ob, node.property.name);
        }
        const prop = this.valueFromASTNode(node.property);
        if (
            typeof prop === 'undefined' ||
            prop === null ||
            isUnknown(prop)
        ) {
            return UNKNOWN;
        }
        const getProp = n => {
            let propName;
            try {
                propName = String(n);
            } catch {
                return UNKNOWN;
            }
            return this.getObjectProperty(ob, propName);
        };
        if (prop instanceof ValueSet) {
            return ValueSet.join(...prop.getValues().map(getProp));
        } else {
            return getProp(prop);
        }
    }

    private processConditionalExpression(node: ConditionalExpression): Value {
        const test = this.valueFromASTNode(node.test);
        if (isUnknown(test)) {
            return ValueSet.join(
                this.valueFromASTNode(node.consequent),
                this.valueFromASTNode(node.alternate)
            );
        }

        let [first, second] = [node.consequent, node.alternate];

        // try to preserve evaluation order && lazyness
        if (!test) {
            [second, first] = [first, second];
        }

        const firstValue = this.valueFromASTNode(first);

        if (!isUnknown(firstValue)) {
            return firstValue;
        }

        return this.valueFromASTNode(second);
    }

    private processTemplateLiteral(node: TemplateLiteral): Value {
        let templateString: Value = '';
        for (let i = 0; i < node.quasis.length; i++) {
            templateString = this.addValues(
                templateString,
                node.quasis[i].value.cooked
            );
            if (typeof node.expressions[i] !== 'undefined') {
                templateString = this.addValues(
                    templateString,
                    this.valueFromASTNode(node.expressions[i])
                );
            }
        }
        return templateString;
    }

    private valueFromLiteral(node: Literal): Value {
        if (isNullLiteral(node)) {
            return null;
        }
        if (isRegExpLiteral(node)) {
            try {
                return new RegExp(node.pattern, node.flags);
            } catch {
                return new RegExp('');
            }
        }
        if (isTemplateLiteral(node)) {
            return this.processTemplateLiteral(node);
        }
        return node.value;
    }

    private processObjectExpression(node: ObjectExpression): Value {
        const result = {};
        for (const prop of node.properties) {
            let key: string;

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
                key = String(this.valueFromASTNode(prop.key));
            }
            result[key] = this.valueFromASTNode(prop.value);
        }
        return result;
    }

    private processFunction(node: FunctionASTNode): Value {
        if (this.stage === AnalysisPhase.DEPExtracting) {
            if (this.classManager.containsClass(node)) {
                return this.functionManager.getOrCreate(node);
            }
            return UNKNOWN_FUNCTION;
        } else if (this.stage === AnalysisPhase.VarGathering) {
            if (
                isFunctionExpression(node) &&
                !this.classManager.containsClass(node)
            ) {
                this.classManager.createVanillaClass(node);
            }
            return this.functionManager.getOrCreate(node);
        } else {
            throw new Error('Unexpected stage: ' + this.stage);
        }
    }

    private processClassExpression(node: ClassExpression): Value {
        return this.classManager.createModernClass(node);
    }

    private processThisExpression(): Instance | Unknown {
        return this.thisStack[this.thisStack.length - 1];
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

        if (node.type === 'ClassExpression') {
            return this.processClassExpression(node);
        }

        if (node.type === 'ThisExpression') {
            return this.processThisExpression();
        }

        if (isFunction(node)) {
            return this.processFunction(node);
        }
        return UNKNOWN;
    }

    private valuesForArgs(args: ASTNode[]): Value[] {
        return args.map(arg => this.valueFromASTNode(arg));
    }

    private getFunctionForCallSite(path: NodePath): NodePath {
        path = path.scope.path;
        while (path?.scope?.parent && path.node && !isFunction(path.node)) {
            path = path.scope.parent.path;
        }
        return path;
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

    /* eslint complexity: "off", max-lines-per-function: "off" */
    private buildCallChainsForMissingArgs(): void {
        let func;

        if (this.callChain.length + 1 >= MAX_CALL_CHAIN) {
            return;
        }

        if (this.selectedFunction) {
            func = this.selectedFunction;
        } else {
            func = this.currentFunction(true);
        }

        if (this.options.debugCallChains) {
            log(
                `args of function  ${debugFuncLabel(func)} are ` +
                `unknown, search for bindings. ` +
                `Chain len: ${this.callChain.length}`
            );
        }
        if (func.node.type === 'Program') {
            return;
        }

        const callSites = this.callManager.getCallSites(func.node);

        if (this.options.debugCallChains) {
            log(`found ${callSites.length} call sites`);
            for (const cs of callSites) {
                console.error(`    * cs: ` + cs);
            }
        }

        this.buildCallChain(func, callSites);
    }

    private buildCallChain(func: NodePath, callSites: NodePath[]) {
        for (const callSite of callSites) {
            if (this.options.debugCallChains) {
                log(`process call site ` + callSite);
            }

            const caller = this.getFunctionForCallSite(callSite);

            if (
                this.callChain.length > 0 &&
                this.callChain[0].code === caller
            ) {
                log('Found recursive call, limiting depth to 1');
                continue;
            }

            if (this.options.debugCallChains) {
                const description = String(caller).substring(0, 75);
                log(`found calling function ${description}`);
            }
            const funcDescr = this.makeFunctionDescription(func);
            const callDescr: FunctionCallDescription = {
                callSite: callSite.node as CallExpression,
                ...funcDescr
            };
            const chain = [callDescr].concat(this.callChain);
            this.callQueue.push({ func: caller, chain });
        }
    }

    private saveResult(
        result: SinkCall,
        location: SourceLocation|null|undefined
    ): void {
        const comb = ValueSet.produceCombinations(result.args);
        for (const argSet of comb) {
            const resultVariant: SinkCall = {
                funcName: result.funcName,
                args: argSet as Value[]
            };
            const resultStringified = stableStringify(resultVariant);

            // deduplicate results
            if (this.resultsAlready.has(resultStringified)) {
                continue;
            }
            this.resultsAlready.add(resultStringified);

            if (location) {
                resultVariant.location = { ...location, 'start': { ...location.start } };
            }
            this.results.push(resultVariant);
        }
    }

    private extractDEPFromArgs(
        funcName: string,
        args: ASTNode[],
        location: SourceLocation|null|undefined
    ): void {
        let argsDependOnFormalArg = false;

        this.argsStackOffset = null;

        if (!this.selectedFunction) {
            const offset = this.findClosestFrameWithArgs();

            if (offset !== -1) {
                this.argsStackOffset = offset;
            }
        }

        const argValues = args.map(arg => {
            let v = this.valueFromASTNode(arg),
                haveFormalArg;

            [v, haveFormalArg] = extractFormalArgs(v);
            if (haveFormalArg) {
                argsDependOnFormalArg = true;
            }
            return v;
        });

        this.saveResult({ funcName, args: argValues }, location);

        if (argsDependOnFormalArg && this.functionsStack.length > 0) {
            this.buildCallChainsForMissingArgs();
        }
        this.argsStackOffset = null;
    }

    private setArgValues(
        actualArgs: ASTNode[], formalArgs: string[], func: NodePath
    ): void {
        for (let i = 0; i < formalArgs.length; i++) {
            if (i >= actualArgs.length) {
                break;
            }
            const binding = func.scope.getBinding(formalArgs[i]);
            if (typeof binding === 'undefined') {
                log('Warning: Undefined binding for func argument within it\'s scope');
                continue;
            }
            this.memory.set(binding, this.valueFromASTNode(actualArgs[i]));
        }
    }

    private unsetArgValues(formalArgs: string[], func: NodePath): void {
        for (let i = 0; i < formalArgs.length; i++) {
            const binding = func.scope.getBinding(formalArgs[i]);
            if (typeof binding === 'undefined') {
                log('Warning: Undefined binding for func argument within it\'s scope');
                continue;
            }
            this.memory.set(binding, UNKNOWN);
        }
    }

    private proceedAlongCallChain(node: CallExpression): void {
        const f = this.callChain[this.callChainPosition];

        if (this.options.debugCallChains) {
            logCallStep(node, f.code);
        }

        this.setArgValues(node.arguments, f.args, f.code);
        this.callChainPosition++;
        this.extractDEPs(f.code, f);
        this.unsetArgValues(f.args, f.code);
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
        } as AST;
        for (const ast of this.parsedScripts) {
            result.program.body.push(...ast.program.body);
        }
        this.mergedProgram = result;
    }

    private argNamesForFunctionNode(node: FunctionASTNode): string[] {
        return node.params.map(param => {
            if (isIdentifier(param)) {
                return param.name;
            } else if (isAssignmentPattern(param)) {
                const left = param.left;
                if (isIdentifier(left)) {
                    return left.name;
                }
                // TODO: support default arg values
            }
            // TODO: support other parameter forms
            return 'unknownParam';
        });
    }

    private processFormDataMethods(
        fd: FormDataModel,
        methNode: Identifier,
        argNodes: ASTNode[]
    ): void {
        const args = this.valuesForArgs(argNodes);

        if (methNode.name === 'append') {
            if (!isUnknown(args[0])) {
                fd.append(args[0], args[1]);
            }
        }
    }

    private processURLSearchParamsMethods(
        usp: URLSearchParams,
        methNode: Identifier,
        argNodes: ASTNode[]
    ) {
        const args = this.valuesForArgs(argNodes);

        if (methNode.name === 'set' || methNode.name === 'append') {
            let name = args[0];
            if (name instanceof ValueSet) {
                name = name.tryToPeekConcrete();
            }
            let value = args[1];
            if (value instanceof ValueSet) {
                value = value.tryToPeekConcrete();
            }
            if (typeof name === 'string') {
                usp[methNode.name](name, String(value));
            }
        }
    }

    private tryBuiltInClassesOp(
        ob: Identifier|MemberExpression,
        prop: Identifier,
        args: ASTNode[]
    ): boolean {
        const obValue = this.valueFromASTNode(ob);
        if (obValue instanceof URLSearchParams) {
            this.processURLSearchParamsMethods(obValue, prop, args);
            return true;
        } else if (obValue instanceof FormDataModel) {
            this.processFormDataMethods(obValue, prop, args);
            return true;
        }
        return false;
    }

    private extractDEPsFreeStandingCall(
        calleeName: string,
        node: CallExpression
    ): void {
        if (matchFreeStandingCallSignature(calleeName)) {
            this.extractDEPFromArgs(
                calleeName,
                node.arguments,
                node.callee.loc
            );
        }
    }

    private startTrackingCallSequence(
        seq: CallSequence,
        ob: ASTNode,
        funcName: string,
        args: ASTNode[]
    ): void {
        if (!allAreExpressions(args)) {
            return;
        }
        const key = nodeKey(ob);
        this.getTrackedCallSequences().set(key, {
            sequence: seq,
            calls: [{ name: funcName, args }]
        });
    }

    private tryContinueCallSequence(
        ob: ASTNode,
        funcName: string,
        args: ASTNode[],
        location: SourceLocation|null|undefined
    ): boolean {
        if (!callSequenceMethodNames.has(funcName)) {
            return false;
        }

        const key = nodeKey(ob);
        const trackedSeq = this.getTrackedCallSequences().get(key);

        if (!trackedSeq) {
            return false;
        }

        const { sequence, calls } = trackedSeq;

        const isFinal = funcName === sequence.final;

        if (!isFinal && !sequence.intermediate.includes(funcName)) {
            return false;
        }

        if (!allAreExpressions(args)) {
            return false;
        }

        calls.push({ name: funcName, args });

        if (isFinal) {
            this.getTrackedCallSequences().delete(key);
            this.extractDEPFromArgs(
                sequence.name + '.' + funcName,
                // hack
                wrapSeqInObjectExpressions(calls),
                location
            );
        }
        return true;
    }

    private extractDEPsMethodCall(
        callee: MemberExpression,
        args: ASTNode[]
    ): void {
        const prop = callee.property;
        const ob = callee.object;

        if (prop.type !== 'Identifier') {
            return;
        }

        const isCallSeqPart = this.tryContinueCallSequence(
            ob,
            prop.name,
            args,
            callee.loc
        );

        if (isCallSeqPart) {
            return;
        }

        if (ob.type === 'Identifier' || ob.type === 'MemberExpression') {
            const isBuiltInClassesOp = this.tryBuiltInClassesOp(ob, prop, args);
            if (isBuiltInClassesOp) {
                return;
            }
        }

        const obDescr = matchMethodCallSignature(ob, prop);

        if (obDescr === null) {
            return;
        }

        if (obDescr instanceof CallSequence) {
            this.startTrackingCallSequence(obDescr, ob, prop.name, args);
            return;
        }

        const obName: string = obDescr;

        this.extractDEPFromArgs(obName + '.' + prop.name, args, callee.loc);
    }

    private extractDEPsFromCall(node: CallExpression): void {
        if (
            this.callChain.length > 0 &&
            this.callChainPosition < this.callChain.length
        ) {
            if (this.callChain[this.callChainPosition].callSite === node) {
                this.proceedAlongCallChain(node);
                return;
            }
        }
        const callee = node.callee;

        if (callee.type === 'Identifier') {
            this.extractDEPsFreeStandingCall(callee.name, node);
        } else if (callee.type === 'MemberExpression') {
            this.extractDEPsMethodCall(callee, node.arguments);
        }
    }

    private extractDEPsFromAssignmentExpression(
        node: AssignmentExpression
    ): void {
        if (node.left.type === 'MemberExpression') {
            const ob = this.valueFromASTNode(node.left.object);
            const val = this.valueFromASTNode(node.left);

            const isLocationObject = (
                (
                    ob === this.globalDefinitions.window ||
                    ob === this.globalDefinitions.document
                ) && val === this.globalDefinitions.location
            );

            const isLocationHref = (
                this.globalDefinitions.location instanceof URL &&
                ob === this.globalDefinitions.location &&
                val === this.globalDefinitions.location.href
            );

            if (isLocationObject || isLocationHref) {
                this.extractDEPFromArgs('replace_location', [node.right], node.loc);
            }
        }
        if (node.left.type === 'Identifier') {
            const ob = this.valueFromASTNode(node.left);

            if (ob === this.globalDefinitions.location) {
                this.extractDEPFromArgs('replace_location', [node.right], node.loc);
            }
        }
    }

    private traverseASTForDEPExtraction(code: AST | NodePath): void {
        const visitor = {
            enter: (path: NodePath): void => {
                const node = path.node;
                this.currentPath = path;
                if (isFunction(node)) {
                    this.argsStack.push(this.argNamesForFunctionNode(node));
                    this.formalArgs = this.argsStack[this.argsStack.length - 1];
                    this.functionsStack.push(path);
                    this.trackedCallSequencesStack.push(new Map());
                    this.ifStack.unshift(0);
                    this.addCurrentThis(node);
                }

                if (isIfStatement(node) || isSwitchStatement(node)) {
                    this.ifStack[0]++;
                }

                if (node.type === 'AssignmentExpression') {
                    this.extractDEPsFromAssignmentExpression(node);
                }

                if (
                    this.functionsStack.length > 0 &&
                    (node.type === 'VariableDeclarator' ||
                    node.type === 'AssignmentExpression')
                ) {
                    this.setVariable(path);
                }

                if (node.type === 'CallExpression') {
                    this.extractDEPsFromCall(node);
                }
            },
            exit: (path: NodePath): void => {
                if (isFunction(path.node)) {
                    this.argsStack.pop();
                    this.ifStack.shift();
                    this.formalArgs =
                        this.argsStack[this.argsStack.length - 1] || [];
                    this.functionsStack.pop();
                    this.trackedCallSequencesStack.pop();
                    this.restoreCurrentThis(path.node);
                }

                if (isIfStatement(path.node) || isSwitchStatement(path.node)) {
                    this.ifStack[0]--;
                }
            },
            CallExpression: path => {
                const node = path.node;

                const callee = node.callee;

                this.saveCallInfo(path);

                if (!isMemberExpression(callee)) {
                    return;
                }

                const ob = callee.object;
                const prop = callee.property;

                if (!isIdentifier(ob) || !isIdentifier(prop)) {
                    return;
                }
                if (
                    this.debug &&
                    ob.name === '$analyzer' &&
                    prop.name === 'log'
                ) {
                    this.debugLogValues(node.arguments);
                }
            },
            ReturnStatement: path => this.saveReturnValue(path)
        };

        if (code instanceof NodePath) {
            code.traverse(visitor);
        } else {
            traverse(code, visitor);
        }
    }

    private extractDEPs(
        code: AST | NodePath | null,
        funcInfo: FunctionDescription | null
    ): void {
        if (code === null) {
            throw new Error(
                'extractDEPs called with null code (mergeASTs was not called?)'
            );
        }

        this.functionsStack.length = 0;
        this.stage = AnalysisPhase.DEPExtracting;
        this.getTrackedCallSequences().clear();
        if (funcInfo !== null) {
            this.formalArgs = funcInfo.args;
            this.functionsStack.push(funcInfo.code);
            if (isFunction(funcInfo.code.node)) {
                this.argsStack.push(
                    this.argNamesForFunctionNode(funcInfo.code.node)
                );
                this.addCurrentThis(funcInfo.code.node);
            }
        } else {
            this.formalArgs = [];
        }
        this.traverseASTForDEPExtraction(code);
        if (funcInfo !== null) {
            this.functionsStack.pop();
            this.popCurrentThis();
        }
        if (isFunction(funcInfo?.code.node)) {
            this.argsStack.pop();
        }
    }

    private extractDEPsWithCallChain(callConfig: CallConfig): void {
        if (this.options.debugCallChains) {
            logCallChains(this.callQueue, callConfig);
        }
        this.callChain = callConfig.chain;
        this.callChainPosition = 0;

        const func = callConfig.func;

        this.selectedFunction = func;
        this.extractDEPs(func, this.makeFunctionDescription(func));
    }

    private seedGlobalScope(url: string): void {
        const globals = this.globalDefinitions;
        const locationObject = new URL(url);
        const propDescr = {
            configurable: false,
            get: () => locationObject,
            set: () => {/* ignore setting */}
        };

        Object.defineProperty(globals, 'location', propDescr);
        globals.document = {};

        Object.defineProperty(globals.document, 'location', propDescr);

        globals.window = globals;
    }

    private parseCode(): void {
        for (const script of this.scripts) {
            try {
                this.parsedScripts.push(parser.parse(
                    script.sourceText,
                    {
                        startLine: script.startLine,
                        sourceFilename: script.url,
                    }
                ));
            } catch (err) {
                log('Script parsing error: ' + err + '\n');
            }
        }
    }

    private getTrackedCallSequences() {
        const lastNum = this.trackedCallSequencesStack.length - 1;
        return this.trackedCallSequencesStack[lastNum];
    }

    private addCommentedCode(): void {
        for (const script of this.scripts) {
            let combComments: CommentASTNode[];
            const srcTxt = script.sourceText.replace(/^\s*[\r\n]/gm, '');
            try {
                combComments = combineComments(parser.parse(srcTxt, {
                    startLine: script.startLine,
                    sourceFilename: script.url,
                }).comments);
            } catch {
                continue;
            }

            const parsedComments = parseComments(combComments);
            this.parsedScripts.push(...parsedComments);
        }
    }

    private newHARCallback(har: HAR): void {
        if (!this.harFilter || this.harFilter(har)) {
            this.onNewHAR(har);
        }
    }

    onNewHAR(har: HAR): void {
        this.hars.push(har);
    }

    resetScripts(): void {
        this.scripts.length = 0;
    }

    mineArgsForDEPCalls(url: string, uncomment?: boolean): void {
        log('Analyzer: start parsing code');
        this.parseCode();

        if (uncomment) {
            this.addCommentedCode();
        }

        log('Analyzer: done parsing code');

        this.mergeASTs();

        this.seedGlobalScope(url);

        log('Analyzer: start gathering variable values');
        this.gatherVariableValues();

        log('Analyzer: search code for DEP calls');
        this.extractDEPs(this.mergedProgram, null);

        log('Analyzer: search code for DEP calls using call chains');
        while (this.callQueue.length > 0) {
            const callConfig: CallConfig = this.callQueue.shift() as CallConfig;

            this.extractDEPsWithCallChain(callConfig);
        }
    }

    makeHARsFromMinedDEPCallArgs(url: string, baseURI?: string): void {
        const harsAlready: Set<string> = new Set();
        if (typeof baseURI === 'string') {
            url = baseURI;
        }
        for (const result of this.results) {
            let har;

            try {
                har = makeHAR(result.funcName, result.args, url);
            } catch (err) {
                if (err instanceof BadURLError) {
                    continue;
                } else {
                    let argsStringified: string;
                    try {
                        argsStringified = JSON.stringify(result.args);
                    } catch {
                        argsStringified = '<JSON stringify failed>';
                    }
                    log(
                        'Analyzer: Error: failed to convert args to HAR: ' +
                        err + '\n' + err.stack + 'func: ' + result.funcName +
                        ' args: ' + argsStringified
                    );
                    continue;
                }
            }

            if (har === null) {
                continue;
            }

            const harStringified = stableStringify(har);

            // deduplicate HARs
            if (harsAlready.has(harStringified)) {
                continue;
            }
            harsAlready.add(harStringified);
            if (result.location) {
                let commented: boolean | undefined;
                let locationURL = result.location['filename'];

                if (locationURL && locationURL.startsWith('commented: ')) {
                    commented = true;
                    locationURL = locationURL.split(' ')[1];
                }

                har.initiator = {
                    type: LoadType.FromJSAnalyzer,
                    url: locationURL,
                    lineNumber: result.location.start.line,
                    columnNumber: result.location.start.column,
                    commented
                };
            }

            this.newHARCallback(har);
        }
    }

    analyze(url: string, uncomment?: boolean, baseURI?: string): void {
        this.mineArgsForDEPCalls(url, uncomment);
        log('Analyzer: code analysis done, now make HARs from found calls');
        this.makeHARsFromMinedDEPCallArgs(url, baseURI);
    }
}
