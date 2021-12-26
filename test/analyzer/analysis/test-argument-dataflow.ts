import { makeAndRunSimple } from '../utils/utils';

describe('Test dataflow through arguments', () => {
    describe('from arg to return value', () => {
        it('identity', () => {
            const src = `
                var id = function(x) { return x; }

                function f() {
                    var url = id('/api/base/action.php?param=5');

                    fetch(url);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/api/base/action.php?param=5']
            });
        });
        it('identity arrow', () => { // TODO: save return values for arrow exprs
            const src = `
                var id = x => x;

                function f() {
                    var url = id('/api/base/action.php?param=5');

                    fetch(url);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/api/base/action.php?param=5']
            });
        });
        it('transforming', () => {
            const src = `
                function addPrefix(u) {
                    return '/api/base/' + u;
                }

                function f() {
                    var url = addPrefix('action.php?param=5');

                    fetch(url);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/api/base/action.php?param=5']
            });
        });
    });
    it('setting field of global object', () => {
        const src = `
            var config = {};

            function setupBaseURL(url) {
                config.baseURL = url;
            }

            function setupConfig() {
                setupBaseURL('/api/base/');
            }

            function f() {
                fetch(config.baseURL + 'action.php?param=5');
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/action.php?param=5']
        });
    });
    it('setting field of object passed as argument', () => {
        const src = `
            var config = {};

            function setupBaseURL(cfg, url) {
                cfg.baseURL = url;
            }

            function setupConfig() {
                setupBaseURL(config, '/api/base/');
            }

            function f() {
                fetch(config.baseURL + 'action.php?param=5');
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/action.php?param=5']
        });
    });
});
