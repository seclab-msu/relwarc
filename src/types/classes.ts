import {
    FunctionDeclaration, FunctionExpression,
    ClassMethod, ClassPrivateMethod,
    MemberExpression,
    Function as FunctionASTNode,
    Class as ClassNode,
    isClassMethod, isClassPrivateMethod,
    isFunctionDeclaration, isFunctionExpression,
    isMemberExpression, isIdentifier
} from '@babel/types';

import { debugEnabled } from '../debug';

import { Value } from './generic';
import { FunctionValue } from './function';

type VanillaMethod = FunctionExpression | FunctionDeclaration;
type Method = ClassMethod | ClassPrivateMethod | VanillaMethod;
type VanillaClassNode = VanillaMethod; // same for vanilla

function isVanillaClassNode(
    node: FunctionASTNode | ClassNode
): node is VanillaClassNode {
    return isFunctionDeclaration(node) || isFunctionExpression(node);
}

export function isVanillaMethod(node: FunctionASTNode): node is VanillaMethod {
    return isFunctionDeclaration(node) || isFunctionExpression(node);
}

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
    private readonly node2Class: Map<ClassNode | VanillaClassNode, Class>;
    private readonly instance2Class: Map<Instance, Class>;

    constructor() {
        this.classes = [];
        this.method2Class = new Map();
        this.classObject2Class = new Map();
        this.node2Class = new Map();
        this.instance2Class = new Map();
    }

    private static getMethods(node: ClassNode | VanillaClassNode): Method[] {
        const result: Method[] = [];
        if (isVanillaClassNode(node)) {
            // XXX(mirond): here we have access only to ctor of vanilla
            // classes. Other methods we will find at analyzer side.
            result.push(node);
        } else {
            for (const el of node.body.body) {
                if (isClassMethod(el) || isClassPrivateMethod(el)) {
                    result.push(el);
                }
            }
        }
        return result;
    }

    create(node: ClassNode | VanillaClassNode): ClassObject {
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
        this.instance2Class.set(cls.instance, cls);
        return cls.classObject;
    }

    static nodeIsProbablyVanillaPrototypeMethod(
        node: MemberExpression
    ): boolean {
        return isMemberExpression(node.object) &&
            node.object.property &&
            isIdentifier(node.object.property) &&
            node.object.property.name === 'prototype';
    }

    tryToAddVanillaPrototypeMethod(
        clsValue: Value,
        methodValue: Value
    ): void {
        if (
            methodValue instanceof FunctionValue &&
            isVanillaMethod(methodValue.ast) &&
            clsValue instanceof FunctionValue &&
            isVanillaClassNode(clsValue.ast)
        ) {
            this.addMethodForClassNode(clsValue.ast, methodValue.ast);
        }
    }

    getClassInstanceForMethod(m: FunctionASTNode): Instance | null {
        return this.method2Class.get(m)?.instance || null;
    }

    getClassInstanceForClassObject(co: ClassObject): Instance | null {
        return this.classObject2Class.get(co)?.instance || null;
    }

    addMethodForInstance(inst: Instance, m: Method): void {
        const cls = this.instance2Class.get(inst);
        if (typeof cls !== 'undefined') {
            this.method2Class.set(m, cls);
        }
        this.instance2Class.get(inst)?.methods.push(m);
    }

    addMethodForClassNode(
        clsNode: ClassNode | VanillaClassNode,
        method: Method
    ): void {
        const cls = this.node2Class.get(clsNode);
        if (typeof cls === 'undefined') {
            return;
        }
        this.method2Class.set(method, cls);
        cls.methods.push(method);
    }

    containsClass(node: FunctionASTNode): boolean {
        return this.method2Class.has(node);
    }
}
