import { runSingleTestHAR } from '../utils/utils';

describe('Analyzer mining HARs from location assignment', () => {
    it('handles window.location assignment', () => {
        const scripts = [
            `window.location = '/test'`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
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
    }),
    it('handles location assignment', () => {
        const scripts = [
            `location = '/test';`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
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
    }),
    it('handles document.location assignment', () => {
        const scripts = [
            `test = 'example'
            document.location = test`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/example',
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
            'http://example.com',
        );
    }),
    it('handles location.href assignment', () => {
        const scripts = [
            `test = '/test'
            document.location.href = test`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
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
    }),
    it('handles location assignment in call sequence', () => {
        const scripts = [
            `function f() {
                test1('test')
            }
            function test1(a) {
                test2(a)
            }
            function test2(b) {
                window.document.location.href = b
            }`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
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
    }),
    it('Assigning "location" to another variable', () => {
        const scripts = [
            `var l = location;
            l.href = '/test';`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
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
    }),
    it('Assigning "document" to another variable', () => {
        const scripts = [
            `var d = document;
            d.location = '/test';`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
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
    }),
    it('handles location assignment in square brackets', () => {
        const scripts = [
            `location['href'] = '/test';`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
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
