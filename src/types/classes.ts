import {
    ClassDeclaration, ClassExpression, ClassMethod, ClassPrivateMethod,
    Function as FunctionASTNode,
    isClassMethod, isClassPrivateMethod
} from '@babel/types';

type ClassNode = ClassDeclaration | ClassExpression;
type Method = ClassMethod | ClassPrivateMethod;

export class ClassObject {
    readonly name: string;

    static toStringToken = Symbol();

    constructor(name: string) {
        this.name = name;
    }

    toString(tok?: symbol): string {
        if (tok === ClassObject.toStringToken) {
            return `[ClassObject ${this.name}]`;
        }
        return 'UNKNOWN';
    }
}

export class Class {
    readonly classObject: ClassObject;
    readonly name: string;
    readonly instance: Instance;
    readonly methods: Method[];

    constructor(name: string, methods: Method[]) {
        this.name = name;
        this.methods = methods;
        this.classObject = new ClassObject(name);
        this.instance = new Instance(this);
    }
}

export class Instance {
    #class: Class;
    #classObject: ClassObject;

    constructor(cls: Class) {
        this.#class = cls;
        this.#classObject = cls.classObject;
    }
}

export class ClassManager {
    readonly classes: Class[];
    private readonly method2Class: Map<FunctionASTNode, Class>;

    constructor() {
        this.classes = [];
        this.method2Class = new Map();
    }

    private static getMethods(node: ClassNode): Method[] {
        const result: Method[] = [];
        for (const el of node.body.body) {
            if (isClassMethod(el) || isClassPrivateMethod(el)) {
                result.push(el);
            }
        }
        return result;
    }

    create(node: ClassNode): ClassObject {
        const ident = node.id;
        let name = 'anonymous';

        if (ident && ident.type === 'Identifier') {
            name = ident.name;
        }

        const methods = ClassManager.getMethods(node);

        const cls = new Class(name, methods);
        this.classes.push(cls);
        for (const m of methods) {
            this.method2Class.set(m, cls);
        }
        return cls.classObject;
    }

    getClassInstanceForMethod(m: FunctionASTNode): Instance | null {
        return this.method2Class.get(m)?.instance || null;
    }
}
