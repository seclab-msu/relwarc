import { CallExpression } from '@babel/types';

import { Value } from './types/generic';
import { ValueSet } from './types/value-set';
import { FunctionValue } from './types/function';
import { isUnknown } from './types/unknown';

export class CallManager {
    readonly siteTable: Map<CallExpression, Set<FunctionValue>>;
    readonly rsiteTable: Map<FunctionValue, Set<CallExpression>>;
    // readonly returnValueTable: Map<FunctionValue, ValueSet>;
    // readonly argTable: Map<FunctionValue, Array<ValueSet>>;

    constructor() {
        this.siteTable = new Map();
        this.rsiteTable = new Map();
        // this.returnValueTable = new Map();
        // this.argTable = new Map();
    }

    private saveCallee(node: CallExpression, c: Value): void {
        if (!(c instanceof FunctionValue)) {
            return;
        }
        let set = this.siteTable.get(node);
        if (!set) {
            set = new Set();
            this.siteTable.set(node, set);
        }
        set.add(c);
        let rset = this.rsiteTable.get(c);
        if (!rset) {
            rset = new Set();
            this.rsiteTable.set(c, rset);
        }
        rset.add(node);
    }

    saveCallees(node: CallExpression, callees: Value): void {
        if (isUnknown(callees)) {
            return;
        }
        if (callees instanceof ValueSet) {
            // recurse to handle nested value sets
            callees.forEach(v => this.saveCallees(node, v));
        } else {
            this.saveCallee(node, callees);
        }
    }
}
