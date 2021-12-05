import {
    ClassDeclaration, ClassExpression, ClassMethod, ClassPrivateMethod,
    Function as FunctionASTNode,
    isClassMethod, isClassPrivateMethod
} from '@babel/types';

import { debugEnabled } from '../debug';

type ClassNode = ClassDeclaration | ClassExpression;
type Method = ClassMethod | ClassPrivateMethod;

export class ClassObject {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    toString(): string {
        if (debugEnabled()) {
            return `[ClassObject ${this.name}]`;
        }
        return 'UNKNOWN';
    }

    toJSON(): string {
        if (debugEnabled()) {
            return this.toString();
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

    toString(): string {
        if (debugEnabled()) {
            return `<instance of ${this.#classObject.toString()}>`;
        }
        return 'UNKNOWN';
    }
    toJSON(): string {
        if (debugEnabled()) {
            return this.toString();
        }
        return 'UNKNOWN';
    }
}

export class ClassManager {
    readonly classes: Class[];
    private readonly method2Class: Map<FunctionASTNode, Class>;
    private readonly classObject2Class: Map<ClassObject, Class>;
    private readonly node2Class: Map<ClassNode, Class>;

    constructor() {
        this.classes = [];
        this.method2Class = new Map();
        this.classObject2Class = new Map();
        this.node2Class = new Map();
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
        if (this.node2Class.has(node)) {
            return (this.node2Class.get(node) as Class).classObject;
        }
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
        this.classObject2Class.set(cls.classObject, cls);
        this.node2Class.set(node, cls);
        return cls.classObject;
    }

    getClassInstanceForMethod(m: FunctionASTNode): Instance | null {
        return this.method2Class.get(m)?.instance || null;
    }

    getClassInstanceForClassObject(co: ClassObject): Instance | null {
        return this.classObject2Class.get(co)?.instance || null;
    }
}
