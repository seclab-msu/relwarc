import { makeAndRunSimple } from '../utils/utils';

describe('Test Arrays', () => {
    it('does not set "length" property to NaN', () => {
        const src = `
        var a = [];
        let x;
        a.length = x + 1;
        $.get('/health-check');
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toContain({
            funcName: '$.get',
            args: ['/health-check']
        });
    });

    it('does not set "length" property to another invalid value', () => {
        const src = `
        let a = {'name': 'value'};
        let b = [1, 2, 3];
        b['le' + 'ngth'] = a;
        $.get('/ya-health-check');
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toContain({
            funcName: '$.get',
            args: ['/ya-health-check']
        });
    });

    it('chooses maximum length from ValueSet', () => {
        const src = `
        var a = [];
        y = 0;
        function f(x) {
            if (x > 3) {
                y = 10;
            } else if (x < 3) {
                y = 15;
            } else {
                y = 5;
            }
            return x;
        }
        a.length = y;
        $.get('/length-check?length=' + a.length);
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toContain({
            funcName: '$.get',
            args: ['/length-check?length=15']
        });
    });
});
