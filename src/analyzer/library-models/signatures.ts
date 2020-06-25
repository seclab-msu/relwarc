import { hasattr } from '../utils/common';

import { default as fetchSignatures } from './fetch/signatures';
import { default as jQuerySignatures } from './jquery/signatures';


interface BaseSinkSignature {
    type: string;
    signature: unknown;
}

export type ObjectSignatureSet = { [obName: string]: string[] };

interface FreeStandingSinkSignature extends BaseSinkSignature {
    type: 'freeStanding';
    signature: string;
}

interface BoundSinkSignature extends BaseSinkSignature {
    type: 'bound' | 'boundToCall';
    signature: ObjectSignatureSet;
}

export type SinkSignature = FreeStandingSinkSignature | BoundSinkSignature;


const signatureList = ([] as SinkSignature[])
    .concat(jQuerySignatures)
    .concat(fetchSignatures);

export const signatures = {
    freeStanding: [] as string[],
    bound: {} as ObjectSignatureSet,
    boundToCall: {} as ObjectSignatureSet
};

for (const sign of signatureList) {
    if (sign.type === 'freeStanding') {
        signatures.freeStanding.push(sign.signature);
    } else if (sign.type === 'bound' || sign.type === 'boundToCall') {
        for (const obName in sign.signature) {
            if (hasattr(sign.signature, obName)) {
                signatures[sign.type][obName] = sign.signature[obName];
            }
        }
    }
}
