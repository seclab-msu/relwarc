import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTestSinkCall } from '../utils';


describe('Analyzer finding args of fetch() calls', () => {
    it('works with window.fetch()', function () {
        const scripts = [
            `window.fetch('/testing/test');`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'window.fetch',
                'args': ['/testing/test']
            } as SinkCall,
        );
    });

    // TODO: does not currently work, reconsider whether it should be added
    xit('works with this.fetch()', function () {
        const scripts = [
            `this.fetch('/testing/test');`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'this.fetch',
                'args': ['/testing/test']
            } as SinkCall,
        );
    });
});
