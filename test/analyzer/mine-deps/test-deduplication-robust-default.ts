import {
    deduplicateDEPs,
    DeduplicationMode
} from '../../../src/analyzer/dep-comparison';
import { makeAndRunSimple } from '../utils/utils';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for default comparison hars', () => {
    it('hars with numeric values', async () => {
        const scripts = [
            `$.ajax({
                url: 'example/test.php?r=124'
            });
            $.ajax({
                url: 'example/test.php?r=0xa1b'
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Default
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);
    });

    it('hars with unknown and numeric values', async () => {
        const scripts = [
            `$.ajax({
                url: 'example/test.php?r=UNKNOWN&a=123&c=789'
            });
            $.ajax({
                url: 'example/test.php?r=test&a=456&c=UNKNOWN'
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Default
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example/test.php?r=test&a=123&c=789',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'r',
                    value: 'test'
                },
                {
                    name: 'a',
                    value: '123'
                },
                {
                    name: 'c',
                    value: '789'
                }
            ],
            'bodySize': 0
        }));
    });

    it('different types of param value', async () => {
        const scripts = [
            `$.ajax({
                url: 'example/test.php?a=123&b=test1'
            });
            $.ajax({
                url: 'example/test.php?a=test&b=test1'
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Default
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Extended
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);
    });

    it('combine headers', async () => {
        const scripts = [
            `axios({
                url: 'example/test.php',
                headers: {
                    'X-CSRF-TOKEN':'token'
                },
            });
            axios({
                url: 'example/test.php',
                headers: {
                    'Authorization':'authorization',
                }
            });`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Default
        ).map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example/test.php',
            'httpVersion': 'HTTP/1.1',
            'headers': [
                {
                    name: 'Host',
                    value: 'test.com'
                },
                {
                    name: 'X-CSRF-TOKEN',
                    value: 'token'
                },
                {
                    name: 'Authorization',
                    value: 'authorization'
                }
            ],
            'queryString': [],
            'bodySize': 0
        }));
    });

    it('json body with different numbers in maps', async () => {
        const scripts = [
            `fetch('/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'alt_method': true, 'auth': {'l': 'test', 'p': 123} })
            })

            fetch('/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'alt_method': true, 'auth': {'l': 'test', 'p': 456} })
            })`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Default
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
                    value: '47'
                }
            ],
            'queryString': [],
            'bodySize': 47,
            'postData': {
                text: '{"alt_method":true,"auth":{"l":"test","p":123}}',
                mimeType: 'application/json'
            }
        }));
    });

    it('json body with different strings in object that is in arrays', async () => {
        const scripts = [
            `fetch('/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'alt_method': true, 'auth': ['test', {'test2': 'test3'}] })
            })

            fetch('/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'alt_method': true, 'auth': ['test', {'test2': 'test4'}] })
            })`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(
            analyzer.hars,
            DeduplicationMode.Default
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
                    value: '53'
                }
            ],
            'queryString': [],
            'bodySize': 53,
            'postData': {
                text: '{"alt_method":true,"auth":["test",{"test2":"test3"}]}',
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
                    value: '53'
                }
            ],
            'queryString': [],
            'bodySize': 53,
            'postData': {
                text: '{"alt_method":true,"auth":["test",{"test2":"test4"}]}',
                mimeType: 'application/json'
            }
        }));
    });
});
