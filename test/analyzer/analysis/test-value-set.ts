import { makeAndRunSimple } from '../utils/utils';

describe('Test ValueSet', () => {
    it('basic - if', () => {
        const src = `
        let x;
        if (hui()) {
            x = 5;
        } else {
            x = 8;
        }
        fetch('/test?x=' + x);
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/test?x=5']
        });

        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/test?x=8']
        });
    });
    it('basic - ternary', () => {
        const src = `
        let x = hui() ? 5 : 8;
        fetch('/test?x=' + x);
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/test?x=5']
        });

        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/test?x=8']
        });
    });
    it('if - overwrite', () => {
        const src = `
        let x;
        if (hui()) {
            x = 5;
        } else {
            x = 8;
        }
        x = 9;
        fetch('/test?x=' + x);
        `;

        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toEqual([{
            funcName: 'fetch',
            args: ['/test?x=9']
        }]);
    });
});
