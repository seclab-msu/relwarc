import { runSingleTestHAR, makeAndRunSimple } from '../utils/utils';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for built-in classes', () => {
    it('URL class', function () {
        const scripts = [
            `const u = new URL('http://test.com/some')
            fetch(u.href);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some',
                method: 'GET',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URL class with "base" argument', function () {
        const scripts = [
            `const u = new URL('/some', 'http://test.com')
            fetch(u.href);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some',
                method: 'GET',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URL class with unknown path', function () {
        const scripts = [
            `const u = new URL(rel, 'http://test.com/some/')
            fetch(u.href);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some/UNKNOWN',
                method: 'GET',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URL class with ValueSet as arg (if statement)', function () {
        const scripts = [
            `let u;
            if (a) {
                u = 'http://test.com/some'
            } else {
                u = 'http://test.com/some2'
            }
            const url = new URL(u);
            fetch(url.toString()) `
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );
        const hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/some',
            'httpVersion': 'HTTP/1.1',
            'headers': [{
                'name': 'Host',
                'value': 'test.com'
            }],
            'queryString': []
        }));
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/some2',
            'httpVersion': 'HTTP/1.1',
            'headers': [{
                'name': 'Host',
                'value': 'test.com'
            }],
            'queryString': []
        }));
    });

    it('URL class with ValueSet as arg (FROM_ARG)', function () {
        const scripts = [
            `function f(u) {
                const url = new URL(u)
                fetch(url.toString())
            }
            f('http://test.com/some')`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );
        const hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/some',
            'httpVersion': 'HTTP/1.1',
            'headers': [{
                'name': 'Host',
                'value': 'test.com'
            }],
            'queryString': []
        }));
    });

    it('URL class, append to searchParams', function () {
        const scripts = [
            `let url = new URL("http://test.com/some")
            url.searchParams.set('q', 'test');
            fetch(url.toString());`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some?q=test',
                method: 'GET',
                queryString: [{
                    name: 'q',
                    value: 'test'
                }],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URLSearchParams class with "append" method', function () {
        const scripts = [
            `const u = new URLSearchParams();
            u.append('action', 'move');
            fetch('/some?'.concat(u));`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some?action=move',
                method: 'GET',
                queryString: [{
                    name: 'action',
                    value: 'move'
                }],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URLSearchParams class with "set" method', function () {
        const scripts = [
            `const u = new URLSearchParams();
            u.set('action', 'move');
            fetch('/some?' + u.toString());`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some?action=move',
                method: 'GET',
                queryString: [{
                    name: 'action',
                    value: 'move'
                }],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URLSearchParams class with arg as string', function () {
        const scripts = [
            `const u = new URLSearchParams('action=move');
            fetch('/some?' + u);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some?action=move',
                method: 'GET',
                queryString: [{
                    name: 'action',
                    value: 'move'
                }],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URLSearchParams class with arg as object', function () {
        const scripts = [
            `const u = new URLSearchParams({'action': 'move'});
            fetch('/some?' + u);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some?action=move',
                method: 'GET',
                queryString: [{
                    name: 'action',
                    value: 'move'
                }],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URLSearchParams class with ValueSet as object values', function () {
        const scripts = [
            `class T {
                constructor() {
                    this.param1 = "value1";
                    this.param2 = "value2";
                }
                req() {
                    const p = new URLSearchParams({
                        p1: this.param1,
                        p2: this.param2
                    });
                    fetch('/some?' + p.toString())
                }
            }`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some?p1=value1&p2=value2',
                method: 'GET',
                queryString: [{
                    name: 'p1',
                    value: 'value1'
                }, {
                    name: 'p2',
                    value: 'value2'
                },],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('URLSearchParams class without assigning', function () {
        const scripts = [
            `const e = {"k": "v"}
            fetch("/some?".concat(new URLSearchParams(e).toString()))`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/some?k=v',
                method: 'GET',
                queryString: [{
                    name: 'k',
                    value: 'v'
                }],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });
});
