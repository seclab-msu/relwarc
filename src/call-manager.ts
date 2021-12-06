import { CallExpression, Function as FunctionASTNode } from '@babel/types';
import { NodePath } from '@babel/traverse';

import { Value } from './types/generic';
import { ValueSet } from './types/value-set';
import { FunctionValue } from './types/function';
import { isUnknown } from './types/unknown';

import { FunctionManager } from './function-manager';

export class CallManager {
    readonly siteTable: Map<CallExpression, Set<FunctionValue>>;
    readonly rsiteTable: Map<FunctionValue, Set<NodePath>>;
    readonly returnValueTable: Map<FunctionValue, ValueSet>;
    // readonly argTable: Map<FunctionValue, Array<ValueSet>>;
    private readonly functionManager: FunctionManager;

    constructor(functionManager: FunctionManager) {
        this.siteTable = new Map();
        this.rsiteTable = new Map();
        this.returnValueTable = new Map();
        // this.argTable = new Map();

        this.functionManager = functionManager;
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
    getReturnValuesForCallSite(c: CallExpression): ValueSet | null {
        const callees = this.siteTable.get(c);

        if (!callees || callees.size === 0) {
            return null;
        }

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
}
