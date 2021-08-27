import { makeAndRunSimple } from '../utils/utils';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Correct work with scopes', () => {
    it('local and global variables with the same name', async () => {
        const scripts = [
            `const a = '/test';
            function p(a) {
                a = "/example";
                fetch(a);
            }
            fetch(a);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(2);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0,
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0
        }));
    });

    it('chemistwarehouse.com.au', async () => {
        const scripts = [
            `function f(window) {};
            var uri = 'https://' + window.location.hostname + '/ssdata_nocache.ashx?callback=?';
            $.getJSON(uri);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'https://test.com/ssdata_nocache.ashx?callback=?',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    'name': 'callback',
                    'value': '?'
                }
            ],
            'bodySize': 0,
        }));
    });
});
