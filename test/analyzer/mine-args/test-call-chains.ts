import { Analyzer, SinkCall } from '../../../src/analyzer/analyzer';
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
        analyzer.mineArgsForDEPCalls('http://example.com', false);

        expect(wasCalled).toBeFalse();
    });
});
