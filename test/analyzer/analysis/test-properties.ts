import { FunctionValue } from '../../../src/types/function';

import { makeAndRunSimple } from '../utils/utils';

describe('Test working with object properties', () => {
    it('simple', () => {
        const src = `
            var ob = {
                p: 'abcd123'
            };
            function f() {
                fetch('/tst/' + ob.p);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd123']
        });
    });
    it('empty string prop', () => {
        const src = `
            var ob = {
                '': 'abcd123'
            };
            function f() {
                fetch('/tst/' + ob['']);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd123']
        });
    });
    describe('array', () => {
        it('simple', () => {
            const src = `
                var a = ['kek', 'lol', 'abcd123'];
                function f() {
                    fetch('/tst/' + a[2]);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst/abcd123']
            });
        });
        it('zero index', () => {
            const src = `
                var a = ['abcd123'];
                function f() {
                    fetch('/tst/' + a[0]);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst/abcd123']
            });
        });
    });
    describe('computed/non-computed', () => {
        it('non-computed ident', () => {
            const src = `
                $test = {
                    abc: 123
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const ob = analyzer.getGlobalVariable('$test') as unknown;

            expect(ob).toEqual({ abc: 123 });
        });
        it('non-computed string literal', () => {
            const src = `
                $test = {
                    "abc": 123
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const ob = analyzer.getGlobalVariable('$test') as unknown;

            expect(ob).toEqual({ abc: 123 });
        });
        it('non-computed number', () => {
            const src = `
                $test = {
                    999: 123
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const ob = analyzer.getGlobalVariable('$test') as unknown;

            expect(ob).toEqual({ '999': 123 });
        });
        it('non-computed true', () => {
            const src = `
                $test = {
                    true: 123
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const ob = analyzer.getGlobalVariable('$test') as unknown;

            expect(ob).toEqual({ 'true': 123 });
        });
        it('non-computed null', () => {
            const src = `
                $test = {
                    null: 123
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const ob = analyzer.getGlobalVariable('$test') as unknown;

            expect(ob).toEqual({ 'null': 123 });
        });
        it('computed string literal', () => {
            const src = `
                $test = {
                    ["abc"]: 123
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const ob = analyzer.getGlobalVariable('$test') as unknown;

            expect(ob).toEqual({ abc: 123 });
        });
        it('computed ident', () => {
            const src = `
                var x = "abc";
                $test = {
                    [x]: 123
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const ob = analyzer.getGlobalVariable('$test') as unknown;

            expect(ob).toEqual({ abc: 123 });
        });
        it('computed prop with expression', () => {
            const src = `
                var x = "ab";
                var y = "c"
                $test = {
                    [x + y]: 123
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const ob = analyzer.getGlobalVariable('$test') as unknown;

            expect(ob).toEqual({ abc: 123 });
        });
    });
    it('object methods', () => {
        const src = `
            $test = {
                f() {
                    return 1;
                }
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const ob = analyzer.getGlobalVariable('$test') as { f: unknown };

        expect(ob.f).toBeInstanceOf(FunctionValue);
    });
});
