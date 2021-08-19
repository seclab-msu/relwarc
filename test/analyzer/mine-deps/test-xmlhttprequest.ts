import { runSingleTestHAR, runSingleTestHARFromFile, makeAndRunSimple } from '../utils/utils';
import * as fs from 'fs';


describe('Analyzer mining DEPs from XMLHttpRequest calls', () => {
    it('handles basic case', () => {
        const scripts = [
            `function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/123', true);
                xhr.send('DATA');
            }`
        ];
        runSingleTestHAR(
            scripts,
            {
                method: 'POST',
                url: 'http://example.com/123',
                headers: [
                    {
                        name: 'Host',
                        value: 'example.com'
                    },
                    {
                        name: 'Content-Type',
                        value: 'text/plain'
                    },
                    {
                        name: 'Content-Length',
                        value: '4'
                    }
                ],
                queryString: [],
                bodySize: 4,
                postData: {
                    text: 'DATA',
                    mimeType: 'text/plain'
                },
                httpVersion: 'HTTP/1.1'
            },
            'http://example.com/',
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
        runSingleTestHAR(
            scripts,
            {
                method: 'GET',
                url: 'http://test.site/testxhr/get',
                headers: [
                    {
                        name: 'Host',
                        value: 'test.site'
                    }
                ],
                queryString: [],
                bodySize: 0,
                httpVersion: 'HTTP/1.1'
            },
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
        runSingleTestHAR(
            scripts,
            {
                method: 'GET',
                url: 'http://example.com/test?a=5&param=xx',
                headers: [
                    {
                        name: 'Host',
                        value: 'example.com'
                    }
                ],
                queryString: [
                    {
                        name: 'a',
                        value: '5'
                    },
                    {
                        name: 'param',
                        value: 'xx'
                    }
                ],
                bodySize: 0,
                httpVersion: 'HTTP/1.1'
            },
            'http://example.com/',
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
        runSingleTestHAR(
            scripts,
            {
                method: 'POST',
                url: 'http://example.com/test',
                headers: [
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
                ],
                queryString: [],
                bodySize: 21,
                postData: {
                    text: 'param=val&param2=val2',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'param',
                            value: 'val'
                        },
                        {
                            name: 'param2',
                            value: 'val2'
                        }
                    ]
                },
                httpVersion: 'HTTP/1.1'
            },
            'http://example.com/',
        );
    });

    it('test with call in DOM event handler', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/22.js').toString()
        ];
        runSingleTestHARFromFile(
            scripts,
            __dirname + '/../data/22.json',
            'http://example.com/',
        );
    });

    it('handles null and undefined URLs', () => {
        const scripts = [
            `var oReq = new XMLHttpRequest();
            oReq.open("GET", null);
            oReq.send();`,
            `var oReq = new XMLHttpRequest();
            oReq.open("GET", undefined);
            oReq.send();`
        ];
        const analyzer = makeAndRunSimple(scripts, true);
        expect(analyzer.hars).toEqual([]);
    });
});
