import { runSingleTestHAR, makeAndRunSimple } from '../utils/utils';

describe('Test for functions without bindings', () => {
    it('function in global variable without declaration', () => {
        const scripts = [
            `y = (a, b) => {
                $.get(a, 'password=' + b);
            };
            y('http://example.com/admin', '5a$$w0rd');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/admin?password=5a$$w0rd',
                queryString: [{
                    name: 'password',
                    value: '5a$$w0rd'

                }],
                headers: [{
                    name: 'Host',
                    value: 'example.com'
                }],
                bodySize: 0,
                method: 'GET'
            },
            'http://example.com/',
        );
    }),
    it('call global variable in function', () => {
        const scripts = [
            `y = (a, b) => {
                $.get(a, 'password=' + b);
            };
            function main() {
                y('http://example.com/admin', '5a$$w0rd');
            }`
        ];

        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/admin?password=5a$$w0rd',
                queryString: [{
                    name: 'password',
                    value: '5a$$w0rd'

                }],
                headers: [{
                    name: 'Host',
                    value: 'example.com'
                }],
                bodySize: 0,
                method: 'GET'
            },
            'http://example.com/',
        );
    }),
    it('different scopes', () => {
        const scripts = [
            `y = (a, b) => {
                $.get(a, 'password=' + b);
            };
            function main() {
                let y = (c, d) => { console.log(c, d); }
                y('http://example.com/admin', '5a$$w0rd');
            }`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        expect(analyzer.hars.length).toBe(0);
    });
});
