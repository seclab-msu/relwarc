import {
    ClassDeclaration, ClassExpression
} from '@babel/types';

type ClassNode = ClassDeclaration | ClassExpression;

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

    constructor(name: string) {
        this.name = name;
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

    constructor() {
        this.classes = [];
    }

    create(node: ClassNode): ClassObject {
        const ident = node.id;
        let name = 'anonymous';

        if (ident && ident.type === 'Identifier') {
            name = ident.name;
        }

        const cls = new Class(name);
        this.classes.push(cls);
        return cls.classObject;
    }
}
