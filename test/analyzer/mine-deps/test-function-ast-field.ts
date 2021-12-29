import { makeAndRunSimple } from '../utils/utils';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe(`Correct work with ast field in functions`, () => {
    it('Assignment to ast', async () => {
        const scripts = [
            `function f(x) {
                return 'param=' + x;
            }

            function g() {
                f.ast = 'test';
                fetch('/test?' + f('123'));
            }`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test?param=123',
            'httpVersion': 'HTTP/1.1',
            'queryString': [{
                name: 'param',
                value: '123'
            }],
            'bodySize': 0,
        }));
    });

    it('Output ast', async () => {
        const scripts = [
            `function f(x) {
                return 'param=' + x;
            }

            function g() {
                fetch('/test?' + JSON.stringify(f.ast));
            }`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test?undefined',
            'httpVersion': 'HTTP/1.1',
            'queryString': [{
                name: 'undefined',
                value: ''
            }],
            'bodySize': 0,
        }));
    });
});
