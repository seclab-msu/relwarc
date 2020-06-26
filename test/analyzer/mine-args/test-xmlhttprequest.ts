import { SinkCall } from "../../../src/analyzer/analyzer";
import { makeAndRunSimple } from './common';


describe('Analyzer finding args of XMLHttpRequest calls', () => {
    it('basic case', () => {
        const analyzer = makeAndRunSimple(`
            function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/123', true);
                xhr.send('DATA');
            }
        `);

        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain({
            'funcName': 'XMLHttpRequest.send',
            'args': [
                {
                    'name': 'open',
                    'args': [
                        'POST',
                        '/123',
                        true
                    ]
                },
                {
                    'name': 'send',
                    'args': [
                        'DATA'
                    ]
                }
            ]
        } as SinkCall);
    });

    it("test with setRequestHeader", () => {
        const analyzer = makeAndRunSimple(`
            function f() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/test', true);
                xhr.setRequestHeader('Testheader', 'testvalue')
                xhr.send();
            }
        `);

        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain({
            "funcName": "XMLHttpRequest.send",
            "args": [
                {
                    name: 'open',
                    args: [
                        'GET',
                        '/test',
                        true
                    ]
                },
                {
                    name: 'setRequestHeader',
                    args: [
                        'Testheader',
                        'testvalue'
                    ]
                },
                {
                    "name": "send",
                    "args": []
                }
            ]
        } as SinkCall);
    });

    it('test with unknown value', () => {
        const analyzer = makeAndRunSimple(`
            function f(x) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/test?param=' + x, true);
                xhr.send();
            }
        `);

        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain({
            'funcName': 'XMLHttpRequest.send',
            'args': [
                {
                    'name': 'open',
                    'args': [
                        'GET',
                        '/test?param=UNKNOWN',
                        true
                    ]
                },
                {
                    'name': 'send',
                    'args': []
                }
            ]
        } as SinkCall);

    });

    it("test with parameters coming from args - call from another func", () => {
        const analyzer = makeAndRunSimple(`
            function g() {
                f('abcdef');
            }
            function f(x) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/test?param=' + x, true);
                xhr.send();
            }
        `);

        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain({
            "funcName": "XMLHttpRequest.send",
            "args": [
                {
                    name: 'open',
                    args: [
                        'GET',
                        '/test?param=abcdef',
                        true
                    ]
                },
                {
                    "name": "send",
                    "args": []
                }
            ]
        } as SinkCall);
    });

    it("test with parameters coming from args - call from global", () => {
        const analyzer = makeAndRunSimple(`
            f('abcdef');

            function f(x) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/test?param=' + x, true);
                xhr.send();
            }
        `);

        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain({
            "funcName": "XMLHttpRequest.send",
            "args": [
                {
                    name: 'open',
                    args: [
                        'GET',
                        '/test?param=abcdef',
                        true
                    ]
                },
                {
                    "name": "send",
                    "args": []
                }
            ]
        } as SinkCall);
    });

    it("test with parameters coming from args - param in body", () => {
        const analyzer = makeAndRunSimple(`
            function g() {
                f('abcdef');
            }

            function f(x) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/testing', true);
                xhr.send('x=' + x);
            }
        `);

        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain({
            "funcName": "XMLHttpRequest.send",
            "args": [
                {
                    name: 'open',
                    args: [
                        'POST',
                        '/testing',
                        true
                    ]
                },
                {
                    "name": "send",
                    "args": ['x=abcdef']
                }
            ]
        } as SinkCall);
    });
});
