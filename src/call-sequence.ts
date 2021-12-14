import {
    // node types
    Expression, ObjectExpression,
    // node constructors
    identifier, objectExpression, objectProperty, stringLiteral, arrayExpression
} from '@babel/types';

export interface CallSequenceSignatureInfo {
    name: string;
    first: string;
    intermediate: string[];
    final: string;
}

export class CallSequence implements CallSequenceSignatureInfo {
    name: string;
    first: string;
    intermediate: string[];
    final: string;

    constructor(info: CallSequenceSignatureInfo) {
        ({
            name: this.name,
            first: this.first,
            intermediate: this.intermediate,
            final: this.final
        } = info);
    }
}

interface CallSequenceElement {
    name: string;
    args: Expression[];
}

export interface TrackedCallSequence {
    sequence: CallSequence;
    calls: CallSequenceElement[];
}

// this is for hack
export function wrapSeqInObjectExpressions(
    seq: CallSequenceElement[]
): ObjectExpression[] {
    return seq.map((el: CallSequenceElement) => objectExpression([
        objectProperty(
            identifier('name'),
            stringLiteral(el.name),
            false, false, []
        ),
        objectProperty(
            identifier('args'),
            arrayExpression(el.args),
            false, false, []
        )
    ]));
}
