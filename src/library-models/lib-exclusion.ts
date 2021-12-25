import type { Node as ASTNode } from '@babel/types';

import { libASTSignatures, LibASTSignature } from './signatures';

const signaturesByType: Map<string, LibASTSignature[]> = new Map();
const exclusionCache: Map<ASTNode, string | null> = new Map();

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

export function checkExclusion(node: ASTNode): string | null {
    const relevantSigs = signaturesByType.get(node.type);

    if (!relevantSigs) {
        return null;
    }

    const cached = exclusionCache.get(node);

    if (typeof cached !== 'undefined') {
        return cached;
    }

    let result: string | null = null;

    for (const sig of relevantSigs) {
        if (!sig.excludeFromAnalysis) {
            continue;
        }
        if (sig.matcher(node)) {
            result = sig.name;
            break;
        }
    }
    exclusionCache.set(node, result);
    return result;
}
