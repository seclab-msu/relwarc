import { makeAndRunSimple } from '../utils/utils';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for logical operator:', () => {
    it('|| with correct value on the left side', async () => {
        const scripts = [
            `let a = "/test" || c;
            fetch(a);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0
        }));
    });

    it('|| with correct value on the right side', async () => {
        const scripts = [
            `let a = c || "/test";
            fetch(a);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0
        }));
    });

    it('|| with empty object on the right side', async () => {
        const scripts = [
            `window.a = window.a || {};
            a.test = "/test";
            fetch(a.test);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0
        }));
    });

    it('|| with ValueSet on the left side', async () => {
        const scripts = [
            `let a = isTrue ? "/example" : null;
            let b = a || "/test";
            fetch(b);`
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
            'bodySize': 0
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0
        }));
    });

    it('|| with formalarg on the left side is assigned to new variable', async () => {
        const scripts = [
            `function f(q) {
                let a = q || "/test";
                fetch(a);
            }
            f("/example");`
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
            'bodySize': 0
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0
        }));
    });

    xit('|| with formalarg on the left side is assigned to same variable', async () => { // TODO (See #8003)
        const scripts = [
            `function f(a) {
                a = a || "/test";
                fetch(a);
            }
            f("/example");`
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
            'bodySize': 0
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0
        }));
    });
});
