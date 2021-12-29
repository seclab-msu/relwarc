import { ValueSet } from '../../../src/types/value-set';

import { makeAndRunSimple } from '../utils/utils';

describe('Test return value handling', () => {
    it('constant from free standing', () => {
        const src = `
            function f() {
                return 'abcd123';
            }

            function g() {
                fetch('/tst/' + f());
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
    it('constant from obj function', () => {
        const src = `var ob = {
                getBaseURL: function() {
                    return '/api/base/';
                }
            };

            function f() {
                var u = ob.getBaseURL() + 'abcd123';
                fetch(u);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/abcd123']
        });
    });
    it('constant from obj method', () => {
        const src = `var ob = {
                getBaseURL() {
                    return '/api/base/';
                }
            };

            function f() {
                var u = ob.getBaseURL() + 'abcd123';
                fetch(u);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/abcd123']
        });
    });
    it('several return values', () => {
        const src = `
            function getBase() {
                if (window.configManager.isInSpecialEnvironment()) {
                    return '/foo/';
                }
                return '/bar/';
            }

            function f() {
                var u = getBase() + 'action.aspx';
                fetch(u);
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
            args: ['/foo/action.aspx']
        });
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/bar/action.aspx']
        });
    });
    it('retval + arg from call chain', () => {
        const src = `
            function getParams() {
                return 'p1=val&p2=test';
            }

            function sendReq(params) {
                fetch('/api/rpc.php?' + params);
            }

            function f() {
                sendReq(getParams());
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/rpc.php?p1=val&p2=test']
        });
    });
    describe('arrow function', () => {
        it('expr body', () => {
            const src = `
                var f = () => 'testfoobar123';
                function test() {
                    $test = f();
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = ValueSet.produceCombinations(
                analyzer.getGlobalVariable('$test')
            );
            expect(res as unknown[]).toContain('testfoobar123');
        });
        it('expr body without parentheses', () => {
            const src = `
                var f = x => 'testfoobar123';
                function test() {
                    $test = f(1);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = ValueSet.produceCombinations(
                analyzer.getGlobalVariable('$test')
            );
            expect(res as unknown[]).toContain('testfoobar123');
        });
        it('block body', () => {
            const src = `
                var f = () => {
                    return 'testfoobar123';
                }
                function test() {
                    $test = f();
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = ValueSet.produceCombinations(
                analyzer.getGlobalVariable('$test')
            );
            expect(res as unknown[]).toContain('testfoobar123');
        });
    });
    describe('sensitive to args and site', () => {
        it('sensitive to args', () => {
            const src = `
                function f(x) {
                    return '[' + x + ']';
                }
                function test1() {
                    fetch("/test/data?p=" + f("a"));
                }
                function test2() {
                    fetch("/test/data?q=" + f("b"));
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?p=[a]']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?q=[b]']
            });
        });
        it('sensitive to args - identity arrow function', () => {
            const src = `
                const f = x => x;
                function test1() {
                    fetch("/test/data?p=" + f("a"));
                }
                function test2() {
                    fetch("/test/data?q=" + f("b"));
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?p=a']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?q=b']
            });
        });
        it('sensitive to args with depth 2', () => {
            const src = `
                function f(x) {
                    return '[' + x + ']';
                }
                function g(y) {
                    return '_' + f(y);
                }
                function test1() {
                    fetch("/test/data?p=" + g("a"));
                }
                function test2() {
                    fetch("/test/data?q=" + g("b"));
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?p=_[a]']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?q=_[b]']
            });
        });
        it('sensitive to args - method calls', () => {
            const src = `
                class C {
                    constructor() {
                        this.prefix = '__';
                    }
                    m(x) {
                        return this.prefix + x;
                    }
                }
                function test1() {
                    var o = new C();
                    fetch("/test/data?p=" + o.m("a"));
                }
                function test2() {
                    var o = new C();
                    fetch("/test/data?q=" + o.m("b"));
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?p=__a']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?q=__b']
            });
        });
        it('sensitive to site and args', () => {
            const src = `
                var baseURL;
                function f(x) {
                    return baseURL + '/endpoint/' + x;
                }
                function test1() {
                    baseURL = '/api/1.0';
                    var url = f('getdata');
                    fetch(url);
                }
                function test2() {
                    baseURL = '/api/2.0';
                    var url = f('getinfo');
                    fetch(url);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/api/1.0/endpoint/getdata']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/api/2.0/endpoint/getinfo']
            });
        });
        it('multiple possible callees', () => {
            const src = `
                function f(x) {
                    return '[' + x + ']';
                }
                function g(y) {
                    return '_' + y;
                }
                var transformer = somethingUnknown() ? f : g;
                function test1() {
                    fetch("/test/data?p=" + transformer("a"));
                }
                function test2() {
                    fetch("/test/data?q=" + transformer("b"));
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toEqual(4);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?p=_a']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?q=_b']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?p=[a]']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test/data?q=[b]']
            });
        });
    });
});
