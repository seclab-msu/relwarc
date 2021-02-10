import { runSingleTestHAR } from '../utils';


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
});
