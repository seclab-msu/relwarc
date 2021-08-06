import {
    deduplicateDEPs,
    DeduplicationMode
} from '../../../src/analyzer/dep-comparison';
import { makeAndRunSimple } from '../utils/utils';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for extended comparison hars', () => {
    it('unknown and defined param value in two calls', async () => {
        const scripts = [
            `fetch('/testing/test?a=123');
            $.ajax({
                url: '/testing/test',
                data: {
                    a: unknown
                }
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/testing/test?a=123',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    'name': 'a',
                    'value': '123'
                }
            ],
            'bodySize': 0,
        }));
    });

    it('param values are defined in two calls', async () => {
        const scripts = [
            `$.ajax({
                method: "POST",
                url: '/example/test.aspx',
                data: {
                    name: "admin",
                    id: adminId
                }
            });
            $.post({
                url: '/example/test.aspx',
                data: {
                    name: adminName,
                    id: "123"
                }
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://test.com/example/test.aspx',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 17,
            'postData': {
                text: 'name=admin&id=123',
                mimeType: 'application/x-www-form-urlencoded',
                params: [
                    {
                        name: 'name',
                        value: 'admin'
                    },
                    {
                        name: 'id',
                        value: '123'
                    }
                ]
            }
        }));
    });

    it('param values are defined in three calls', async () => {
        const scripts = [
            `fetch('/example?a=1&b=' + b + '&c=' + c);
            fetch('/example?b=test&a=' + a + '&c=' + c);
            fetch('/example?c=3&b=' + b + '&a=' + a);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(3);

        hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example?a=1&b=test&c=3',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'a',
                    value: '1'
                },
                {
                    name: 'b',
                    value: 'test'
                },
                {
                    name: 'c',
                    value: '3'
                }
            ],
            'bodySize': 0
        }));
    });

    it('different content-type in calls', async () => {
        const scripts = [
            `$.post({
                url: "/example",
                data: {
                    a: "testing"
                },
                contentType: "application/json"
            });
            $.post({
                url: "/example",
                data: {
                    a: "testing"
                }
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(2);
    });

    it('different values of important params', async () => {
        const scripts = [
            `$.ajax({
                url: "/test",
                data: {
                    route: "test"
                },
            });
            $.ajax({
                url: "/test",
                data: {
                    route: "example"
                }
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(2);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test?route=test',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'route',
                    value: 'test'
                }
            ],
            'bodySize': 0
        }));
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test?route=example',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'route',
                    value: 'example'
                }
            ],
            'bodySize': 0
        }));
    });

    it('routing param "r"', async () => {
        const scripts = [
            `$.ajax({
                url: 'auto/index.php?r=/order/test',
                data: {
                    pserid: '4907'
                }
            });
            $.ajax({
                url: 'auto/index.php?r=%2Ftest%2Fexample',
                data: {
                    pserid: '4907'
                }
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(2);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/auto/index.php?r=/order/test&pserid=4907',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'r',
                    value: '/order/test'
                },
                {
                    name: 'pserid',
                    value: '4907'
                }
            ],
            'bodySize': 0
        }));
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/auto/index.php?r=%2Ftest%2Fexample&pserid=4907',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'r',
                    value: '%2Ftest%2Fexample'
                },
                {
                    name: 'pserid',
                    value: '4907'
                }
            ],
            'bodySize': 0
        }));
    });

    it('param "r" with string value', async () => {
        const scripts = [
            `$.ajax({
                url: 'auto/index.php?r=testing',
                data: {
                    pserid: '4907'
                }
            });
            $.ajax({
                url: 'auto/index.php?r=test',
                data: {
                    pserid: '4907'
                }
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/auto/index.php?r=testing&pserid=4907',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'r',
                    value: 'testing'
                },
                {
                    name: 'pserid',
                    value: '4907'
                }
            ],
            'bodySize': 0
        }));
    });

    it('json body with different strings in arrays', async () => {
        const scripts = [
            `fetch('/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'alt_method': true, 'auth': ['log1', 'pwd1'] })
            })

            fetch('/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'alt_method': false, 'auth': ['log2', 'pwd2'] })
            })`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'headers': [
                {
                    name: 'Host',
                    value: 'test.com'
                },
                {
                    name: 'Content-Type',
                    value: 'application/json'
                },
                {
                    name: 'Content-Length',
                    value: '42'
                }
            ],
            'queryString': [],
            'bodySize': 42,
            'postData': {
                text: '{"alt_method":true,"auth":["log1","pwd1"]}',
                mimeType: 'application/json'
            }
        }));
    });

    it('json body with different value types', async () => {
        const scripts = [
            `fetch('/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'alt_method': true, 'auth': {'log': 'pwd'} })
            })

            fetch('/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'alt_method': false, 'auth': ['log', 'pwd'] })
            })`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(2);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'headers': [
                {
                    name: 'Host',
                    value: 'test.com'
                },
                {
                    name: 'Content-Type',
                    value: 'application/json'
                },
                {
                    name: 'Content-Length',
                    value: '40'
                }
            ],
            'queryString': [],
            'bodySize': 40,
            'postData': {
                text: '{"alt_method":true,"auth":{"log":"pwd"}}',
                mimeType: 'application/json'
            }
        }));
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'headers': [
                {
                    name: 'Host',
                    value: 'test.com'
                },
                {
                    name: 'Content-Type',
                    value: 'application/json'
                },
                {
                    name: 'Content-Length',
                    value: '41'
                }
            ],
            'queryString': [],
            'bodySize': 41,
            'postData': {
                text: '{"alt_method":false,"auth":["log","pwd"]}',
                mimeType: 'application/json'
            }
        }));
    });
});
