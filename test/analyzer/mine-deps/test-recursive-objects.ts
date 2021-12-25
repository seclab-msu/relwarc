import { runSingleTestHAR } from '../utils/utils';

describe('Tests for recursive objects', () => {
    it('recursive object - window', () => {
        const scripts = [
            `$.ajax({
                type: 'GET',
                url: '/test',
                data: {a: '1'},
                context: window
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test?a=1',
                queryString: [
                    {
                        name: 'a',
                        value: '1',
                    },
                ],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET'
            },
            'http://example.com/',
        );
    });

    it('simple recursive object', () => {
        const scripts = [
            `function f() {
                let data = {};
                data.recursive = data;

                $.ajax('/test', {
                    context: data
                });
            }`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
                queryString: [],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET'
            },
            'http://example.com/',
        );
    });

    it('mutual recursion', () => {
        const scripts = [
            `function f() {
                let data = {};
                let data2 = {};
                data.recursive = data2;
                data2.recursive = data;

                $.ajax('/test', {
                    context: data
                });
            }`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
                queryString: [],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET'
            },
            'http://example.com/',
        );
    });

    it('mutual recursion with depth - 4', () => {
        const scripts = [
            `function f() {
                let a = {};
                let c = {};
                let e = {};
                let g = {};
                e.f = g;
                c.d = e;
                a.b = c;
                g.h = a.b;

                $.ajax('/test', {
                    context: a
                });
            }`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/test',
                queryString: [],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET'
            },
            'http://example.com/',
        );
    });
});
