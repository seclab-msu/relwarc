import { SinkCall } from '../../../src/analyzer';
import { runSingleTestSinkCall, makeAndRunSimple } from '../utils/utils';

import * as fs from 'fs';

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
    it('test for regression of issue 4404', function () {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/task-4404.js').toString()
        ];

        const analyzer = makeAndRunSimple(scripts, false, 'http://test.com/');

        expect(analyzer.suppressedError).toBeFalse();
    });
});
