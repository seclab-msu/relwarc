import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTestSinkCall } from '../utils/utils';

describe('Analyzer working correctly with scopes', () => {
    it('access argument of outer function', function () {
        const scripts = [
            `
            function main() {
                x = {
                    a: '/api/base/'
                };
                function f(x) {
                    function g(y) {
                        x.a = 'wrong';
                    }
                }
                fetch(x.a + 'action.do');
            }
            `
        ];

        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': ['/api/base/action.do']
            } as SinkCall,
        );
    });
    it('access argument of outer function during var gathering', function () {
        const scripts = [
            `
            x = {
                a: '/api/base/'
            };
            function f(x) {
                function g(y) {
                    x.a = 'wrong';
                }
            }
            fetch(x.a + 'action.do');
            `
        ];

        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': ['/api/base/action.do']
            } as SinkCall,
        );
    });
});
