import { makeAndRunSimple } from '../utils/utils';

describe('Tests string operators', () => {
    it('operator += does not grow strings of "UNKNOWN"s', function () {
        const scripts = [
            `
            var v = getSomeVal();
            function f(x) {
                if (someCondition()) {
                    v += v;
                }
                if (otherCond()) {
                    v += v;
                }
                fetch('/data/args/va?l=' + v)
            }
            function g(y) {
                f(y);
            }
            `
        ];
        const analyzer = makeAndRunSimple(scripts, false);

        const result = analyzer.results[0];

        const uri = result.args[0];

        if (typeof uri === 'string') {
            expect(uri.length).toBeLessThan(25);
        } else {
            fail('URI is unexpectedly not a string');
        }
    });
});
