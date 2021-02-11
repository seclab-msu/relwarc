import { runSingleTestHAR, makeAndRunSimple } from '../utils/utils';

describe('Analyzer mining HARs for JS DEPs', () => {
    it('smoke test', () => {
        const scripts = [
            `console.log('Hello World!');`
        ];
        makeAndRunSimple(
            scripts,
            true,
            'http://example.com/'
        );
    });

    it('handles fetch /', () => {
        const scripts = [
            `fetch('/');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/',
                queryString: [],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET'
            },
            'http://example.com/',
        );
    });

    it('supports $.ajax with settings object', () => {
        const scripts = [
            `$.ajax({
                method: 'POST',
                url: 'http://test.site/action',
                data: {
                    a: 1,
                    'b': 'xx'
                }
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.site/action',
                queryString: [],
                headers: [
                    {
                        value: 'test.site',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    },
                    {
                        name: 'Content-Length',
                        value: '8'
                    }
                ],
                bodySize: 8,
                method: 'POST',
                postData: {
                    text: 'a=1&b=xx',
                    params: [
                        { name: 'a', value: '1' },
                        { name: 'b', value: 'xx' }
                    ],
                    mimeType: 'application/x-www-form-urlencoded'
                }
            },
        );
    });
});
