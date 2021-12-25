import { Node as ASTNode, Identifier } from '@babel/types';

import { hasattr } from '../utils/common';
import { CallSequenceSignatureInfo, CallSequence } from '../call-sequence';
import type { Class } from '../types/classes';

import { ClassASTSignatureSet, matchClassASTSignature } from './ast-signatures';
import { LibClass } from '../types/lib-objects';

import fetchSignatures from './fetch/signatures';
import jQuerySignatures from './jquery/signatures';
import angularSignatures from './angular/signatures';
import axiosSignatures from './axios/signatures';
import xmlHttpRequestSignatures from './xmlhttprequest/signatures';


interface BaseSinkSignature {
    type: string;
    signature: unknown;
}

type ObjectSignatureSet = { [obName: string]: string[] };

interface FreeStandingSinkSignature extends BaseSinkSignature {
    type: 'freeStanding';
    signature: string;
}

interface BoundSinkSignature extends BaseSinkSignature {
    type: 'bound' | 'boundToCall';
    signature: ObjectSignatureSet;
}

interface CallSequenceSinkSignature extends BaseSinkSignature {
    type: 'callSequence';
    signature: CallSequenceSignatureInfo;
}

export interface LibASTSignature {
    type: 'libAST';
    name: string;
    baseNodeType: string;
    matcher: (node: ASTNode) => boolean;
    excludeFromAnalysis: boolean;
}

interface ClassASTSinkSignature extends BaseSinkSignature {
    type: 'classAST';
    signature: ClassASTSignatureSet;
}

export type SinkSignature =
    | FreeStandingSinkSignature
    | BoundSinkSignature
    | CallSequenceSinkSignature
    | ClassASTSinkSignature;

export type Signature =
    | SinkSignature
    | LibASTSignature;

const signatureList = ([] as Signature[])
    .concat(jQuerySignatures)
    .concat(angularSignatures)
    .concat(fetchSignatures)
    .concat(xmlHttpRequestSignatures)
    .concat(axiosSignatures);

const signatures = {
    freeStanding: [] as string[],
    bound: {} as ObjectSignatureSet,
    boundToCall: {} as ObjectSignatureSet,
    callSequence: {} as Record<string, CallSequenceSignatureInfo>,
    cls: [] as ClassASTSignatureSet[]
};

export const libASTSignatures: LibASTSignature[] = [];

export const callSequenceMethodNames: Set<string> = new Set();

for (const sign of signatureList) {
    if (sign.type === 'freeStanding') {
        signatures.freeStanding.push(sign.signature);
    } else if (sign.type === 'bound' || sign.type === 'boundToCall') {
        for (const obName in sign.signature) {
            if (hasattr(sign.signature, obName)) {
                signatures[sign.type][obName] = sign.signature[obName];
            }
        }
    } else if (sign.type === 'callSequence') {
        signatures.callSequence[sign.signature.first] = sign.signature;
        callSequenceMethodNames.add(sign.signature.final);
        for (const interm of sign.signature.intermediate) {
            callSequenceMethodNames.add(interm);
        }
    } else if (sign.type === 'libAST') {
        libASTSignatures.push(sign);
    } else if (sign.type === 'classAST') {
        signatures.cls.push(sign.signature);
    }
}

export function matchFreeStandingCallSignature(funcName: string): boolean {
    return signatures.freeStanding.includes(funcName);
}

export function matchMethodCallSignature(
    ob: ASTNode,
    prop: Identifier
): string | CallSequence | null {
    if (hasattr(signatures.callSequence, prop.name)) {
        return new CallSequence(signatures.callSequence[prop.name]);
    }

    let obName: string,
        objectIsCall = false;

    if (ob.type === 'Identifier') {
        obName = ob.name;
    } else if (
        ob.type === 'MemberExpression' &&
        ob.property.type === 'Identifier'
    ) {
        // handle case a.b.x.$http.post(...)
        obName = ob.property.name;
    } else if (
        ob.type === 'CallExpression' &&
        ob.callee.type === 'Identifier'
    ) {
        // handle case $(...).load(...)
        obName = ob.callee.name;
        objectIsCall = true;
    } else {
        return null;
    }

    let obSignatures: ObjectSignatureSet;

    if (!objectIsCall) {
        obSignatures = signatures.bound;
    } else {
        obSignatures = signatures.boundToCall;
    }

    if (!hasattr(obSignatures, obName)) {
        return null;
    }

    if (obSignatures[obName].includes(prop.name)) {
        return obName;
    }
    return null;
}

export function checkForLibraryClass(cls: Class): LibClass | null {
    for (const sig of signatures.cls) {
        const result = matchClassASTSignature(sig, cls);
        if (result) {
            return new LibClass(result[0], result[1]);
        }
    }
    return null;
}
