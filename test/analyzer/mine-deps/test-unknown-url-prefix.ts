import { makeAndRunSimple } from '../utils/utils';

describe('Tests to check that analyzer skips urls with unknown prefix', () => {
    it('UNKNOWN', () => {
        const scripts = [
            `function f() {
                let baseURL = getUnknown();
                $.ajax({
                    url: baseURL + '/test/data'
                });
            }`
        ];
        const analyzer = makeAndRunSimple(scripts, true);
        expect(analyzer.hars.length).toBe(0);
    });
    it('&UNKNOWN', () => {
        const scripts = [
            `function f() {
                $.ajax({
                    url: '&' + getArgsUnkn() + '&'
                });
            }`
        ];
        const analyzer = makeAndRunSimple(scripts, true);
        expect(analyzer.hars.length).toBe(0);
    });
    it('undefined', () => {
        const scripts = [
            `function f() {
                let settings = {};
                function g() {
                    $.ajax(settings.baseURL + '/test/data');
                }
                function k() {
                    initSettingsSomehow(settings);
                }
                k();
                g();
            }
                `
        ];
        const analyzer = makeAndRunSimple(scripts, true);
        expect(analyzer.hars.length).toBe(0);
    });
});
