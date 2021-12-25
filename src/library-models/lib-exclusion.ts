import type { Node as ASTNode } from '@babel/types';

import { libASTSignatures, LibASTSignature } from './signatures';

const signaturesByType: Map<string, LibASTSignature[]> = new Map();
const exclusionCache: Map<ASTNode, boolean> = new Map();

for (const sig of libASTSignatures) {
    if (!sig.excludeFromAnalysis) {
        continue;
    }
    const t = sig.baseNodeType;

    let sigList = signaturesByType.get(t);

    if (!sigList) {
        sigList = [sig];
        signaturesByType.set(t, sigList);
    } else {
        sigList.push(sig);
    }
}

export function checkExclusion(node: ASTNode): boolean {
    const relevantSigs = signaturesByType.get(node.type);

    if (!relevantSigs) {
        return false;
    }

    const cached = exclusionCache.get(node);

    if (typeof cached !== 'undefined') {
        return cached;
    }

    let result = false;

    for (const sig of relevantSigs) {
        if (!sig.excludeFromAnalysis) {
            continue;
        }
        if (sig.matcher(node)) {
            result = true;
            break;
        }
    }
    exclusionCache.set(node, result);
    return result;
}
