import { Analyzer, SinkCall } from '../../../src/analyzer';
import { runSingleTestSinkCall } from '../utils/utils';

describe('Tests for correct analysis of call chains', () => {
    it('simple', function () {
        const scripts = [
            `function f(x) {
                fetch('/api/endpoint?arg=' + x);
            }
            function g() {
                f('test');
            }
            `
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': [
                    '/api/endpoint?arg=test'
                ]
            } as SinkCall,
        );
    });
    it('test that non-call usage of func does not trigger chain analysis', () => {
        const script = `
            function f(x) {
                fetch('/api/endpoint?arg=' + x);
            }
            function g() {
                window.savedF = f;
            }
        `;
        const analyzer = new Analyzer();

        // @ts-ignore
        const origExtractDEPsWithCallChain = analyzer.extractDEPsWithCallChain;

        let wasCalled = false;

        // @ts-ignore
        analyzer.extractDEPsWithCallChain = function (...args) {
            wasCalled = true;
            origExtractDEPsWithCallChain.call(analyzer, ...args);
        };

        analyzer.addScript(script);
        analyzer.mineArgsForDEPCalls('http://example.com');

        expect(wasCalled).toBeFalse();
    });
    it('test with several call sites in one function', () => {
        const script = `
            function f(x) {
                fetch('/api/endpoint?arg=' + x);
            }
            function g() {
                f('argumen');
                f('param');
            }
        `;
        const analyzer = new Analyzer();

        analyzer.addScript(script);
        analyzer.mineArgsForDEPCalls('http://example.com');

        const results = analyzer.results;
        results.forEach(res => {
            delete res.location;
        });

        expect(results).toContain({
            'funcName': 'fetch',
            'args': [
                '/api/endpoint?arg=argumen'
            ]
        } as SinkCall);
        expect(results).toContain({
            'funcName': 'fetch',
            'args': [
                '/api/endpoint?arg=param'
            ]
        } as SinkCall);
    });
    describe('Recursive functions', () => {
        it('are handled', function () {
            const scripts = [`
                function f(x) {
                    if (typeof x === 'undefined') {
                        f('defarg')
                    } else {
                        fetch('/api/endpoint?arg=' + x);
                    }
                }
            `];
            runSingleTestSinkCall(
                scripts,
                {
                    'funcName': 'fetch',
                    'args': [
                        '/api/endpoint?arg=defarg'
                    ]
                } as SinkCall,
            );
        });
        it('limit call depth to 1', function () {
            const script = `
                function f(x) {
                    $.get('/api/get?param=' + x);

                    if (someCond()) {
                        f(x + 'x');
                    }
                }
            `;

            const analyzer = new Analyzer();

            // @ts-ignore
            const origExtractDEPsWithCallChain = analyzer.extractDEPsWithCallChain;

            let callCount = 0;

            // @ts-ignore
            analyzer.extractDEPsWithCallChain = function (...args) {
                callCount++;
                origExtractDEPsWithCallChain.call(analyzer, ...args);
            };

            analyzer.addScript(script);
            analyzer.mineArgsForDEPCalls('http://example.com');

            expect(callCount).toBeLessThanOrEqual(1);
        });
    });
});
