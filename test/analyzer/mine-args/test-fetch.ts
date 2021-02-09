import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTest } from '../utils';


describe('Analyzer finding args of fetch() calls', () => {
    it('works with window.fetch()', function () {
        const scripts = [
            `window.fetch('/testing/test');`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': 'window.fetch',
                'args': ['/testing/test']
            } as SinkCall,
            false
        );
    });

    // TODO: does not currently work, reconsider whether it should be added
    xit('works with this.fetch()', function () {
        const scripts = [
            `this.fetch('/testing/test');`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': 'this.fetch',
                'args': ['/testing/test']
            } as SinkCall,
            false
        );
    });
});
