import type { Value } from './generic';

type GlobalVars = { [key: string]: Value };

const GLOBAL_VARIABLES = ['window', 'document', 'location', 'undefined'];

export class Memory extends WeakMap {
    private _globalVars: GlobalVars;

    constructor(iterable?) {
        super(iterable);
        this._globalVars = {};
    }
    set(k, v) {
        if (GLOBAL_VARIABLES.includes(k.identifier.name) && k.scope.block.type === 'Program') {
            if (this.has(k)) {
                return this;
            }
            this._globalVars[k.identifier.name] = v;
        }
        return super.set(k, v);
    }

    get globalVars() {
        return this._globalVars;
    }
}

export class GlobalWindowObject {
    toString(): string {
        return '[object Window]';
    }
    toJSON(): string {
        return this.toString();
    }
}
