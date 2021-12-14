import { makeAndRunSimple } from '../utils/utils';
import { REGEXP_UNSETTABLE_PROPS } from '../../../src/utils/analyzer';

describe('Test RegExp object processing', () => {
    it('ignores unsettable property setting', () => {
        const prop =
            REGEXP_UNSETTABLE_PROPS[
                Math.floor(Math.random() * REGEXP_UNSETTABLE_PROPS.length)
            ];
        const src = `
        var re = /a/;
        re.${String(prop)} = '';
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

    it('ignores legal unsettable property setting', () => {
        const prop =
            REGEXP_UNSETTABLE_PROPS[
                Math.floor(Math.random() * REGEXP_UNSETTABLE_PROPS.length)
            ];
        const src = `
        var re = /a/;
        if (2 * 2 === 4) {
            re = {};
            re.${String(prop)} = '';
        }
        $.get('/if-health-check');
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toContain({
            funcName: '$.get',
            args: ['/if-health-check']
        });
    });
});
