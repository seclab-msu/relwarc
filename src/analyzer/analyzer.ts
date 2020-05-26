const system = require('system');

import * as babel from 'analyzer/vendor/babel';

import {
    UNKNOWN,
    UNKNOWN_FUNCTION,
    UNKNOWN_FROM_FUNCTION,
    isUnknown
} from 'analyzer/unknownvalues';

import {FROM_ARG, extractFormalArgs} from 'analyzer/formalarg';

import { makeHAR } from 'analyzer/make-hars';

declare const Debugger: any;
require('analyzer/debugger').addDebuggerToGlobal(this);

type ASTNode = any;

const MAX_CALL_CHAIN = 5;

const FUNCTION_DECLARATIONS = [
    'ArrowFunctionExpression',
    'FunctionDeclaration',
    'FunctionExpression'
]

const jQueryAjaxFunctions = [
    'ajax',
    'get',
    'post',
    'load',
    'getJSON',
    'getScript'
];

const signatures = {
    freeStanding: ['fetch', '$http', 'axios'],
    bound: {
        'window': ['fetch'],
        'this': ['fetch'],
        '$': jQueryAjaxFunctions,
        'jQuery': jQueryAjaxFunctions,
        '$http': ['get', 'post', 'put', 'jsonp'],
        'axios': ['get', 'post', 'put']
    }
};

type VarScope = {[varName: string]: any; };

interface FunctionDescription {
    type: string;
    args: string[];
    code: ASTNode;
    name?: string | null;
}

interface CallQueueElem {
    func: FunctionDescription;
    chain: FunctionDescription[];
}

export class Analyzer {
    readonly parsedScripts: ASTNode[];
    readonly results: any[];
    readonly scripts: Set<string>;
    readonly hars: any[];

    private readonly globalDefinitions: VarScope;
    private readonly argsStack: string[];
    private readonly formalArgValues: VarScope;
    private readonly topLevelFunctions: FunctionDescription[];
    private readonly callQueue: CallQueueElem[];

    private functionName: string | null;
    private callChain: FunctionDescription[];
    private callChainPosition: number;
    private originalCallee: FunctionDescription | null;
    private localsStack: VarScope[];
    private formalArgs: string[];
    private currentBody: ASTNode | null;


    constructor() {
        this.parsedScripts = [];
        this.results = [];
        this.scripts = new Set();

        this.globalDefinitions = { undefined };
        this.localsStack = [];
        this.argsStack = [];
        this.formalArgs = [];
        this.formalArgValues = {};

        this.topLevelFunctions = [];
        this.functionName = null;
        this.callQueue = [];
        this.callChain = [];
        this.callChainPosition = 0;
        this.originalCallee = null;

        this.hars = [];
    }
    attachDebugger(win: object): void {
        const dbg = new Debugger(win);

        dbg.onNewScript = (script: any): void => {
            const text: string = script.source.text;

            if (this.scripts.has(text)) {
                return;
            }
            this.scripts.add(text);
        }
    }
    extractGlobalDefinitions(ast: ASTNode) {
        babel.traverse(ast, {
            enter: (path) => {
                const node = path.node;
                if (~FUNCTION_DECLARATIONS.indexOf(node.type)) {
                    path.skip();
                    return;
                }
                if (node.type === 'ForStatement') {
                    path.skip();
                    return;
                }
            },
            exit: (path) => {
                const node = path.node;
                if (node.type === 'VariableDeclarator' && node.init) {
                    this.globalDefinitions[node.id.name] = this.valueFromASTNode(node.init);
                }
                if (node.type === 'AssignmentExpression' && node.left.type === 'Identifier') {
                    this.globalDefinitions[node.left.name] = this.valueFromASTNode(node.right);
                }
            }
        });
    }

    processFunctionCall(node: ASTNode) {
        const callee = node.callee;
        const encoders = {escape, encodeURIComponent, encodeURI};


        if (callee.type === 'Identifier') {
            if (encoders.hasOwnProperty(callee.name)) {
                const argValue = this.valueFromASTNode(node.arguments[0]);

                if (isUnknown(argValue)) {
                    return argValue;
                }

                if (typeof argValue === 'string') {
                    return encoders[callee.name](argValue);
                }
                return argValue;
            }
        }

        if (callee.type === 'MemberExpression') {
            const ob = callee.object;
            const prop = callee.property;

            if (ob.type === 'Identifier' && prop.type === 'Identifier') {
                if (ob.name === 'JSON' && prop.name === 'stringify') {
                    return JSON.stringify(this.valueFromASTNode(node.arguments[0]));
                }
                if (ob.name === 'Math' && prop.name === 'random') {
                    return 0.8782736846632295;
                }
            }
        }

        return UNKNOWN_FROM_FUNCTION;
    }

    processNewExpression(node: ASTNode) {
        const callee = node.callee;

        if (callee.type === 'Identifier' && callee.name === 'Headers') {
            return this.valueFromASTNode(node.arguments[0]);
        }
        return UNKNOWN_FROM_FUNCTION;
    }

    processBinaryExpression(node: ASTNode) {
        if (node.operator === '+') {
            //console.log('binary: ' + this.valueFromASTNode(node.left) + ' ' + this.valueFromASTNode(node.right));
            return this.valueFromASTNode(node.left) + this.valueFromASTNode(node.right);
        }
        return UNKNOWN;
    }

    getVariable(name: string) {
        if (this.localsStack.length > 0) {
            for (let i = this.localsStack.length - 1; i >= 0; i--) {
                let scope = this.localsStack[i];
                if (scope.hasOwnProperty(name)) {
                    return scope[name];
                }
            }
        }
        if (~this.formalArgs.indexOf(name)) {
            if (this.formalArgValues.hasOwnProperty(name)) {
                return this.formalArgValues[name];
            }
            return FROM_ARG;
        }
        if (this.globalDefinitions.hasOwnProperty(name)) {
            return this.globalDefinitions[name];
        }
        return UNKNOWN;
    }

    processMemberExpression(node) {
        const ob = this.valueFromASTNode(node.object);
        if (!ob || isUnknown(ob)) {
            return UNKNOWN;
        }
        if (!node.computed) {
            return ob[node.property.name];
        }
        let propName = this.valueFromASTNode(node.property);
        if (!propName || isUnknown(propName)) {
            return UNKNOWN;
        }
        return ob[propName];
    }

    valueFromASTNode(node) {
        if (node.type.endsWith('Literal')) {
            return node.value;
        }
        if (node.type === 'Identifier') {
            return this.getVariable(node.name);
        }
        if (node.type === 'ObjectExpression') {
            const result = {};
            for (let prop of node.properties) {
                let key;

                if (prop.key.type === 'Identifier') {
                    key = prop.key.name;
                } else if (prop.key.type.endsWith('Literal')) {
                    key = prop.key.value
                } else {
                    return UNKNOWN;
                }
                result[key] = this.valueFromASTNode(prop.value);
            }
            return result;
        }

        if (node.type === 'ArrayExpression') {
            return node.elements.map(elem => elem !== null ? this.valueFromASTNode(elem) : undefined);
        }

        if (node.type === 'CallExpression') {
            return this.processFunctionCall(node);
        }

        if (node.type === 'NewExpression') {
            return this.processNewExpression(node);
        }

        if (node.type === 'BinaryExpression') {
            return this.processBinaryExpression(node);
        }

        if (node.type === 'MemberExpression') {
            return this.processMemberExpression(node);
        }

        if (~node.type.indexOf('Function')) {
            return UNKNOWN_FUNCTION;
        }
        return UNKNOWN;
    }

    findCallers(calleeName): FunctionDescription[] {
        const result: FunctionDescription[] = [];

        for (let ast of this.parsedScripts) {
            babel.traverse(ast, {
                enter: (path) => {
                    const node = path.node;
                    if (~FUNCTION_DECLARATIONS.indexOf(node.type)) {
                        path.skip();
                        return;
                    }
                    if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === calleeName) {
                        result.push({
                            type: 'GLOBAL',
                            code: ast,
                            args: []
                        });
                        path.stop();
                        return;
                    }
                }
            });

        }

        class StopTraversal extends Error {}

        for (let f of this.topLevelFunctions) {
            try {
                babel.traverse.cheap(f.code, (node) => {
                    if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === calleeName) {
                        result.push(f);
                        throw new StopTraversal();
                    }
                });
            } catch (err) {
                if (!(err instanceof StopTraversal)) {
                    throw err;
                }
            }
        }
        return result;
    }

    extractDEPFromArgs(funcName, args) {
        let argsDependOnFormalArg = false;

        this.results.push([
            funcName,
            args.map(arg => {
                let v = this.valueFromASTNode(arg),
                    haveFormalArg;
                [v, haveFormalArg] = extractFormalArgs(v);
                if (haveFormalArg) {
                    argsDependOnFormalArg = true;
                }
                return v;
            })
        ]);
        if (argsDependOnFormalArg && this.originalCallee) {
            for (let caller of this.findCallers(this.originalCallee.name)) {
                let chain = [this.originalCallee].concat(this.callChain);
                if (chain.length + 1 > MAX_CALL_CHAIN) {
                    return;
                }
                this.callQueue.push({func: caller, chain});
            }
        }
    }

    setArgValues(actualArgs, formalArgs) {
        for (let i = 0; i < formalArgs.length; i++) {
            if (i >= actualArgs.length) {
                break;
            }
            this.formalArgValues[formalArgs[i]] = this.valueFromASTNode(actualArgs[i]);
        }
    }

    proceedAlongCallChain(node) {
        const f = this.callChain[this.callChainPosition];
        this.setArgValues(node.arguments, f.args);
        this.callChainPosition++;
        this.extractDEPs(f.code, f);
        this.callChainPosition--;
    }

    extractDEPs(ast, funcInfo) {
        if (funcInfo) {
            this.localsStack = [{}];
            this.formalArgs = funcInfo.args;
            this.functionName = funcInfo.name;
            this.currentBody = ast;
        } else {
            this.localsStack = [];
            this.formalArgs = [];
            this.functionName = null;
            this.currentBody = null;
        }
        if (funcInfo !== null && ast.type === 'BlockStatement') {
            ast = {
                type: 'File',
                program: {
                    'type': 'Program',
                    'body': ast,
                    'sourceType': 'script'
                }
            };
        }
        babel.traverse(ast, {
            enter: (path) => {
                const node = path.node;
                if (~FUNCTION_DECLARATIONS.indexOf(node.type)) {
                    if (!funcInfo) {
                        path.skip();
                        return;
                    }
                    this.localsStack.push({});
                    this.argsStack.push(node.params.map(param => param.name));
                }

                if (node.type === 'VariableDeclarator' && node.init) {
                    if (this.localsStack.length > 0) {
                        //console.log('add var ' + node.id.name + ' ' + JSON.stringify(node.init));
                        this.localsStack[this.localsStack.length - 1][node.id.name] = this.valueFromASTNode(node.init);
                    }
                }

                if (node.type !== 'CallExpression') {
                    return;
                }

                const callee = node.callee;

                if (this.callChain.length > 0 && this.callChainPosition < this.callChain.length && this.callChain[this.callChainPosition].name === callee.name) {
                    this.proceedAlongCallChain(node);
                }

                if (callee.type === 'Identifier') {
                    if (~signatures.freeStanding.indexOf(callee.name)) {
                        this.extractDEPFromArgs(callee.name, node.arguments);
                    }
                    return;
                }

                if (callee.type !== 'MemberExpression') {
                    return;
                }

                const prop = callee.property;
                const ob = callee.object;

                if (prop.type !== 'Identifier') {
                    return;
                }

                let obName;

                if (ob.type === 'Identifier') {
                    obName = ob.name;
                } else if (ob.type === 'MemberExpression' && ob.property.type === 'Identifier') {
                    // handle case a.b.x.$http.post(...)
                    obName = ob.property.name;
                } else {
                    return;
                }

                if (
                    !signatures.bound.hasOwnProperty(obName) ||
                    !~(signatures.bound[obName].indexOf(prop.name))
                ) {
                    return;
                }
                this.extractDEPFromArgs(obName + '.' + prop.name, node.arguments);
            },
            exit: (path) => {
                if (~FUNCTION_DECLARATIONS.indexOf(path.node.type)) {
                    this.localsStack.pop();
                    this.argsStack.pop();
                }
            }
        });

    }

    gatherTopLevelFunctions(ast) {
        babel.traverse(ast, {
            enter: (path) => {
                const node = path.node;
                if (!~FUNCTION_DECLARATIONS.indexOf(node.type)) {
                    return;
                }
                let name = null;
                if (node.type === 'FunctionDeclaration' && node.id.type === 'Identifier') {
                    name = node.id.name;
                }
                this.topLevelFunctions.push({
                    type: 'function',
                    name,
                    args: node.params.map(param => param.name),
                    code: node.body
                });
                path.skip();
                return;
            }
        });
    }

    extractDEPsWithCallChain(callConfig) {
        this.callChain = callConfig.chain;
        this.callChainPosition = 0;

        if (callConfig.hasOwnProperty('type') && callConfig.func.type === 'GLOBAL') {
            throw new Error('not supported yet');
        }

        this.originalCallee = callConfig.func;
        this.extractDEPs(callConfig.func.code, callConfig.func);
    }

    analyze(url: string) {
        for (const script of this.scripts) {
            try {
                this.parsedScripts.push(babel.parser.parse(script));
            } catch (err) {
                system.stderr.write('Script parsing error: ' + err + '\n');
            }
        }

        for (let ast of this.parsedScripts) {
            this.extractGlobalDefinitions(ast);
        }

        //console.log('globals: ' + JSON.stringify(this.globalDefinitions));

        for (let ast of this.parsedScripts) {
            this.gatherTopLevelFunctions(ast);
        }

        for (let ast of this.parsedScripts) {
            this.extractDEPs(ast, null);
        }
        for (let f of this.topLevelFunctions) {
            this.originalCallee = f;
            this.extractDEPs(f.code, f);
        }

        while (this.callQueue.length > 0) {
            let callConfig = this.callQueue.shift();

            this.extractDEPsWithCallChain(callConfig);
        }

        for (const result of this.results) {
            const har = makeHAR(result[0], result[1], url);

            if (har === null) {
                continue;
            }

            this.hars.push(har);
        }
    }
}