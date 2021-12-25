import { Value } from '../../src/types/generic';
import { ValueSet } from '../../src/types/value-set';
import { setEqual } from './utils/utils';

type ValueReducer = (a: Value, b: Value) => Value;

describe('Test ValueSet', () => {
    it('getValues', () => {
        const TEST_VALUES = [1, 2, 3, 4];
        const vs = new ValueSet(new Set(TEST_VALUES));

        const values = vs.getValues();

        expect(values.length).toEqual(TEST_VALUES.length);

        for (const v of TEST_VALUES) {
            expect(values.includes(v)).toBe(true);
        }
    });
    it('map', () => {
        const TEST_VALUES = [1, 2, 3, 4];
        const vs = new ValueSet(new Set(TEST_VALUES));

        const mapped = vs.map(x => x * 3);
        const values = mapped.getValues();

        expect(values.length).toEqual(TEST_VALUES.length);

        for (const v of TEST_VALUES) {
            expect(values.includes(v * 3)).toBe(true);
        }
    });
    describe('clone', () => {
        it('primitive values', () => {
            const a = new ValueSet([1, 2, 3]);
            const b = a.clone();

            b.add(4);

            const aValues = a.getValues();

            expect(aValues.length).toEqual(3);
            expect(aValues.includes(4)).toBe(false);
        });
        it('structures', () => {
            const a = new ValueSet([
                {
                    x: 1,
                    y: 2
                },
                {
                    z: [1, 2, 3]
                }
            ]);
            const b = a.clone();

            // @ts-ignore
            const bValueWithXY = b.getValues().filter(v => 'x' in v)[0];
            // @ts-ignore
            bValueWithXY.y = 99;

            // @ts-ignore
            const aValueWithXY = a.getValues().filter(v => 'x' in v)[0];
            // @ts-ignore
            expect(aValueWithXY.y).toEqual(2);
        });
    });
    describe('map2', () => {
        const multiply = ((a, b) => a * b) as unknown as ValueReducer;

        it('2 x 2', () => {
            const vs1 = new ValueSet(new Set([2, 3]));
            const vs2 = new ValueSet(new Set([4, 5]));

            const result = ValueSet.map2(vs1, vs2, multiply);

            const values = result.getValues();

            expect(values.length).toEqual(4);
            expect(setEqual(values, [8, 12, 10, 15])).toBe(true);
        });
        it('3 x 4', () => {
            const vs1 = new ValueSet(new Set([3, 4, 5]));
            const vs2 = new ValueSet(new Set([6, 7, 8, 9]));

            const result = ValueSet.map2(vs1, vs2, multiply);

            const values = result.getValues();

            expect(values.length).toEqual(11); // not 12 because 24 appears twice
            expect(setEqual(
                values,
                [
                    18, 21, 24, 27,
                /*24,*/ 28, 32, 36, // eslint-disable-line indent, spaced-comment
                    30, 35, 40, 45
                ]
            )).toBe(true);
        });
        it('3 x 3, operator "-"', () => {
            const vs1 = new ValueSet(new Set([0, 1, 2]));
            const vs2 = new ValueSet(new Set([2, 3, 4]));

            const f = (a, b) => a - b;

            const result = ValueSet.map2(vs1, vs2, f as ValueReducer);

            const values = result.getValues();

            expect(values.length).toEqual(5); // not 9 because -1, -2, -3 repeat
            expect(setEqual(
                values,
                [
                    -2,  -1,  0,     // eslint-disable-line no-multi-spaces, comma-spacing
                    -3,/*-2, -1,*/   // eslint-disable-line no-multi-spaces, comma-spacing, spaced-comment
                    -4,/*-3, -2 */   // eslint-disable-line comma-spacing, spaced-comment, no-multi-spaces
                ]
            )).toBe(true);
        });
        it('ValueSet x number', () => {
            const vs = new ValueSet(new Set([0, 1, 2]));

            expect(setEqual(
                ValueSet.map2(vs, 5, multiply).getValues(),
                [0, 5, 10]
            )).toBe(true);
        });
        it('number x ValueSet', () => {
            const vs = new ValueSet(new Set([10, 20, 30]));

            const f = (a, b) => a + b;

            expect(setEqual(
                ValueSet.map2(2, vs, f as ValueReducer).getValues(),
                [12, 22, 32]
            )).toBe(true);
        });
    });
    describe('produceCombinations', () => {
        it('3 numbers', () => {
            const vs = new ValueSet([1, 2, 3]);
            const combinations = ValueSet.produceCombinations(vs);

            expect(setEqual(combinations, [1, 2, 3])).toBe(true);
        });
        it('two sets in object', () => {
            const ob = {
                x: new ValueSet([1, 2]),
                y: new ValueSet([3, 4])
            };
            const combinations = ValueSet.produceCombinations(ob) as object[];

            expect(combinations.length).toEqual(4);
            expect(combinations).toContain({ x: 1, y: 3 });
            expect(combinations).toContain({ x: 2, y: 3 });
            expect(combinations).toContain({ x: 1, y: 4 });
            expect(combinations).toContain({ x: 1, y: 4 });
        });
        it('nested value sets', () => {
            const vs = new ValueSet([
                {
                    kek: new ValueSet([1, 2])
                },
                {
                    lol: new ValueSet([3, 4])
                }
            ]);
            const combinations = ValueSet.produceCombinations(vs) as object[];

            expect(combinations.length).toEqual(4);
            expect(combinations).toContain({ kek: 1 });
            expect(combinations).toContain({ kek: 2 });
            expect(combinations).toContain({ lol: 3 });
            expect(combinations).toContain({ lol: 4 });
        });
        it('double nested value sets', () => {
            const vs = new ValueSet([
                {
                    kek: new ValueSet([
                        {
                            a: new ValueSet([1, 2]),
                        },
                        {
                            b: new ValueSet([3, 4])
                        }
                    ])
                },
                {
                    lol: new ValueSet([
                        {
                            c: new ValueSet([5, 6])
                        },
                        {
                            d: new ValueSet([7, 8])
                        }
                    ])
                }
            ]);
            const combinations = ValueSet.produceCombinations(vs) as object[];

            expect(combinations.length).toEqual(8);
            expect(combinations).toContain({ kek: { a: 1 } });
            expect(combinations).toContain({ kek: { a: 2 } });
            expect(combinations).toContain({ kek: { b: 3 } });
            expect(combinations).toContain({ kek: { b: 4 } });
            expect(combinations).toContain({ lol: { c: 5 } });
            expect(combinations).toContain({ lol: { c: 6 } });
            expect(combinations).toContain({ lol: { d: 7 } });
            expect(combinations).toContain({ lol: { d: 8 } });
        });
    });
    describe('join', () => {
        it('static join', () => {
            const x = new ValueSet(['a', 'b']);
            const y = new ValueSet(['b', 'c', 'd', 'f']);
            const z = new ValueSet('e');

            const values = ValueSet.join(x, y, z).getValues();

            expect(values.length).toEqual(6);
            expect(setEqual(
                values,
                ['a', 'b', 'c', 'd', 'e', 'f']
            )).toBe(true);
        });
        it('join method', () => {
            const x = new ValueSet(['a', 'b']);
            const y = new ValueSet(['b', 'c', 'd', 'f']);
            const z = new ValueSet('e');

            const values = x.join(y, z).getValues();

            expect(values.length).toEqual(6);
            expect(setEqual(
                values,
                ['a', 'b', 'c', 'd', 'e', 'f']
            )).toBe(true);
        });
    });
});
