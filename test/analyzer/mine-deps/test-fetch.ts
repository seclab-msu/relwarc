import { runSingleTestHAR } from '../utils/utils';

describe('Analyzer mining HARs from fetch() calls', () => {
    it('handles window.fetch()', () => {
        const scripts = [
            `window.fetch('/testing/tst');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/testing/tst',
                queryString: [],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            },
            'http://example.com/',
        );
    });
});
