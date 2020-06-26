import { SinkCall } from "../../../src/analyzer/analyzer";
import { makeAndRunSimple } from './common';


describe('Analyzer mining DEPs from XMLHttpRequest calls', () => {
    it('handles basic case', () => {
        const analyzer = makeAndRunSimple(`
            function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/123', true);
                xhr.send('DATA');
            }
        `);

        expect(analyzer.hars.length).toBeGreaterThanOrEqual(1);

        const hars = analyzer.hars.map(har => {
            const untypedHar = JSON.parse(JSON.stringify(har));
            untypedHar.headers = new Set(untypedHar.headers);
            return untypedHar;
        });

        expect(hars).toContain(jasmine.objectContaining({
            "method": "POST",
            "url": "http://example.com/123",
            "headers": new Set([
                {
                    "name": "Host",
                    "value": "example.com"
                },
                {
                    "name": "Content-Type",
                    "value": "text/plain"
                },
                {
                    "name": "Content-Length",
                    "value": "4"
                }
            ]),
            "queryString": [],
            "bodySize": 4,
            "postData": {
                "text": "DATA",
                "mimeType": "text/plain"
            }
        }));
    });

    it('handles get request', () => {
        const analyzer = makeAndRunSimple(`
            function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://test.site/testxhr/get', true);
                xhr.send();
            }
        `);

        expect(analyzer.hars.length).toBeGreaterThanOrEqual(1);

        const hars = analyzer.hars.map(har => {
            const untypedHar = JSON.parse(JSON.stringify(har));
            untypedHar.headers = new Set(untypedHar.headers);
            return untypedHar;
        });

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            "url": "http://test.site/testxhr/get",
            "headers": new Set([
                {
                    name: 'Host',
                    value: 'test.site'
                }
            ]),
            "queryString": [],
            "bodySize": 0
        }));
    });

    it('handles get request with query string', () => {
        const analyzer = makeAndRunSimple(`
            function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/test?a=5&param=xx', true);
                xhr.send();
            }
        `);

        expect(analyzer.hars.length).toBeGreaterThanOrEqual(1);

        const hars = analyzer.hars.map(har => {
            const untypedHar = JSON.parse(JSON.stringify(har));
            untypedHar.headers = new Set(untypedHar.headers);
            return untypedHar;
        });

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            "url": "http://example.com/test?a=5&param=xx",
            "headers": new Set([
                {
                    name: 'Host',
                    value: 'example.com'
                }
            ]),
            "queryString": [
                {
                    name: 'a',
                    value: '5'
                },
                {
                    name: 'param',
                    value: 'xx'
                }
            ],
            "bodySize": 0
        }));
    });

    it('handles request with form post (urlencoded content type set)', () => {
        const analyzer = makeAndRunSimple(`
            function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/test', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send('param=val&param2=val2');
            }
        `);

        expect(analyzer.hars.length).toBeGreaterThanOrEqual(1);

        const hars = analyzer.hars.map(har => {
            const untypedHar = JSON.parse(JSON.stringify(har));
            untypedHar.headers = new Set(untypedHar.headers);
            return untypedHar;
        });

        expect(hars).toContain(jasmine.objectContaining({
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
            queryString: [],
            postData: {
                mimeType: 'application/x-www-form-urlencoded',
                text: 'param=val&param2=val2',
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
            }
        }));
    });
});
