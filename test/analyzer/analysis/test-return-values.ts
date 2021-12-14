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
    xit('constant from obj method', () => { // TODO
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
});
