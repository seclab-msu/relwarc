import * as parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';
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
    Expression, SequenceExpression, LogicalExpression, OptionalMemberExpression,
    // validators
    isLiteral, isIdentifier, isNullLiteral, isObjectMethod, isRegExpLiteral,
    isTemplateLiteral, isSpreadElement, isFunction,
    isAssignmentPattern, isMemberExpression, isIfStatement, isSwitchStatement,
    isFunctionDeclaration, isClassDeclaration, isArrowFunctionExpression,
    isFunctionExpression, isBlockStatement,
    identifier as makeIdentifier,
} from '@babel/types';

import {
    UNKNOWN,
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
import { Memory, GlobalWindowObject } from './types/memory';
import { ClassObject, ClassManager, Instance, isVanillaMethod } from './types/classes';

import {
    CallConfigType,
    FunctionDescription,
    FunctionCallDescription,
    CallConfig,
    callConfigEqual
} from './call-chains';

import { CallManager } from './call-manager';
import { FunctionManager } from './function-manager';

import { hasattr, depJSONStringify } from './utils/common';
import { allAreExpressions, nodeKey } from './utils/ast';
import {
    STRING_METHODS,
    REGEXP_UNSETTABLE_PROPS,
    validateAnalysisPasses,
    checkCircularOrValueSet
} from './utils/analyzer';
import {
    safeToString,
    safeStringFromPrimitive,
    safeToStringOrRegexp,
    isTrivialString
} from './utils/string-conversions';
import { isEmptySimpleObject, isNonemptyObject } from './types/is-special';

import { HAR, BadURLError } from './har';
import { makeHAR } from './library-models/sinks';

import { LoadType } from './load-type';

import {
    matchFreeStandingCallSignature,
    matchMethodCallSignature,
    callSequenceMethodNames,
    checkForLibraryClass
} from './library-models/signatures';
import { LibClass, LibObject } from './types/lib-objects';

import { checkExclusion } from './library-models/lib-exclusion';

import { addPredefinedObjects } from './library-models/predefined-objects';

import {
    CallSequence,
    TrackedCallSequence,
    wrapSeqInObjectExpressions
} from './call-sequence';

import { log } from './logging';
import { setDebug, logCallChains, logCallStep, debugFuncLabel } from './debug';

import {
    ModuleManager,
    ModuleObject,
    REQUIRE_FUNCTION,
    REQUIRE_DEFINE
} from './module-manager';

const DEFAULT_ANALYSIS_PASSES = 4;

const MAX_CALL_CHAIN = 5;
const MAX_ACCUMULATED_STRING = 10000;
const MAX_TRIVIAL_ACCUMULATED_STRING = 32;
const MAX_CALL_DEPTH = 2;

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
    'Array',
    'Headers',
    'HttpRequest',
    'Object',
    'FormData',
    'URL',
    'URLSearchParams'
];


export interface SinkCall {
    funcName: string;
    args: Value[];
    location?: SourceLocation|null;
}

enum AnalysisPhase {
    DataFlowPropagationPass,
    DEPExtracting
}

interface Script {
    sourceText: string;
    startLine?: number;
    url?: string;
    sourceType?: string;
}

export interface AnalyzerOptions {
    analysisPasses: number;
    debug: boolean;
    debugCallChains: boolean;
    debugValueSets: boolean;
    debugModules: boolean;
    debugLibExclusion: boolean;
}

export class Analyzer {
    readonly parsedScripts: AST[];
    readonly results: SinkCall[];
    readonly scripts: Script[];
    readonly hars: HAR[];

    private readonly dynamic: DynamicAnalyzer | null;

    private argsStack: string[][];
    private readonly callQueue: CallConfig[];
    private readonly doneCallQueues: CallConfig[];

    private callChain: FunctionCallDescription[];
    private callChainPosition: number;
    private selectedFunction: NodePath | null;
    private formalArgs: string[];

    readonly classManager: ClassManager;
    private thisStack: Array<Instance | Unknown>;

    private readonly callManager: CallManager;
    private readonly functionManager: FunctionManager;

    private functionsStack: NodePath[];
    private mergedProgram: AST | null;

    private readonly memory: Memory;
    private readonly functionToBinding: WeakMap<ASTNode, Binding[]>;

    private currentPath: NodePath | null;
    private globalProgramPath: NodePath | null;

    private stage: AnalysisPhase | null;

    private pageURL: string | null;

    private argsStackOffset: number | null;

    private resultsAlready: Set<string>;

    private trackedCallSequencesStack: Map<string, TrackedCallSequence>[];

    private ifStack: number[];

    private callDepth: number;
    private currentCallRetVals: ValueSet | null;

    harFilter: null | ((har: HAR) => boolean);

    suppressedError: boolean;

    private readonly debug: boolean;

    private readonly moduleManager: ModuleManager;

    private readonly options: AnalyzerOptions;

    constructor(
        dynamicAnalyzer: DynamicAnalyzer | null = null,
        options?: Partial<AnalyzerOptions>
    ) {
        this.options = {
            analysisPasses: DEFAULT_ANALYSIS_PASSES,
            debug: false,
            debugCallChains: false,
            debugValueSets: false,
            debugModules: false,
            debugLibExclusion: true,
            ...options
        };

        validateAnalysisPasses(this.options.analysisPasses);

        this.parsedScripts = [];
        this.results = [];
        this.scripts = [];

        this.dynamic = dynamicAnalyzer;

        if (dynamicAnalyzer !== null) {
            dynamicAnalyzer.newScriptCallback = this.addScript.bind(this);
        }

        this.argsStack = [];
        this.formalArgs = [];

        this.classManager = new ClassManager();
        this.thisStack = [UNKNOWN];

        this.functionManager = new FunctionManager();
        this.callManager = new CallManager(this.functionManager);

        this.callQueue = [];
        this.doneCallQueues = [];
        this.callChain = [];
        this.callChainPosition = 0;

        this.hars = [];

        this.functionsStack = [];

        this.memory = new Memory();
        this.functionToBinding = new WeakMap();

        this.currentPath = null;
        this.globalProgramPath = null;
        this.stage = null;
        this.selectedFunction = null;
        this.argsStackOffset = null;
        this.mergedProgram = null;
        this.harFilter = null;
        this.pageURL = null;

        this.resultsAlready = new Set();

        this.trackedCallSequencesStack = [new Map()];
        this.suppressedError = false;

        this.ifStack = [0];

        this.callDepth = 0;
        this.currentCallRetVals = null;

        this.moduleManager = new ModuleManager();

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
        key: Binding,
        value: Value
    ): boolean {
        // TODO: this is bad
        if (!isUnknownOrUnknownString(value)) {
            return false;
        }

        // local variable
        if (!this.memory.has(key)) {
            return false;
        }
        return !isUnknown(this.memory.get(key));
    }

    private probeAddition(left: Value, right: Value): Value {
        // TODO: custom toString is not supported, leads to UNKNOWN result
        let result: Value;
        try {
            // @ts-ignore
            result = left + right;
        } catch {
            if (typeof left === 'string') {
                result = left + UNKNOWN;
            } else if (typeof right === 'string') {
                result = UNKNOWN + right;
            } else {
                result = UNKNOWN;
            }
        }
        if (typeof result === 'string') {
            if (
                result.length > MAX_TRIVIAL_ACCUMULATED_STRING &&
                isTrivialString(result)
            ) {
                return result.substring(0, MAX_TRIVIAL_ACCUMULATED_STRING);
            }
            if (result.length > MAX_ACCUMULATED_STRING) {
                return result.substring(0, MAX_ACCUMULATED_STRING);
            }
        }
        return result;
    }

    private saveVariable(
        binding: Binding,
        value: Value,
        op: string,
        fromGlobalSet=false
    ): void {
        if (op === '=' && this.lessConcreteThanOldVal(binding, value)) {
            return;
        }

        if (this.currentPath === null) {
            throw new Error('saveVariable called without currentPath set');
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
                const formalArgs = this.getCurrentFormalArgs(true);
                if (formalArgs.includes(binding.identifier.name)) {
                    return FROM_ARG;
                } else {
                    return UNKNOWN;
                }
            } else {
                return this.memory.get(binding);
            }
        })();

        const isEmptyValueSet = (
            value instanceof ValueSet && value.every(isEmptySimpleObject)
        );

        if (
            fromGlobalSet && op === '=' &&
            isNonemptyObject(oldValue) &&
            (isEmptySimpleObject(value) || isEmptyValueSet)
        ) {
            return;
        }

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
            v => typeof v === 'number' && Number.isFinite(v) && numbers.push(v)
        );
        if (numbers.length > 0) {
            arr.length = Math.min(Math.max(...numbers), 1000);
        }
    }

    private setObjectProperty(node: MemberExpression, value: Value): void {
        const prop = node.property;
        let propName: Value;
        if (node.computed) {
            propName = this.valueFromASTNode(prop);
        } else {
            if (!isIdentifier(prop)) {
                log('Warning: non-computed prop is not identifier');
                return;
            }
            propName = prop.name;
        }

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

        if (
            typeof propName === 'undefined' ||
            propName === null ||
            isUnknown(propName)
        ) {
            return;
        }

        const updatedObject = this.valueFromASTNode(node.object);

        const safeName = safeStringFromPrimitive(propName);

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
                !ob || typeof ob !== 'object' || isUnknown(ob) ||
                ob === this.memory.globalVars.location
            ) {
                return;
            }
            if (value instanceof FunctionValue) {
                const ast = value.getAST();
                if (
                    ob instanceof Instance &&
                    isVanillaMethod(ast)
                ) {
                    this.classManager.addMethodForInstance(ob, ast, safeName);
                }
            }

            if (
                safeName === null ||
                !this.shouldSetObjectProperty(ob, safeName, value)
            ) {
                return;
            }

            if (Array.isArray(ob) && safeName === 'length' && value instanceof ValueSet) {
                this.setArrayLengthFromSet(ob, value);
                return;
            }
            if (ob instanceof Instance) {
                if (!(value instanceof ValueSet)) {
                    value = new ValueSet([value]);
                }
                if (hasattr(ob, safeName)) {
                    value = value.join(ob[safeName]);
                }
            }
            if (ob instanceof GlobalWindowObject) {
                if (prop.type === 'Identifier') {
                    this.setGlobalVariable(prop, value, false);
                }
                return;
            }
            if (ob instanceof ModuleObject && safeName === 'exports') {
                this.moduleManager.setExportsObject(ob, value);
                return;
            }
            if (ob instanceof URL) {
                if (value instanceof ValueSet) {
                    value = value.tryToPeekConcrete();
                }

                try {
                    ob[safeName] = safeToString(value);
                } catch {
                    log('Warning: failed to assign value to URL.' + safeName);
                }
                return;
            }

            ob[safeName] = value;
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

            if (ob instanceof GlobalWindowObject) {
                return this.getGlobalVariable(propName);
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

    private setVariableByName(
        path: NodePath,
        left: Identifier,
        rval: Value,
        op: string
    ): void {
        const binding = this.createBindingIfNotExists(path, left);
        this.saveVariable(binding, rval, op);
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
                if (!this.memory.has(binding)) {
                    if (binding.scope.block.type === 'Program') {
                        this.memory.set(binding, UNKNOWN);
                    } else {
                        this.memory.set(binding, undefined);
                    }
                }
                return;
            }

            const value = this.valueFromASTNode(node.init);

            this.memory.set(binding, value);

            if (value instanceof FunctionValue) {
                this.addFunctionBinding(value.getAST(), binding);
            }
        } else if (node.type === 'AssignmentExpression') {
            const value = this.valueFromASTNode(node.right);
            if (node.left.type === 'Identifier') {
                this.setVariableByName(path, node.left, value, node.operator);
            } else if (node.left.type === 'MemberExpression') {
                this.setObjectProperty(node.left, value);
            }
        }
    }

    private createBindingIfNotExists(path: NodePath, id: Identifier): Binding {
        if (this.globalProgramPath === null ) {
            throw new Error('createBindingIfNotExists called without globalProgramPath set');
        }
        let binding = path.scope.getBinding(id.name);
        if (typeof binding === 'undefined') {
            this.globalProgramPath.scope.push({ id });
            binding = this.globalProgramPath.scope.getBinding(id.name);
        }

        if (typeof binding === 'undefined') {
            throw new Error('Warning: no binding for variable');
        }

        return binding;
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
        const retExpr = path.node.argument;
        if (!retExpr) {
            return;
        }
        if (this.currentCallRetVals) {
            this.currentCallRetVals.add(
                this.valueFromASTNode(retExpr)
            );
            return;
        }
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
        this.saveReturnValueForFunction(functionNode, retExpr);
    }

    private saveReturnValueForFunction(
        fn: FunctionASTNode,
        retExpr: Expression
    ): void {
        const v = this.valueFromASTNode(retExpr);
        const f = this.functionManager.getOrCreate(fn);
        this.callManager.saveReturnValue(f, v);
    }

    private requireDefineExports(path: NodePath<CallExpression>): void {
        const args = path.node.arguments;

        if (args.length < 2 || !args[0] || !args[1]) {
            log('Warning: require.d call with less than 2 arguments, skip');
            return;
        }

        const exports = this.valueFromASTNode(args[0]);
        const secondArg = this.valueFromASTNode(args[1]);

        if (isUnknown(exports) || typeof exports !== 'object' || !exports) {
            return;
        }

        let newExports: Value;

        if (args.length === 3 && typeof secondArg === 'string') {
            newExports = {
                [secondArg]: this.valueFromASTNode(args[2])
            };
        } else {
            newExports = secondArg;
        }

        if (
            isUnknown(newExports) || typeof newExports !== 'object' ||
            !newExports
        ) {
            return;
        }

        const newExportValueSets: Record<string, ValueSet> = {};

        for (const [k, v] of Object.entries(newExports)) {
            if (!(v instanceof FunctionValue)) {
                continue;
            }
            const rVals = this.callManager.getReturnValuesForFunction(v);
            if (!rVals) {
                continue;
            }
            newExportValueSets[k] = rVals;
        }

        for (const [k, v] of Object.entries(newExportValueSets)) {
            exports[k] = v;
        }
    }

    private saveCallInfo(path: NodePath<CallExpression>): void {
        const calleeValue = this.valueFromASTNode(path.node.callee);

        if (calleeValue === REQUIRE_FUNCTION) {
            return;
        }

        if (calleeValue === REQUIRE_DEFINE) {
            this.requireDefineExports(path);
            return;
        }

        const onTop = this.functionsStack.length === 0;

        if (CallManager.hasFunctions(calleeValue)) {
            const args = path.node.arguments.map(
                a => this.valueFromASTNode(a)
            );
            this.callManager.saveCallInfo(path, calleeValue, args, onTop);
        }
    }

    private setModuleVars(path: NodePath, node: FunctionASTNode): void {
        const moduleVars = this.moduleManager.getModuleVars(node);

        for (const [name, value] of Object.entries(moduleVars)) {
            const binding = path.scope.getBinding(name);
            if (typeof binding === 'undefined') {
                continue;
            }
            this.memory.set(binding, value);
        }
    }

    private handleVariableAssignment(path: NodePath): void {
        if (
            this.functionsStack.length === 0 &&
            this.stage === AnalysisPhase.DEPExtracting
        ) {
            // we ignore global var assignments on final analysis stage
            return;
        }
        this.setVariable(path);
    }

    private analysisPass(code: AST | NodePath): void {
        const stage = this.stage;
        const visitor = {
            enter: (path: NodePath) => {
                const node: ASTNode = path.node;
                this.currentPath = path;

                const detectedLib = checkExclusion(node);
                if (detectedLib) {
                    if (this.options.debugLibExclusion) {
                        log(`Analyzer: detected lib ${detectedLib}, skip node`);
                    }
                    path.skip();
                    return;
                }
                if (
                    stage === AnalysisPhase.DataFlowPropagationPass &&
                    (isFunctionDeclaration(node) || isClassDeclaration(node))
                ) {
                    this.declare(node);
                }
                if (isFunction(node)) {
                    if (this.moduleManager.isModule(node)) {
                        this.setModuleVars(path, node);
                        this.argsStack.push([]);
                    } else {
                        this.argsStack.push(this.argNamesForFunctionNode(node));
                    }
                    if (stage === AnalysisPhase.DEPExtracting) {
                        this.formalArgs =
                            this.argsStack[this.argsStack.length - 1];
                        this.trackedCallSequencesStack.push(new Map());
                    }
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
                    this.handleVariableAssignment(path);
                }

                if (stage === AnalysisPhase.DEPExtracting) {
                    if (node.type === 'AssignmentExpression') {
                        this.extractDEPsFromAssignmentExpression(node);
                    } else if (node.type === 'CallExpression') {
                        this.extractDEPsFromCall(node);
                    }
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
                    if (stage === AnalysisPhase.DEPExtracting) {
                        this.formalArgs =
                            this.argsStack[this.argsStack.length - 1] || [];
                        this.trackedCallSequencesStack.pop();
                    }
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
            ReturnStatement: path => this.saveReturnValue(path),
            ArrowFunctionExpression: path => {
                const body = path.node.body;

                if (!isBlockStatement(body)) {
                    this.saveReturnValueForFunction(path.node, body);
                }
            }
        };
        if (code instanceof NodePath) {
            code.traverse(visitor);
        } else {
            traverse(code, visitor);
        }
        if (this.stage === AnalysisPhase.DataFlowPropagationPass) {
            this.argsStack.length = 0; // clear args stack just in case
        }
    }

    private preliminaryPass(code: AST): void {
        let globalScopeInitialized = false;

        traverse(code, {
            enter: (path: NodePath) => {
                if (!globalScopeInitialized) {
                    this.seedGlobalScope(path);
                    globalScopeInitialized = true;
                }
                const detectedLib = checkExclusion(path.node);
                if (detectedLib) {
                    if (this.options.debugLibExclusion) {
                        log(`Analyzer: detected lib ${detectedLib}, skip node`);
                    }
                    path.skip();
                    return;
                }
                if (path.isFunction()) {
                    this.functionManager.saveFunctionWithPath(path);
                    if (this.moduleManager.isModule(path.node)) {
                        this.moduleManager.renameRequireInModules(path);
                    }
                }
            }
        });
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
            if (methodName === 'replace' || methodName === 'replaceAll') {
                if (isUnknown(args[0])) {
                    return UNKNOWN;
                }
                args = [safeToStringOrRegexp(args[0])].concat(
                    args.slice(1).map(arg => safeToString(arg))
                );
            } else {
                if (
                    methodName !== 'concat' && // allow Unknown args for concat
                    !args.every(v => !isUnknown(v))
                ) {
                    return UNKNOWN;
                }
                args = args.map(arg => safeToString(arg));
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
                return UNKNOWN;
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
        return UNKNOWN;
    }

    private processJSONStringify(args: ASTNode[]): Value {
        const arg = this.valueFromASTNode(args[0]);

        const stringify = (val: Value): string | Unknown => {
            if (
                val === FROM_ARG || val === 'FROM_ARG' || val === '"FROM_ARG"'
            ) {
                return '"FROM_ARG"';
            }

            if (isUnknown(val) || val === 'UNKNOWN' || val === '"UNKNOWN"') {
                return '"UNKNOWN"';
            }

            try {
                return depJSONStringify(val);
            } catch (err) {
                log(
                    'warning: suppressing exception from JSON.stringify: ' +
                    err
                );
                this.suppressedError = true;
                return UNKNOWN;
            }
        };

        const f = (val: Value): Value => {
            const { isCircular, hasValueSet } = checkCircularOrValueSet(val);

            if (isCircular) {
                return UNKNOWN; // JSON.stringify does not work for circular objects
            }

            if (!hasValueSet) {
                return stringify(val);
            }

            const variants = ValueSet.produceCombinations(val);

            if (variants.length === 1) {
                return stringify(variants[0]);
            }
            return new ValueSet(variants.map(stringify));
        };

        if (arg instanceof ValueSet) {
            return ValueSet.map(arg, f);
        }
        return f(arg);
    }

    private processMethodCall(
        callee: MemberExpression,
        args: ASTNode[]
    ): Value {
        const ob = callee.object;
        const prop = callee.property;
        let propIsIdentifier = false;
        let propName = '';
        if (prop.type === 'Identifier') { // TODO: there is a bug here, .computed should be checked
            propIsIdentifier = true;
            propName = prop.name;
        }
        if (ob.type === 'Identifier' && propIsIdentifier) {
            if (ob.name === 'JSON' && propName === 'stringify') {
                return this.processJSONStringify(args);
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
            propStr = safeToString(this.valueFromASTNode(prop));
        }

        if (propStr === 'toString') {
            const f = v => {
                if (isUnknown(v)) {
                    return v;
                }
                return safeToString(v);
            };
            return obValue instanceof ValueSet ? obValue.map(f) : f(obValue);
        }

        if (typeof obValue === 'string') {
            return this.processStringMethod(obValue, propStr, args);
        }

        return UNKNOWN;
    }

    private requireModule(requireArguments: ASTNode[]): Value {
        if (requireArguments.length < 1) {
            return UNKNOWN;
        }
        const arg0 = this.valueFromASTNode(requireArguments[0]);

        let name: string;

        if (typeof arg0 === 'string') {
            name = arg0;
        } else if (typeof arg0 === 'number') {
            name = String(arg0);
        } else {
            return UNKNOWN;
        }
        return this.moduleManager.exportsForName(name);
    }

    private stashTraversalState() {
        const traversalState = {
            functionsStack: this.functionsStack,
            formalArgs: this.formalArgs,
            argsStack: this.argsStack,
            thisStack: this.thisStack,
            trackedCallSequencesStack: this.trackedCallSequencesStack,
            ifStack: this.ifStack,
            currentCallRetVals: this.currentCallRetVals,
            currentPath: this.currentPath,
            argsStackOffset: this.argsStackOffset
        };

        this.functionsStack = [];
        this.thisStack = [UNKNOWN];
        this.formalArgs = [];
        this.argsStack = [];
        this.trackedCallSequencesStack = [new Map()];
        this.ifStack = [0];
        this.argsStackOffset = null;

        return traversalState;
    }

    private enterFunctionCall(
        node: CallExpression,
        callee: FunctionValue,
        calleePath: NodePath,
        argValues: Value[]
    ): ValueSet | null {
        this.callDepth++;

        const traversalState = this.stashTraversalState();

        this.currentCallRetVals = new ValueSet();

        const savedArgs: Map<Binding, Value> = new Map();

        const formalArgs = callee.getAST().params;
        const argBindings: Binding[] = [];

        for (let i = 0; i < node.arguments.length; i++) {
            if (i >= formalArgs.length) {
                break;
            }
            const formalArg = formalArgs[i];
            if (!isIdentifier(formalArg)) {
                continue;
            }
            const v = argValues[i];
            const b = calleePath.scope.getBinding(formalArg.name);

            if (typeof b === 'undefined') {
                throw new Error('Unexpected: func lacks binding for its arg');
            }

            argBindings.push(b);

            if (this.memory.has(b)) {
                savedArgs.set(b, this.memory.get(b));
            }

            this.memory.set(b, v);
        }

        if (
            isArrowFunctionExpression(callee.getAST()) &&
            callee.getAST().body &&
            !isBlockStatement(callee.getAST().body)
        ) {
            this.currentPath = calleePath;
            const ret = this.valueFromASTNode(callee.getAST().body);
            this.currentCallRetVals.add(ret);
        } else {
            this.addCurrentThis(callee.getAST());
            this.functionsStack.push(calleePath);
            this.analysisPass(calleePath);
        }

        for (const b of argBindings) {
            if (savedArgs.has(b)) {
                this.memory.set(b, savedArgs.get(b));
            } else {
                this.memory.delete(b);
            }
        }

        const result = this.currentCallRetVals;

        ({
            functionsStack: this.functionsStack,
            formalArgs: this.formalArgs,
            argsStack: this.argsStack,
            thisStack: this.thisStack,
            trackedCallSequencesStack: this.trackedCallSequencesStack,
            ifStack: this.ifStack,
            currentCallRetVals: this.currentCallRetVals,
            currentPath: this.currentPath,
            argsStackOffset: this.argsStackOffset
        } = traversalState);

        this.callDepth--;

        return result;
    }

    private getReturnValuesForFunctionCall(
        node: CallExpression,
        callee: FunctionValue,
        calleePath: NodePath
    ): ValueSet | null {
        const argValues = node.arguments.map(arg => this.valueFromASTNode(arg));

        const calleeAST = callee.getAST();
        const obj = this.classManager.getClassInstanceForMethod(calleeAST);

        const cachedRet = this.callManager.getCachedReturnValuesForCallSite(
            node, callee, obj, argValues
        );

        if (cachedRet !== null) {
            return cachedRet;
        }

        const ret = this.enterFunctionCall(node, callee, calleePath, argValues);

        if (ret !== null) {
            this.callManager.cacheReturnValuesForCallSite(
                node, callee, obj, argValues, ret
            );
        }

        return ret;
    }

    private determineReturnValues(node: CallExpression): ValueSet | null {
        const callees = this.callManager.getCallees(node);

        if (callees === null || callees.size === 0) {
            return null;
        }

        if (this.callDepth >= MAX_CALL_DEPTH) {
            return this.callManager.getReturnValuesForCallees(callees);
        }

        let result: ValueSet | null = null;

        callees.forEach(callee => {
            const calleePath = this.functionManager.getPath(callee);

            let returnValues: ValueSet | null;

            if (calleePath === null) {
                returnValues = this.callManager.getReturnValuesForCallees(
                    new Set([callee])
                );
            } else {
                returnValues = this.getReturnValuesForFunctionCall(
                    node,
                    callee,
                    calleePath
                );
            }
            if (returnValues) {
                result = (result || new ValueSet()).join(returnValues);
            }
        });
        return result;
    }

    private processFunctionCall(node: CallExpression): Value {
        const callee = node.callee;
        let result: Value = UNKNOWN;

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

        if (isIdentifier(callee) && callee.name === 'require') {
        // if (this.valueFromASTNode(callee) === REQUIRE_FUNCTION) {
        // TODO: evaluating callee would be more precise here, but for some
        // reason it took too long on our tests
            return this.requireModule(node.arguments);
        }

        const returnValues = this.determineReturnValues(node);

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
        method = safeToString(method);

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
                return new URL(safeToString(url), base);
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
                    const sArg = ((): string => {
                        try {
                            return String(arg);
                        } catch {
                            return '<String failed>';
                        }
                    })();
                    log(
                        `Warning: failed to create URLSearchParams with ` +
                        `${typeof arg} ${sArg}`
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

    private constructArray(node: NewExpression): Value {
        if (node.arguments.length === 0) {
            return [];
        }
        const args = node.arguments.map(a => this.valueFromASTNode(a));

        if (args.length === 1 && typeof args[0] === 'number') {
            const n = args[0];
            if (isNaN(n) || n < 0 || n > 1000) {
                return UNKNOWN;
            }
            return Array(n);
        }
        return args;
    }

    private constructPredefinedClass(name: string, node: NewExpression): Value {
        switch (name) {
        case 'Array':
            return this.constructArray(node);
            break;
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

    private checkForLibClass(clsObj: ClassObject): LibClass | null {
        const cls = this.classManager.classForClassObject(clsObj);
        if (!cls) {
            return null;
        }
        return checkForLibraryClass(cls);
    }

    private processLibClassInstantiation(
        lc: LibClass,
        node: NewExpression
    ): Value {
        if (lc.isAJAXCall) {
            this.extractDEPFromArgs(lc.libName, node.arguments, node.loc);
        }
        return new LibObject(lc.libName);
    }

    private processNewForClassObject(
        cls: ClassObject,
        node: NewExpression
    ): Value {
        const libCls = this.checkForLibClass(cls);
        if (libCls) {
            return this.processLibClassInstantiation(libCls, node);
        }
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
        return inst || UNKNOWN;
    }

    private processNewForFunction(
        ctor: FunctionValue,
        node: NewExpression
    ): Value {
        const args = node.arguments;
        this.callManager.saveCallArgs(ctor, args.map(
            v => this.valueFromASTNode(v)
        ));

        const cls = this.classManager.getClassForMethod(ctor.getAST());

        if (cls) {
            const libCls = checkForLibraryClass(cls);
            if (libCls) {
                return this.processLibClassInstantiation(libCls, node);
            }
            return cls.instance;
        }
        return UNKNOWN;
    }

    private processNewExpression(node: NewExpression): Value {
        const callee = node.callee;

        if (isIdentifier(callee) && PREDEFINED_CLASSES.includes(callee.name)) {
            return this.constructPredefinedClass(callee.name, node);
        }

        const f = (cls: Value): Value => {
            if (cls instanceof ClassObject) {
                return this.processNewForClassObject(cls, node);
            } else if (cls instanceof FunctionValue) {
                return this.processNewForFunction(cls, node);
            }
            return UNKNOWN;
        };

        const v = this.valueFromASTNode(callee);

        if (v instanceof ValueSet) {
            return v.map(f);
        } else {
            return f(v);
        }
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

    getGlobalVariable(name: string): Value {
        if (this.globalProgramPath === null) {
            throw new Error('getGlobalVariable called without globalProgramPath set');
        }
        const binding = this.globalProgramPath.scope.getBinding(name);

        if (typeof binding !== 'undefined' && binding.scope.block.type === 'Program') {
            if (this.memory.has(binding)) {
                return this.memory.get(binding);
            }
        }

        return undefined;
    }

    setGlobalVariable(
        variable: string|Identifier,
        value: Value,
        directSet: boolean
    ) {
        if (this.globalProgramPath === null) {
            throw new Error('setObjectProperty called without globalProgramPath set');
        }

        let id: Identifier;
        if (typeof variable === 'string') {
            id = makeIdentifier(variable);
        } else {
            id = variable;
        }

        const binding = this.createBindingIfNotExists(
            this.globalProgramPath,
            id
        );

        if (directSet) {
            this.memory.set(binding, value);
        } else {
            this.saveVariable(binding, value, '=', true);
        }
    }

    private getCurrentFormalArgs(bindingForArgExists: boolean): string[] {
        let formalArgs: string[] = this.formalArgs;

        if (this.argsStackOffset !== null) {
            formalArgs = this.argsStack[
                this.argsStack.length - this.argsStackOffset - 1
            ];
        } else if (
            this.stage === AnalysisPhase.DataFlowPropagationPass &&
            this.argsStack.length > 0 &&
            bindingForArgExists
        ) {
            formalArgs = this.argsStack[this.argsStack.length - 1];
        }
        return formalArgs;
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

        const formalArgs = this.getCurrentFormalArgs(binding !== undefined);

        if (formalArgs.includes(name)) {
            return this.getArgumentValue(formalArgs.indexOf(name));
        }
        if (this.upperArgumentExists(name)) {
            return UNKNOWN;
        }
        if (typeof binding !== 'undefined' && binding.scope.block.type === 'Program') {
            if (this.memory.has(binding)) {
                return this.memory.get(binding);
            }
        }
        return UNKNOWN;
    }

    private processMemberExpression(
        node: MemberExpression | OptionalMemberExpression
    ): Value {
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
        const getProp = n => this.getObjectProperty(ob, safeToString(n));
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

            if (prop.computed) {
                key = safeToString(this.valueFromASTNode(prop.key));
            } else {
                const k = prop.key;
                switch (k.type) {
                case 'StringLiteral':
                case 'NumericLiteral':
                    key = safeToString(k.value);
                    break;
                case 'Identifier':
                    key = k.name;
                    break;
                default:
                    log('warning: unexpected non-computed prop ' + k.type);
                    continue;
                }
            }

            if (isObjectMethod(prop)) {
                result[key] = this.processFunction(prop);
                continue;
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
            return UNKNOWN;
        } else if (this.stage === AnalysisPhase.DataFlowPropagationPass) {
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

    private processAssignmentExpression(node: AssignmentExpression): Value {
        const path = this.currentPath;

        if (path === null) {
            throw new Error('processAssignmentExpression: no path');
        }
        const v = this.valueFromASTNode(node.right);

        if (isIdentifier(node.left)) {
            this.setVariableByName(path, node.left, v, node.operator);
        }

        return v;
    }

    private processSequenceExpression(node: SequenceExpression): Value {
        if (node.expressions.length === 0) {
            log('Warning: empty seq expr');
            return UNKNOWN;
        }
        const last = node.expressions[node.expressions.length - 1];
        return this.valueFromASTNode(last);
    }

    private processLogicalExpression(node: LogicalExpression): Value {
        if (node.operator !== '||') {
            return UNKNOWN;
        }

        const isTrivial = (ob: unknown): boolean => (
            (isUnknown(ob) &&
            ob !== FROM_ARG) ||
            ob === null ||
            ob === undefined ||
            ob === false ||
            ob === '' ||
            ob === 'UNKNOWN' ||
            (ob instanceof ValueSet && ob.every(isTrivial))
        );

        const left = this.valueFromASTNode(node.left);
        const right = this.valueFromASTNode(node.right);

        if (isTrivial(left)) {
            return right;
        }
        if (isTrivial(right)) {
            return left;
        }

        if (isEmptySimpleObject(left) && isEmptySimpleObject(right)) {
            return left;
        }

        let result: ValueSet;

        if (left instanceof ValueSet) {
            result = left;
        } else {
            result = new ValueSet([left]);
        }
        result.add(right);

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

        if (
            node.type === 'MemberExpression' ||
            node.type === 'OptionalMemberExpression'
        ) {
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

        if (node.type === 'AssignmentExpression') {
            return this.processAssignmentExpression(node);
        }

        if (node.type === 'SequenceExpression') {
            return this.processSequenceExpression(node);
        }

        if (node.type === 'LogicalExpression') {
            return this.processLogicalExpression(node);
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
            this.enqueueCallConfig({ func: caller, chain });
        }
    }

    private enqueueCallConfig(cc: CallConfig): void {
        for (const elem of this.callQueue.concat(this.doneCallQueues)) {
            if (callConfigEqual(cc, elem)) {
                return;
            }
        }

        this.callQueue.push(cc);
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

    private mergeASTs(): AST {
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
        return result;
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
                usp[methNode.name](name, safeToString(value));
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
                    ob === this.memory.globalVars.window ||
                    ob === this.memory.globalVars.document
                ) && val === this.memory.globalVars.location
            );

            const isLocationHref = (
                this.memory.globalVars.location instanceof URL &&
                ob === this.memory.globalVars.location &&
                val === this.memory.globalVars.location.href
            );

            if (isLocationObject || isLocationHref) {
                this.extractDEPFromArgs('replace_location', [node.right], node.loc);
            }
        }
        if (node.left.type === 'Identifier') {
            const ob = this.valueFromASTNode(node.left);

            if (ob === this.memory.globalVars.location) {
                this.extractDEPFromArgs('replace_location', [node.right], node.loc);
            }
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
        this.analysisPass(code);
        if (funcInfo !== null) {
            this.functionsStack.pop();
            this.popCurrentThis();
        }
        if (isFunction(funcInfo?.code.node)) {
            this.argsStack.pop();
        }
    }

    private proceedWithSavedGlobalCallArgsForChain(callConfig): void {
        const wantedCall = callConfig.chain[0];
        const cs = wantedCall.callSite;
        const func = wantedCall.code;

        if (this.options.debugCallChains) {
            log('skip traversing global code and enter site:');
            logCallStep(cs, func);
        }

        const f = wantedCall.code.node;
        const formalArgs = wantedCall.args;
        const actualArgs = cs.arguments;

        for (let i = 0; i < formalArgs.length; i++) {
            if (i >= actualArgs.length) {
                break;
            }
            const argValues = this.callManager.getArgumentForSite(f, cs, i);

            if (argValues === null) {
                throw new Error('unexpected: no saved args for global call site');
            }
            const binding = func.scope.getBinding(formalArgs[i]);
            if (typeof binding === 'undefined') {
                log('Warning: Undefined binding for func argument within it\'s scope');
                continue;
            }
            this.memory.set(binding, argValues);
        }

        this.callChainPosition++;
        this.extractDEPs(func, wantedCall);
        this.unsetArgValues(formalArgs, func);
        this.callChainPosition--;
    }

    private extractDEPsWithCallChain(callConfig: CallConfig): void {
        if (this.options.debugCallChains) {
            logCallChains(this.callQueue, callConfig);
        }
        this.callChain = callConfig.chain;
        this.callChainPosition = 0;

        const func = callConfig.func;

        this.selectedFunction = func;

        if (!func.isFunction()) {
            this.proceedWithSavedGlobalCallArgsForChain(callConfig);
        } else {
            this.extractDEPs(func, this.makeFunctionDescription(func));
        }
    }

    private seedGlobalScope(path: NodePath): void {
        this.globalProgramPath = path;

        if (this.pageURL === null) {
            throw new Error('seedGlobalScope: page URL not set');
        }

        const locationObject = new URL(this.pageURL);
        const propDescr = {
            configurable: false,
            get: () => locationObject,
            set: () => {/* ignore setting */}
        };

        const doc = {};
        Object.defineProperty(doc, 'location', propDescr);

        this.setGlobalVariable('window', new GlobalWindowObject(), true);
        this.setGlobalVariable('document', doc, true);
        this.setGlobalVariable('location', locationObject, true);
        this.setGlobalVariable('undefined', undefined, true);

        addPredefinedObjects(this);
    }

    private parseCode(): void {
        for (const script of this.scripts) {
            const bundleName = script.url || '<anonymous>';

            if (this.options.debugModules) {
                log(`Feed script ${bundleName} to debundler`);
            }

            if (this.options.debugModules) {
                log(`Debundler done on ${bundleName}`);
            }

            let parsedScript;
            try {
                parsedScript = parser.parse(
                    script.sourceText,
                    {
                        startLine: script.startLine,
                        sourceFilename: script.url,
                    }
                );
            } catch (err) {
                log('Script parsing error: ' + err + '\n');
                continue;
            }

            if (this.moduleManager.addModule(parsedScript, bundleName)) {
                log(
                    `Analyzer: debundler has detected a bundle in ${bundleName}`
                );
            } else {
                this.parsedScripts.push(parsedScript);
            }
        }
        const nModules = this.moduleManager.getModuleCount();
        if (nModules) {
            log(`Analyzer: taking ${nModules} modules from debundler`);
            this.moduleManager.prepareModules((name, moduleNode) => {
                if (this.options.debugModules) {
                    log(`====== module '${name}' ======`);
                    log(generate(moduleNode).code);
                    log('============`);');
                }
                this.parsedScripts.push(moduleNode);
                return moduleNode.program.body[0];
            });
        }
    }

    private getTrackedCallSequences() {
        const lastNum = this.trackedCallSequencesStack.length - 1;
        return this.trackedCallSequencesStack[lastNum];
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

    mineArgsForDEPCalls(url: string): void {
        log('Analyzer: start parsing code');
        this.parseCode();

        log('Analyzer: done parsing code');

        const mergedProgram = this.mergeASTs();
        this.mergedProgram = mergedProgram;

        this.pageURL = url;

        log('Analyzer: make preliminary code pass');
        this.preliminaryPass(mergedProgram);

        log('Analyzer: run data flow analysis passes');
        this.stage = AnalysisPhase.DataFlowPropagationPass;
        for (let i = 0; i < this.options.analysisPasses; i++) {
            log(`Analyzer: run analysis pass ${i}`);
            this.analysisPass(mergedProgram);
        }

        log('Analyzer: search code for DEP calls');
        this.extractDEPs(mergedProgram, null);

        log('Analyzer: search code for DEP calls using call chains');
        while (this.callQueue.length > 0) {
            const callConfig: CallConfig = this.callQueue.shift() as CallConfig;

            this.doneCallQueues.push(callConfig);

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

    analyze(url: string, baseURI?: string): void {
        this.mineArgsForDEPCalls(url);
        log('Analyzer: code analysis done, now make HARs from found calls');
        this.makeHARsFromMinedDEPCallArgs(url, baseURI);
    }
}
