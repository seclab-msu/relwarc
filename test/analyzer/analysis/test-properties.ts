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
});
