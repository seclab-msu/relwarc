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
    it('assign prop', () => {
        const src = `
        let x;
        if (hui()) {
            x = {
                a: 10
            }
        } else {
            x = {
                a: 20
            }
        }
        x.b = 22;
        $.ajax('/test', { data: x });
        `;

        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res.length).toBeGreaterThanOrEqual(2);

        expect(res as object[]).toContain({
            funcName: '$.ajax',
            args: ['/test', {
                data: {
                    a: 10,
                    b: 22
                }
            }]
        });

        expect(res as object[]).toContain({
            funcName: '$.ajax',
            args: ['/test', {
                data: {
                    a: 20,
                    b: 22
                }
            }]
        });
    });
    it('assign prop - overwrite', () => {
        const src = `
        let x;
        if (hui()) {
            x = {
                a: 10
            }
        } else {
            x = {
                a: 20
            }
        }
        x.a = 22;
        $.ajax('/test', { data: x });
        `;

        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res.length).toBeGreaterThanOrEqual(1);

        expect(res as object[]).toContain({
            funcName: '$.ajax',
            args: ['/test', {
                data: {
                    a: 22
                }
            }]
        });
    });
});
