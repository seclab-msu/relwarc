import { makeAndRunSimple } from '../utils/utils';

describe('Test handling of JS builtins', () => {
    it('bad prop name', () => {
        const src = `
            function f() {
                var x = {
                    toString: badUnknownFunc()
                };

                var y = {a: 123};

                y[x] = 1;

                $test = y;
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const y = analyzer.getGlobalVariable('$test');
        expect(y && y['a']).toEqual(123);
    });
});
