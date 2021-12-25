import { makeAndRunSimple } from '../utils/utils';

describe('Test handling of JS builtins', () => {
    it('bad prop name', () => {
        const src = `
            function f() {
                var x = {
                    toString: badUnknownFunc()
                };

                var y = {a: 123};

                y[x] = 1;

                $test = y;
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const y = analyzer.getGlobalVariable('$test');
        expect(y && y['a']).toEqual(123);
    });
    describe('string methods', () => {
        const makeTestCode = methodTest => `
            function f() {
                var x = '123';

                var y = {
                    toString: 'bad'
                }

                ${methodTest}
            }
        `;
        describe('concat', () => {
            it('does not fail with obj with bad toString', () => {
                const src = makeTestCode('$test = x.concat(y);');
                makeAndRunSimple([src], false);
            });
            it('URLSearchParams', () => {
                const src = makeTestCode(`
                    const z = new URLSearchParams();
                    z.append('x', '1');
                    z.append('y', 'abcd');
                    $test = x.concat(z);
                `);
                const analyzer = makeAndRunSimple([src], false);
                const result = analyzer.getGlobalVariable('$test');
                expect(result as string).toEqual('123x=1&y=abcd');
            });
            it('URL', () => {
                const src = makeTestCode(`
                    const z = new URL('http://test.com/a?b=c');
                    $test = x.concat(z);
                `);
                const analyzer = makeAndRunSimple([src], false);
                const result = analyzer.getGlobalVariable('$test');
                expect(result as unknown).toEqual('123http://test.com/a?b=c');
            });
        });
        it('substring', () => {
            const src = makeTestCode('$test = x.substring(y);');
            makeAndRunSimple([src], false);
        });
        it('replace with bad 1st arg', () => {
            const src = makeTestCode('$test = x.replace(y, "13");');
            makeAndRunSimple([src], false);
        });
        it('replace with bad 2nd arg', () => {
            const src = makeTestCode('$test = x.replace("123", y);');
            makeAndRunSimple([src], false);
        });
    });
    it('toString', () => {
        const src = `
            function f() {
                var x1 = {
                    toString: badUnknownFunc()
                };
                var x2 = 'abcd';

                var z = x1.toString();

                $test = x2.toString();
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const x2 = analyzer.getGlobalVariable('$test');
        expect(x2 as unknown).toEqual('abcd');
    });
    it('Angular HttpRequest', () => {
        const src = `
            var y = {
                toString: 'badThing'
            };


            var z = new HttpRequest(y, '/', {});
        `;
        makeAndRunSimple([src], false);
    });
    describe('URLSearchParams', () => {
        it('append', () => {
            const src = `
                var y = {
                    toString: 'badThing'
                };
                var x = new URLSearchParams();
                x.append('aaa', y);
            `;
            makeAndRunSimple([src], false);
        });
    });
});
