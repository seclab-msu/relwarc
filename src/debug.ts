import type { NodePath } from '@babel/traverse';
import type { CallExpression } from '@babel/types';

import type { CallConfig } from './call-chains';

import { log } from './logging';

let debugFlag = false;

export function debugEnabled(): boolean {
    return debugFlag;
}

export function setDebug(enabled: boolean): void {
    debugFlag = enabled;
}

export function debugFuncLabel(f: NodePath): string {
    const n = f.node;

    if (n.type === 'Program') {
        return '[global]';
    }

    if (n.type === 'FunctionDeclaration') {
        if (!n.id) {
            return '{#! no id}';
        }
        return n.id.name;
    }

    if (n.type === 'ObjectMethod' || n.type === 'ClassMethod') {
        const k = n.key;
        if (k.type === 'Identifier') {
            return '.' + k.name;
        }
        return `[${n.type}]`;
    }

    if (n.type === 'FunctionExpression' && n.id) {
        return n.id.name;
    }

    return `[${n.type}]`;
}

function debugCallSiteLabel(c: CallExpression): string {
    return require('@babel/generator').default(c).code;
}

function formatCallChain(callConfig: CallConfig): string {
    const labels = [debugFuncLabel(callConfig.func)]
        .concat(callConfig.chain.map(el => debugFuncLabel(el.code)));

    return labels.join(' > ');
}

export function logCallChains(all: CallConfig[], current: CallConfig): void {
    if (all.length > 0) {
        log('===> Call chains currently pending:');
        for (const cc of all) {
            console.error(`    * ${formatCallChain(cc)}`);
        }
    }
    log('===> Run call chain: ' + formatCallChain(current));
}

export function logCallStep(site: CallExpression, f: NodePath): void {
    const csLabel = debugCallSiteLabel(site);
    const fLabel = debugFuncLabel(f);
    log(`=> Dive into call: '${csLabel}', func ${fLabel}`);
}
