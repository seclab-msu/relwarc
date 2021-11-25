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
    describe('object props', () => {
        it('assign', () => {
            const src = `
            let x = hui() ? { a: 10 } : { a: 20 };

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
        it('assign - overwrite', () => {
            const src = `
            let x = hui() ? { a: 10 } : { a: 20 };

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
        it('read', () => {
            const src = `
            let x = hui() ? { a: 10 } : { a: 20 };

            let y = x.a;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=10']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=20']
            });
        });
        it('read prop with name "values"', () => {
            const src = `
            let x = hui() ? { values: 10 } : { values: 20 };

            let y = x.values;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=10']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=20']
            });
        });
        it('read overwritten', () => {
            const src = `
            let x = hui() ? { a: 10 } : { a: 20 };

            x.a = 30;

            let y = x.a;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(1);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=30']
            });
        });
        it('read - one of values is null', () => {
            const src = `
            let x = hui() ? { a: 10 } : null;

            let y = x.a;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=10']
            });
        });
        it('read - one of values is undefined', () => {
            const src = `
            let x = hui() ? { a: 10 } : undefined;

            let y = x.a;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=10']
            });
        });
    });
});
