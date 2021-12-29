import { runSingleTestHAR, makeAndRunSimple } from '../utils/utils';


describe('Tests for Axios library\'s DEPs hars', () => {
    it('axios get request as function (without method)', function () {
        const scripts = [
            `axios('/user?id=12');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/user?id=12',
                queryString: [
                    {
                        name: 'id',
                        value: '12',
                    },
                ],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET'
            },
        );
    });

    it('axios get request as function', function () {
        const scripts = [
            `axios({
                method: 'get',
                url: '/user?id=12'
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/user?id=12',
                queryString: [
                    {
                        name: 'id',
                        value: '12',
                    },
                ],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET'
            },
        );
    });

    it('axios post request as function', function () {
        const scripts = [
            `axios({
                method: 'post',
                url: '/user/12345',
                data: {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/user/12345',
                headers: [
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
                        value: '44'
                    }
                ],
                queryString: [],
                bodySize: 44,
                postData: {
                    text: '{"firstName":"Fred","lastName":"Flintstone"}',
                    mimeType: 'application/json'
                },
                method: 'POST'
            },
        );
    });

    it('axios put request as function', function () {
        const scripts = [
            `axios({
                method: 'put',
                url: '/user/12345',
                data: {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/user/12345',
                headers: [
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
                        value: '44'
                    }
                ],
                queryString: [],
                bodySize: 44,
                postData: {
                    text: '{"firstName":"Fred","lastName":"Flintstone"}',
                    mimeType: 'application/json'
                },
                method: 'PUT'
            },
        );
    });

    it('axios get request as object\'s method', function () {
        const scripts = [
            `axios.get('/user?id=12')`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/user?id=12',
                queryString: [
                    {
                        name: 'id',
                        value: '12',
                    },
                ],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET'
            },
        );
    });

    it('axios post request as object\'s method', function () {
        const scripts = [
            `axios.post(
                '/user/12345',
                {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            );`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/user/12345',
                headers: [
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
                        value: '44'
                    }
                ],
                queryString: [],
                bodySize: 44,
                postData: {
                    text: '{"firstName":"Fred","lastName":"Flintstone"}',
                    mimeType: 'application/json'
                },
                method: 'POST'
            },
        );
    });

    it('axios put request as object\'s method', function () {
        const scripts = [
            `axios.put(
                '/user/12345',
                {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            );`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/user/12345',
                headers: [
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
                        value: '44'
                    }
                ],
                queryString: [],
                bodySize: 44,
                postData: {
                    text: '{"firstName":"Fred","lastName":"Flintstone"}',
                    mimeType: 'application/json'
                },
                method: 'PUT'
            },
        );
    });

    it('handles null and undefined URLs', function () {
        const scripts = [
            `axios.post(
                null,
                {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            );`,
            `axios({
                method: 'get',
                url: undefined
            });`
        ];
        const analyzer = makeAndRunSimple(scripts, true);
        expect(analyzer.hars).toEqual([]);
    });

    it('handles baseURL option with absolute requestURL', function () {
        const scripts = [
            `axios.post(
                'http://biba-and-boba.co',
                'command=pwd',
                {
                  baseURL: '/admin/index.html'
                }
            );`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://biba-and-boba.co/',
                headers: [
                    {
                        name: 'Host',
                        value: 'biba-and-boba.co'
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    },
                    {
                        name: 'Content-Length',
                        value: '11'
                    }
                ],
                queryString: [],
                bodySize: 11,
                postData: {
                    text: 'command=pwd',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'command',
                            value: 'pwd'
                        }
                    ]
                },
                method: 'POST'
            },
        );
    });

    it('handles baseURL option', function () {
        const scripts = [
            `axios({
                method: 'put',
                url: '?command=ls',
                baseURL: 'admin/index.html'
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/admin/index.html/?command=ls',
                headers: [
                    {
                        name: 'Host',
                        value: 'test.com'
                    },
                    {
                        name: 'Content-Length',
                        value: '0'
                    }
                ],
                queryString: [
                    {
                        name: 'command',
                        value: 'ls'
                    }
                ],
                bodySize: 0,
                postData: {
                    text: '',
                },
                method: 'PUT'
            },
        );
    });

    it('axios request with unknown headers', function () {
        const scripts = [
            `const n = someUnknownFunc();
            axios({
                url: '/test',
                method: 'GET',
                headers: n
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/test',
                headers: [
                    {
                        name: 'Host',
                        value: 'test.com'
                    }
                ],
                queryString: [],
                bodySize: 0,
                method: 'GET'
            },
        );
    });

    it('axios with undefined param in body', async () => {
        const scripts = [
            `let a = {"param": undefined};
            axios.post('/test', a);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/test',
                headers: [
                    {
                        name: 'Host',
                        value: 'test.com'
                    },
                    {
                        name: 'Content-Length',
                        value: '19'
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/json'
                    }
                ],
                queryString: [],
                bodySize: 19,
                postData: {
                    text: '{"param":"UNKNOWN"}',
                    mimeType: 'application/json'
                },
                method: 'POST'
            },
        );
    });
});
