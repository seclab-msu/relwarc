import { runSingleTestHAR, makeAndRunSimple } from '../utils/utils';

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
    it('handles FormData', () => {
        const scripts = [
            `const formData = new FormData();
            const url = '/login';
            formData.append('username', 'admin');
            formData.append('password', 'test');
            fetch(url, {
                method:'POST',
                body: formData
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/login',
                queryString: [],
                headers: [
                    {
                        name: 'Content-Type',
                        value: 'multipart/form-data',
                    },
                    {
                        name: 'Host',
                        value: 'example.com',
                    },
                    {
                        name: 'Content-Length',
                        value: '0',
                    }
                ],
                bodySize: 0,
                method: 'POST',
                postData: {
                    text: null,
                    mimeType: 'multipart/form-data',
                    params: [
                        {
                            'name': 'username',
                            'value': 'admin'
                        },
                        {
                            'name': 'password',
                            'value': 'test'
                        }
                    ]
                }

            },
            'http://example.com',
        );
    });
    it('does not fail on unknown method', () => {
        const scripts = [
            `function f() {
                var x = unknownMethod();
                fetch('/kek', {
                    method: x,
                    body: 'kek'
                })
            }`
        ];
        makeAndRunSimple(scripts, true);
    });

    it('handles null and undefined URLs', function () {
        const scripts = [
            `fetch(null, {
                body: "test=data"
            })`,
            `fetch(undefined)`
        ];
        const analyzer = makeAndRunSimple(scripts, true);
        expect(analyzer.hars).toEqual([]);
    });

    it('fetch request with unknown headers', function () {
        const scripts = [
            `const n = someUnknownFunc();
            fetch('/test', {
                headers: n
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/test',
                headers: [
                    {
                        name: 'Host',
                        value: 'test.com'
                    }
                ],
                queryString: [],
                bodySize: 0,
                method: 'GET'
            },
        );
    });

    it('window.fetch() with two args', function () {
        const scripts = [`
            window.fetch('/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Test-Header': 'test-header-value'
                },
                body: JSON.stringify({a: 1, b: 2})
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/test',
                method: 'POST',
                headers: [{
                    name: 'Host',
                    value: 'test.com'
                }, {
                    name: 'Test-Header',
                    value: 'test-header-value'
                }, {
                    name: 'Content-Type',
                    value: 'application/json'
                }, {
                    name: 'Content-Length',
                    value: '13'
                }],
                queryString: [],
                bodySize: 13,
                postData: {
                    text: '{"a":1,"b":2}',
                    mimeType: 'application/json'
                }
            },
        );
    });
});
