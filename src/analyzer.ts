import * as parser from '@babel/parser';
import traverse, { NodePath, Scope } from '@babel/traverse';
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
    // validators
    isLiteral, isIdentifier, isNullLiteral, isObjectMethod, isRegExpLiteral,
    isTemplateLiteral, isSpreadElement, isFunction, isCallExpression,
    isAssignmentPattern, isMemberExpression, isIfStatement, isSwitchStatement
} from '@babel/types';

import {
    UNKNOWN,
    UNKNOWN_FUNCTION,
    UNKNOWN_FROM_FUNCTION,
    isUnknown,
    isUnknownOrUnknownString
} from './types/unknown';

import { DynamicAnalyzer } from './dynamic/analyzer';

import { FROM_ARG, extractFormalArgs } from './types/formalarg';
import { FormDataModel } from './types/form-data';
import { FunctionValue } from './types/function';
import { Value, NontrivialValue } from './types/generic';
import { ValueSet } from './types/value-set';

import { hasattr } from './utils/common';
import { allAreExpressions, nodeKey } from './utils/ast';
import { STRING_METHODS } from './utils/analyzer';

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


type VarScope = { [varName: string]: Value };

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
    binding: Binding | undefined;
}

interface CallConfig {
    func: NodePath;
    chain: FunctionCallDescription[];
}

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

    private readonly debugCallChains: boolean;
    private readonly debugValueSets: boolean;

    constructor(dynamicAnalyzer: DynamicAnalyzer | null = null) {
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

        this.debugCallChains = false;
        this.debugValueSets = false;

        this.ifStack = [0];
    }

    addScript(
        sourceText: string,
        startLine?: number,
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

    private shouldGetObjectProperty(name: string): boolean {
        // TODO: see shouldSetObjectProperty
        if (SPECIAL_PROP_NAMES.includes(name)) {
            return false;
        }
        return true;
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

        if (!this.shouldSetObjectProperty(propName, value)) {
            return;
        }

        const updatedObject = this.valueFromASTNode(node.object);

        const update = ob => {
            if (
                ob &&
                typeof ob === 'object' &&
                !isUnknown(ob) &&
                ob !== this.globalDefinitions.location
            ) {
                if (propName instanceof ValueSet) {
                    // TODO(asterite): maybe implement this somehow
                    if (this.debugValueSets) {
                        log(
                            'Warning: assigning props with ValueSet names ' +
                            'are currently skipped'
                        );
                    }
                    return;
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

    private gatherVariableValues(): void {
        this.stage = AnalysisPhase.VarGathering;
        if (this.mergedProgram === null) {
            throw new Error('gatherVariableValues was called before mergeASTs');
        }
        traverse(this.mergedProgram, {
            enter: (path: NodePath) => {
                const node: ASTNode = path.node;
                if (isFunction(node)) {
                    this.argsStack.push(this.argNamesForFunctionNode(node));
                    this.ifStack.unshift(0);
                }
                if (isIfStatement(node) || isSwitchStatement(node)) {
                    this.ifStack[0]++;
                }
            },
            exit: (path: NodePath) => {
                this.currentPath = path;
                const node: ASTNode = path.node;
                if (
                    node.type === 'VariableDeclarator' ||
                    node.type === 'AssignmentExpression'
                ) {
                    this.setVariable(path);
                } else if (node.type === 'FunctionDeclaration') {
                    if (node.id === null || typeof node.id === 'undefined') {
                        log(
                            'Warning: id is null for function declaration: ' +
                                JSON.stringify(node)
                        );
                        return;
                    }

                    if (path.parentPath === null) {
                        return;
                    }

                    const binding = path.parentPath.scope.getBinding(
                        node.id.name
                    );

                    if (typeof binding === 'undefined') {
                        log(
                            'Warning: no binding function declaration: ' +
                                JSON.stringify(node)
                        );
                        return;
                    }

                    this.memory.set(binding, new FunctionValue(node));
                    this.addFunctionBinding(node, binding);
                }
                if (isFunction(node)) {
                    this.argsStack.pop();
                    this.ifStack.shift();
                }
                if (isIfStatement(node) || isSwitchStatement(node)) {
                    this.ifStack[0]--;
                }
            },
            CallExpression: path => {
                const node = path.node;

                const callee = node.callee;

                if (!isMemberExpression(callee)) {
                    return;
                }

                const ob = callee.object;
                const prop = callee.property;

                if (!isIdentifier(ob) || !isIdentifier(prop)) {
                    return;
                }
                if (ob.name === '$analyzer' && prop.name === 'log') {
                    this.debugLogValues(node.arguments);
                }
            }
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
        for (const a of args) {
            const v = this.valueFromASTNode(a);
            console.log(JSON.stringify(v, (key, value) => {
                if (value instanceof ValueSet) {
                    return {
                        'type': 'ValueSet',
                        'values': value.getValues()
                    };
                }
                return value;
            }, 4));
        }
    }

    private processFreeStandingFunctionCall(
        name: string,
        args: ASTNode[]
    ): Value {
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

        if (typeof obValue === 'string') {
            let propStr: string;
            if (propIsIdentifier) {
                propStr = propName;
            } else {
                propStr = String(this.valueFromASTNode(prop));
            }
            return this.processStringMethod(obValue, propStr, args);
        }

        return UNKNOWN_FROM_FUNCTION;
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
        } else if (callee.name === 'Object') {
            return {};
        } else if (callee.name === 'FormData') {
            return new FormDataModel();
        }
        return UNKNOWN_FROM_FUNCTION;
    }

    private processBinaryExpression(node: BinaryExpression): Value {
        if (node.operator === '+') {
            const left = this.valueFromASTNode(node.left);
            const right = this.valueFromASTNode(node.right);

            if ((left instanceof ValueSet) || (right instanceof ValueSet)) {
                return ValueSet.map2(left, right, (l, r) => {
                    return this.probeAddition(l, r);
                });
            }
            return this.probeAddition(left, right);
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
        }

        if (~formalArgs.indexOf(name) || this.selectedFunction) {
            if (formalArgs.includes(name)) {
                return FROM_ARG;
            }
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
        const propName = this.valueFromASTNode(node.property);
        if (!propName || isUnknown(propName)) {
            return UNKNOWN;
        }
        const getProp = n => {
            return this.getObjectProperty(ob, String(n));
        };
        if (propName instanceof ValueSet) {
            return ValueSet.join(...propName.getValues().map(getProp));
        } else {
            return getProp(propName);
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
        let templateString = '';
        for (let i = 0; i < node.quasis.length; i++) {
            templateString += node.quasis[i].value.cooked;
            if (typeof node.expressions[i] !== 'undefined') {
                templateString += this.valueFromASTNode(node.expressions[i]);
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
            return UNKNOWN_FUNCTION;
        } else if (this.stage === AnalysisPhase.VarGathering) {
            return new FunctionValue(node);
        } else {
            throw new Error('Unexpected stage: ' + this.stage);
        }
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
                if (
                    path.node.name === name &&
                    path.scope.getBinding(path.node.name) === binding &&
                    isCallExpression(path.parentPath.node) &&
                    path.parentPath.node.callee === path.node
                ) {
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

    private findCallSitesForGlobalVariables(
        identifier: Identifier
    ): NodePath[] {
        const name = identifier.name;

        const result: NodePath[] = [];

        if (this.mergedProgram === null) {
            throw new Error('findCallSitesForGlobalVariables was called before mergeASTs');
        }

        traverse(this.mergedProgram, {
            // XXX: ReferencedIdentifier is not defined in Babel's TypeScript
            // type definitions, but it is used in Babel's own code
            // @ts-ignore
            ReferencedIdentifier(path) {
                if (
                    path.node.name === name &&
                    isCallExpression(path.parentPath.node) &&
                    path.parentPath.node.callee === path.node
                ) {
                    result.push(path);
                }
            },
            Scope(path) {
                if (path.scope.getBindingIdentifier(name)) {
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

    /* eslint complexity: "off", max-lines-per-function: "off" */
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
        if (this.debugCallChains) {
            log(
                `args of function  ${String(func).substring(0, 75)} are` +
                `unknown, search for bindings. ` +
                `Chain len: ${this.callChain.length}`
            );
        }
        if (typeof bindings === 'undefined') {
            if (
                func.parent.type !== 'AssignmentExpression' ||
                func.parent.left.type !== 'Identifier'
            ) {
                return;
            }

            const identifier = func.parent.left;
            const callSites = this.findCallSitesForGlobalVariables(identifier);

            this.buildCallChain(func, callSites);
        } else {
            for (const binding of bindings) {
                if (this.debugCallChains) {
                    log('found binding ' + binding.identifier.name);
                }
                const callSites = this.findCallSitesForBinding(binding);

                this.buildCallChain(func, callSites, binding);
            }
        }
    }

    private buildCallChain(
        func: NodePath,
        callSites: NodePath[],
        binding: Binding | undefined = undefined
    ) {
        const uniqueCallers = new Set();

        for (const callSite of callSites) {
            const caller = this.getFunctionForCallSite(callSite);

            if (uniqueCallers.has(caller)) {
                continue;
            }
            uniqueCallers.add(caller);

            if (
                this.callChain.length > 0 &&
                this.callChain[0].code === caller
            ) {
                log('Found recursive call, limiting depth to 1');
                continue;
            }

            if (this.debugCallChains) {
                const description = String(caller).substring(0, 75);
                log(`for it, found call site ${description}`);
            }
            const funcDescr = this.makeFunctionDescription(func);
            const callDescr: FunctionCallDescription = {
                binding,
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

                // for 0-based lineNumber
                resultVariant.location.start.line--;
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

    private processFormDataAppend(
        fd: FormDataModel,
        methNode: ASTNode,
        argNodes: ASTNode[]
    ): void {
        const args = this.valuesForArgs(argNodes);

        if (!isUnknown(args[0])) {
            fd.append(args[0], args[1]);
        }
    }

    private tryFormDataOp(
        ob: Identifier,
        prop: Identifier,
        args: ASTNode[]
    ): boolean {
        if (prop.name === 'append') {
            const obValue = this.valueFromASTNode(ob);
            if (obValue instanceof FormDataModel) {
                this.processFormDataAppend(obValue, prop, args);
                return true;
            }
        }
        return false;
    }

    private extractDEPsFreeStandingCall(
        calleeName: string,
        node: CallExpression,
        scope: Scope
    ): void {
        if (
            this.callChain.length > 0 &&
            this.callChainPosition < this.callChain.length
        ) {
            const binding = scope.getBinding(calleeName);
            if (this.callChain[this.callChainPosition].binding === binding) {
                this.proceedAlongCallChain(node);
            }
        }

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

        if (ob.type === 'Identifier') {
            const isFormDataOp = this.tryFormDataOp(ob, prop, args);
            if (isFormDataOp) {
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

    private extractDEPsFromCall(node: CallExpression, scope: Scope): void {
        const callee = node.callee;

        if (callee.type === 'Identifier') {
            this.extractDEPsFreeStandingCall(callee.name, node, scope);
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
                    this.extractDEPsFromCall(node, path.scope);
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
                }

                if (isIfStatement(path.node) || isSwitchStatement(path.node)) {
                    this.ifStack[0]--;
                }
            },
            CallExpression: path => {
                const node = path.node;

                const callee = node.callee;

                if (!isMemberExpression(callee)) {
                    return;
                }

                const ob = callee.object;
                const prop = callee.property;

                if (!isIdentifier(ob) || !isIdentifier(prop)) {
                    return;
                }
                if (ob.name === '$analyzer' && prop.name === 'log') {
                    this.debugLogValues(node.arguments);
                }
            }
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
            }
        } else {
            this.formalArgs = [];
        }
        this.traverseASTForDEPExtraction(code);
        if (funcInfo !== null) {
            this.functionsStack.pop();
        }
        if (isFunction(funcInfo?.code.node)) {
            this.argsStack.pop();
        }
    }

    private extractDEPsWithCallChain(callConfig: CallConfig): void {
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