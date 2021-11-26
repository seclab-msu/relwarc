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
