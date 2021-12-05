import { makeAndRunSimple } from '../utils/utils';

describe('Test ability to find functions to build call chains', () => {
    it('object field', () => {
        const src = `
            function f() {
                var ob = {};
                var g = function(x) {
                    fetch('/tst/' + x);
                }
                ob.f1 = g;
                ob.f1('abcd123');
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
    it('object field in literal', () => {
        const src = `
            function f() {
                var ob = {
                    f1: function(x) {
                        fetch('/tst/' + x);
                    }
                };
                ob.f1('abcd123');
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
    xit('object literal shorthand method', () => { // TODO
        const src = `
            function f() {
                var ob = {
                    f1(x) {
                        fetch('/tst/' + x);
                    }
                };
                ob.f1('abcd123');
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
    it('several functions', () => {
        const src = `
            function g(a) {
                fetch('/tst/' + a);
            }
            var ob1 = {
                method1: function(b) {
                    g('abc/' + b);
                },
                method2: function(c) {
                    ob1.method1('def/' + c)
                }
            }
            function f() {
                var ob2 = {
                    m: function(e) {
                        ob1.method2('123/' + e)
                    }
                };
                ob2.m('456');
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abc/def/123/456']
        });
    });
});
