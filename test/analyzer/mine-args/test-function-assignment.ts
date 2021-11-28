import { SinkCall } from '../../../src/analyzer';
import { runSingleTestSinkCall } from '../utils/utils';

describe('Analyzer finding calls of assigned functions', () => {
    it('function expression', function () {
        const scripts = [
            `
            function f() {
                var g = function(endpoint) {
                    fetch('/api/base/' + endpoint);
                }
                var k = g;
                k('action.do');
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
    describe('arrow function expression', () => {
        it('block body', function () {
            const scripts = [
                `
                function f() {
                    var g = endpoint => {
                        fetch('/api/base/' + endpoint);
                    }
                    var k = g;
                    k('action.do');
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
        it('expression body', function () {
            const scripts = [
                `
                function f() {
                    var g = endpoint => fetch('/api/base/' + endpoint);
                    var k = g;
                    k('action.do');
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
    });
    it('function declaration', function () {
        const scripts = [
            `
            function f() {
                function g(endpoint) {
                    fetch('/api/base/' + endpoint);
                }
                var k = g;
                k('action.do');
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
    it('function declaration with same-named argument', function () {
        const scripts = [
            `
            function f() {
                function g(g, endpoint) {
                    fetch('/api/base/' + endpoint);
                }
                var k = g;
                k(null, 'action.do');
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
});
