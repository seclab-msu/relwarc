type StringPrototype = typeof String.prototype;

type StringMethods = {
    [P in keyof StringPrototype]: StringPrototype[P];
};

function makeStringMethodsSnapshot(): StringMethods {
    const result: Record<string, unknown> = {};

    for (const methodName of Object.getOwnPropertyNames(String.prototype)) {
        if (methodName === 'constructor') {
            continue;
        }
        const method = String.prototype[methodName];

        if (typeof method !== 'function') {
            continue;
        }

        result[methodName] = method;
    }
    return result as StringMethods;
}

export const STRING_METHODS: StringMethods = makeStringMethodsSnapshot();

type RegExpPrototype = typeof RegExp.prototype;

type RegExpPropNames = (keyof RegExpPrototype)[];

function makeRegExpUnsettablePropNamesSnapshot(): RegExpPropNames {
    const result: string[] = [];
    const proto = RegExp.prototype;
    for (const propName of Object.getOwnPropertyNames(proto)) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, propName);
        if (descriptor?.get !== undefined && descriptor.set === undefined) {
            result.push(propName);
        }
    }
    return result as RegExpPropNames;
}

export const REGEXP_UNSETTABLE_PROPS: RegExpPropNames =
    makeRegExpUnsettablePropNamesSnapshot();

export function validateAnalysisPasses(ap: number): void {
    if (ap <= 0 || Math.floor(ap) !== ap) {
        throw new Error(`Invalid number of analysis passes given: ${ap}`);
    }
}
