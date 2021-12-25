import {
    binaryExpression,
    identifier,
    numericLiteral,
    sequenceExpression
} from '@babel/types';

import { simpletraverse, TraverseCommand } from '../../src/utils/ast';

import { setEqual } from './utils/utils';


describe('Test simpletraverse function', () => {
    it('no limit', () => {
        const n = binaryExpression(
            '+',
            binaryExpression('*', identifier('k'), identifier('k')),
            numericLiteral(5)
        );
        const seenTypes: string[] = [];

        simpletraverse(n, node => {
            seenTypes.push(node.type);
        });

        expect(seenTypes.length).toEqual(5);

        expect(seenTypes[0]).toEqual('BinaryExpression');
        expect(setEqual(
            seenTypes.slice(1),
            ['BinaryExpression', 'Identifier', 'NumericLiteral']
        )).toBe(true);
    });
    describe('with limit', () => {
        const n = binaryExpression(
            '+',
            binaryExpression('*', identifier('k'), identifier('k')),
            numericLiteral(5)
        );
        it('1', () => {
            const seenTypes: string[] = [];

            simpletraverse(n, node => {
                seenTypes.push(node.type);
            }, 1);

            expect(seenTypes.length).toEqual(1);

            expect(seenTypes[0]).toEqual('BinaryExpression');
        });
        it('2', () => {
            const seenTypes: string[] = [];

            simpletraverse(n, node => {
                seenTypes.push(node.type);
            }, 2);

            expect(seenTypes.length).toEqual(3);

            expect(seenTypes[0]).toEqual('BinaryExpression');
            expect(setEqual(
                seenTypes.slice(1),
                ['BinaryExpression', 'NumericLiteral']
            )).toBe(true);
        });
    });
    describe('break and skip', () => {
        const n = sequenceExpression([
            binaryExpression('+', identifier('a'), identifier('b')),
            binaryExpression('+', numericLiteral(5), numericLiteral(6)),
            binaryExpression('*', identifier('x'), identifier('y')),
        ]);
        it('skip', () => {
            const seenTypes: string[] = [];
            simpletraverse(n, node => {
                seenTypes.push(node.type);
                if (node.type === 'BinaryExpression') {
                    if (
                        node.left.type === 'NumericLiteral' &&
                        node.left.value === 5 &&
                        node.right.type === 'NumericLiteral' &&
                        node.right.value === 6
                    ) {
                        return TraverseCommand.Skip;
                    }
                }
            });
            expect(seenTypes.length).toEqual(8);
            expect(seenTypes[0]).toEqual('SequenceExpression');
            expect(setEqual(
                seenTypes.slice(1),
                ['BinaryExpression', 'Identifier']
            )).toBe(true);
        });
        it('break', () => {
            const seenTypes: string[] = [];
            simpletraverse(n, node => {
                seenTypes.push(node.type);
                if (node.type === 'BinaryExpression') {
                    if (
                        node.left.type === 'NumericLiteral' &&
                        node.left.value === 5 &&
                        node.right.type === 'NumericLiteral' &&
                        node.right.value === 6
                    ) {
                        return TraverseCommand.Break;
                    }
                }
            });
            expect(seenTypes.length).toEqual(5);
            expect(seenTypes[0]).toEqual('SequenceExpression');
            expect(setEqual(
                seenTypes.slice(1),
                ['BinaryExpression', 'Identifier']
            )).toBe(true);
        });
    });
});
