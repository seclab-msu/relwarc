import { runSingleTest } from "../run-tests-helper";


describe('Analyzer mining DEPs from XMLHttpRequest calls', () => {
    it('handles basic case', () => {
        const scripts = [
            `function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/123', true);
                xhr.send('DATA');
            }`
        ];
        runSingleTest(
            scripts,
            {
                method: "POST",
                url: "http://example.com/123",
                headers: new Set([
                    {
                        name: "Host",
                        value: "example.com"
                    },
                    {
                        name: "Content-Type",
                        value: "text/plain"
                    },
                    {
                        name: "Content-Length",
                        value: "4"
                    }
                ]),
                queryString: new Set([]),
                bodySize: 4,
                postData: {
                    text: "DATA",
                    mimeType: "text/plain"
                },
                httpVersion: 'HTTP/1.1'
            },
            true,
            "http://example.com/"
        );
    });

    it('handles get request', () => {
        const scripts = [
            `function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://test.site/testxhr/get', true);
                xhr.send();
            }`
        ];
        runSingleTest(
            scripts,
            {
                method: 'GET',
                url: "http://test.site/testxhr/get",
                headers: new Set([
                    {
                        name: 'Host',
                        value: 'test.site'
                    }
                ]),
                queryString: new Set([]),
                bodySize: 0,
                httpVersion: 'HTTP/1.1'
            },
            true
        );
    });

    it('handles get request with query string', () => {
        const scripts = [
            `function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/test?a=5&param=xx', true);
                xhr.send();
            }`
        ];
        runSingleTest(
            scripts,
            {
                method: 'GET',
                url: "http://example.com/test?a=5&param=xx",
                headers: new Set([
                    {
                        name: 'Host',
                        value: 'example.com'
                    }
                ]),
                queryString: new Set([
                    {
                        name: 'a',
                        value: '5'
                    },
                    {
                        name: 'param',
                        value: 'xx'
                    }
                ]),
                bodySize: 0,
                httpVersion: 'HTTP/1.1'
            },
            true,
            "http://example.com/"
        );
    });

    it('handles request with form post (urlencoded content type set)', () => {
        const scripts = [
            `function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/test', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send('param=val&param2=val2');
            }`
        ];
        runSingleTest(
            scripts,
            {
                method: 'POST',
                url: "http://example.com/test",
                headers: new Set([
                    {
                        name: 'Host',
                        value: 'example.com'
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    },
                    {
                        name: 'Content-Length',
                        value: '21'
                    }
                ]),
                queryString: new Set([]),
                bodySize: 21,
                postData: {
                    text: 'param=val&param2=val2',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: new Set([
                        {
                            name: 'param',
                            value: 'val'
                        },
                        {
                            name: 'param2',
                            value: 'val2'
                        }
                    ])
                },
                httpVersion: 'HTTP/1.1'
            },
            true,
            "http://example.com/"
        );
    });
});
