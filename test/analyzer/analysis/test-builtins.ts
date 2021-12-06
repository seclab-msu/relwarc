import { makeAndRunSimple } from '../utils/utils';

describe('Test handling of JS builtins', () => {
    // TODO: escape, encodeURIComponent, encodeURI
    for (const testedFunc of ['parseInt', 'parseFloat']) {
        describe(testedFunc, () => {
            it('simple', () => {
                const src = `
                    function f() {
                        var n = '5';

                        fetch('/api/data?p=' + ${testedFunc}(n));
                    }
                `;
                const analyzer = makeAndRunSimple([src], false);
                const res = analyzer.results.map(el => ({
                    funcName: el.funcName,
                    args: el.args
                }));
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=5']
                });
            });
            it('preserves integer', () => {
                const src = `
                    function f() {
                        var n = 5;

                        fetch('/api/data?p=' + ${testedFunc}(n));
                    }
                `;
                const analyzer = makeAndRunSimple([src], false);
                const res = analyzer.results.map(el => ({
                    funcName: el.funcName,
                    args: el.args
                }));
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=5']
                });
            });
            it('preserves FROM_ARG', () => {
                const src = `
                    function f(x) {
                        fetch('/api/data?p=' + ${testedFunc}(x));
                    }
                    function g() {
                        f('5');
                    }
                `;
                const analyzer = makeAndRunSimple([src], false);
                const res = analyzer.results.map(el => ({
                    funcName: el.funcName,
                    args: el.args
                }));
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=5']
                });
            });
            it('works with value sets', () => {
                const src = `
                    function f(flg) {
                        var x = flg ? '10' : '20';
                        fetch('/api/data?p=' + ${testedFunc}(x));
                    }
                `;
                const analyzer = makeAndRunSimple([src], false);
                const res = analyzer.results.map(el => ({
                    funcName: el.funcName,
                    args: el.args
                }));
                expect(res.length).toBeGreaterThanOrEqual(2);
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=10']
                });
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=20']
                });
            });
            it('works with value sets and args', () => {
                const src = `
                    function f(x) {
                        var y = unknownFn() ? '10' : x;
                        fetch('/api/data?p=' + ${testedFunc}(y));
                    }
                    function g() {
                        f('20');
                    }
                `;
                const analyzer = makeAndRunSimple([src], false);
                const res = analyzer.results.map(el => ({
                    funcName: el.funcName,
                    args: el.args
                }));
                expect(res.length).toBeGreaterThanOrEqual(2);
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=10']
                });
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=20']
                });
            });
            it('works with value sets and args - larger set', () => {
                const src = `
                    function f(x) {
                        var y = unknownFn() ? '10': '50';
                        var z = unknownFn2() ? y : x;
                        fetch('/api/data?p=' + ${testedFunc}(z));
                    }
                    function g() {
                        f('20');
                    }
                `;
                const analyzer = makeAndRunSimple([src], false);
                const res = analyzer.results.map(el => ({
                    funcName: el.funcName,
                    args: el.args
                }));
                expect(res.length).toBeGreaterThanOrEqual(2);
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=10']
                });
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=20']
                });
                expect(res as object[]).toContain({
                    funcName: 'fetch',
                    args: ['/api/data?p=50']
                });
            });
        });
    }
    it('parseInt radix', () => {
        const src = `
            function f() {
                var n = '77';

                fetch('/api/data?p=' + parseInt(n, 8));
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/data?p=63']
        });
    });
    it('parseFloat with float argument string', () => {
        const src = `
            function f() {
                var x = '3.14';

                fetch('/api/data?p=' + parseFloat(x));
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/data?p=3.14']
        });
    });
    it('parseFloat preserves float number', () => {
        const src = `
            function f() {
                var x = 3.14;

                fetch('/api/data?p=' + parseFloat(x));
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/data?p=3.14']
        });
    });

    // TODO: parse float
    describe('toString', () => {
        it('number', () => {
            const src = `
                function f() {
                    var n = 5;

                    fetch('/api/data?p=' + n.toString());
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/api/data?p=5']
            });
        });
        it('preserves FROM_ARG', () => {
            const src = `
                function f(x) {
                    fetch('/api/data' + x.toString());
                }
                function g() {
                    f('?p=5');
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/api/data?p=5']
            });
        });
    });
});
