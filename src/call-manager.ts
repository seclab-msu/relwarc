import {
    CallExpression,
    Node as ASTNode,
    Function as FunctionASTNode,
    isFunction
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { Value } from './types/generic';
import { ValueSet } from './types/value-set';
import { FunctionValue } from './types/function';
import { isUnknown } from './types/unknown';

import { FunctionManager } from './function-manager';

type ArgTable = Map<FunctionValue, Array<ValueSet>>;

export class CallManager {
    readonly siteTable: Map<CallExpression, Set<FunctionValue>>;
    readonly rsiteTable: Map<FunctionValue, Set<NodePath>>;
    readonly returnValueTable: Map<FunctionValue, ValueSet>;
    readonly argTable: ArgTable;
    readonly siteArgTable: Map<CallExpression, ArgTable>;
    private readonly functionManager: FunctionManager;

    constructor(functionManager: FunctionManager) {
        this.siteTable = new Map();
        this.rsiteTable = new Map();
        this.returnValueTable = new Map();
        this.argTable = new Map();
        this.siteArgTable = new Map();

        this.functionManager = functionManager;
    }

    static hasFunctions(v: Value): boolean {
        if (v instanceof ValueSet) {
            return v.getValues().some(el => el instanceof FunctionValue);
        }
        return v instanceof FunctionValue;
    }

    private saveCallee(path: NodePath, c: Value): void {
        if (!(c instanceof FunctionValue)) {
            return;
        }
        let set = this.siteTable.get(path.node as CallExpression);
        if (!set) {
            set = new Set();
            this.siteTable.set(path.node as CallExpression, set);
        }
        set.add(c);
        let rset = this.rsiteTable.get(c);
        if (!rset) {
            rset = new Set();
            this.rsiteTable.set(c, rset);
        }
        rset.add(path);
    }

    saveCallees(path: NodePath, callees: Value): void {
        if (isUnknown(callees)) {
            return;
        }
        if (callees instanceof ValueSet) {
            // recurse to handle nested value sets
            callees.forEach(v => this.saveCallees(path, v));
        } else {
            this.saveCallee(path, callees);
        }
    }

    getCallSites(node: FunctionASTNode): NodePath[] {
        const func = this.functionManager.getOrCreate(node);
        const sites = this.rsiteTable.get(func);

        if (typeof sites === 'undefined') {
            return [];
        } else {
            return [...sites];
        }
    }
    saveReturnValue(f: FunctionValue, v: Value): void {
        let set = this.returnValueTable.get(f);

        if (!set) {
            if (v instanceof ValueSet) {
                set = v;
            } else {
                set = new ValueSet([v]);
            }
        } else {
            set = set.join(v);
        }
        this.returnValueTable.set(f, set);
    }
    getCallees(c: CallExpression): Set<FunctionValue> | null {
        const callees = this.siteTable.get(c);

        if (!callees || callees.size === 0) {
            return null;
        }
        return callees;
    }
    getReturnValuesForCallees(callees: Set<FunctionValue>): ValueSet | null {
        const result = ValueSet.join(
            ...([...callees]
                .map(f => this.returnValueTable.get(f))
                .filter(x => x)
            )
        );
        if (result.empty()) {
            return null;
        }
        return result;
    }
    private static saveCallArgsToTable(
        callee: FunctionValue,
        args: Value[],
        table: ArgTable
    ): void {
        let argInfo = table.get(callee);
        if (typeof argInfo === 'undefined') {
            argInfo = new Array(args.length);
            table.set(callee, argInfo);
        }
        argInfo.length = Math.max(argInfo.length, args.length);
        for (let i = 0; i < args.length; i++) {
            if (isUnknown(args[i])) {
                continue;
            }
            if (argInfo[i]) {
                argInfo[i] = argInfo[i].join(args[i]);
            } else {
                argInfo[i] = ValueSet.join(args[i]);
            }
        }
    }
    saveCallArgs(callee: FunctionValue, args: Value[]): void {
        CallManager.saveCallArgsToTable(callee, args, this.argTable);
    }
    private saveFnCallInfo(
        path: NodePath,
        c: Value,
        args: Value[],
        onTop: boolean
    ): void {
        if (!(c instanceof FunctionValue)) {
            return;
        }
        this.saveCallee(path, c);
        this.saveCallArgs(c, args);
        if (onTop) {
            this.saveArgsForCallSite(path, c, args);
        }
    }
    private saveArgsForCallSite(path: NodePath, c: Value, args: Value[]): void {
        if (!(c instanceof FunctionValue)) {
            return;
        }
        let siteSet = this.siteArgTable.get(path.node as CallExpression);

        if (!siteSet) {
            siteSet = new Map();
            this.siteArgTable.set(path.node as CallExpression, siteSet);
        }
        CallManager.saveCallArgsToTable(c, args, siteSet);
    }

    saveCallInfo(
        path: NodePath,
        callees: Value,
        args: Value[],
        onTop: boolean
    ): void {
        if (isUnknown(callees)) {
            return;
        }
        if (callees instanceof ValueSet) {
            // recurse to handle nested value sets
            callees.forEach(v => this.saveCallInfo(path, v, args, onTop));
        } else {
            this.saveFnCallInfo(path, callees, args, onTop);
        }
    }
    getArgument(f: ASTNode, idx: number): ValueSet | null {
        if (!isFunction(f)) {
            throw new Error('getArgument: function AST node is expected');
        }
        const args = this.argTable.get(this.functionManager.getOrCreate(f));

        if (typeof args === 'undefined') {
            return null;
        }

        return args[idx] || null;
    }
    getArgumentForSite(
        f: ASTNode,
        site: CallExpression,
        idx: number
    ): ValueSet | null {
        if (!isFunction(f)) {
            throw new Error('getArgument: function AST node is expected');
        }
        const t = this.siteArgTable.get(site);
        if (!t) {
            return null;
        }
        const args = t.get(this.functionManager.getOrCreate(f));

        if (typeof args === 'undefined') {
            return null;
        }

        return args[idx] || null;
    }
    getReturnValuesForFunction(f: FunctionValue): ValueSet | null {
        return this.returnValueTable.get(f) || null;
    }
}
