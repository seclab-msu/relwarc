import { makeAndRunSimple } from '../utils/utils';

describe('Test analysis that requires multiple passes', () => {
    it('multiple assignments in functions in reverse order', () => {
        const src = `
            var x, y, z, inital;

            function f() { z = y; }

            function g() { y = x; }

            function k() { x = initial; }

            function l() { initial = 1337; }

            function test() { $test = z; }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.getGlobalVariable('$test') as unknown;

        expect(res).toEqual(1337);
    });
});
