import { runSingleTest } from '../utils';

describe('Tests for AngularJS library"s DEPs hars', () => {
    it('$http get request as function', function () {
        const scripts = [
            `$http({
                method: 'GET',
                url: '/someUrl?id=12&param=delete'
            });`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/someUrl?id=12&param=delete',
                queryString: [
                    {
                        name: 'id',
                        value: '12',
                    },
                    {
                        name: 'param',
                        value: 'delete',
                    }
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
            true
        );
    });

    it('$http post request as function', function () {
        const scripts = [
            `$http({
                method: 'POST',
                url: '/someUrl',
                data: { 
                    'name': 'testparam', 
                    'value': 'test' 
                }
            });`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/someUrl',
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
                        value: '35'
                    }
                ],
                queryString: [],
                bodySize: 35,
                postData: {
                    text: '{"name":"testparam","value":"test"}',
                    mimeType: 'application/json'
                },
                method: 'POST'
            },
            true
        );
    });

    it('$http put request as function', function () {
        const scripts = [
            `$http({
                method: 'PUT',
                url: '/someUrl',
                data: { 
                    'name': 'testparam', 
                    'value': 'test' 
                }
            });`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/someUrl',
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
                        value: '35'
                    }
                ],
                queryString: [],
                bodySize: 35,
                postData: {
                    text: '{"name":"testparam","value":"test"}',
                    mimeType: 'application/json'
                },
                method: 'PUT'
            },
            true
        );
    });

    it('$http get request as object\'s method', function () {
        const scripts = [
            `$http.get(
                '/someUrl?param=123'
            );`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/someUrl?param=123',
                queryString: [
                    {
                        name: 'param',
                        value: '123',
                    }
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
            true
        );
    });

    it('$http post request as object\'s method', function () {
        const scripts = [
            `$http.post(
                '/someUrl',
                {
                    'name': 'username',
                    'value': 'Name'
                }
            );`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/someUrl',
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
                        value: '34'
                    }
                ],
                queryString: [],
                bodySize: 34,
                postData: {
                    text: '{"name":"username","value":"Name"}',
                    mimeType: 'application/json'
                },
                method: 'POST'
            },
            true
        );
    });

    it('$http put request as object\'s method', function () {
        const scripts = [
            `$http.put(
                '/someUrl',
                {
                    'name': 'username',
                    'value': 'Name'
                }
            );`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/someUrl',
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
                        value: '34'
                    }
                ],
                queryString: [],
                bodySize: 34,
                postData: {
                    text: '{"name":"username","value":"Name"}',
                    mimeType: 'application/json'
                },
                method: 'PUT'
            },
            true
        );
    });

    it('$http jsonp request as object\'s method', function () {
        const scripts = [
            `$http.jsonp(
                '/someUrl?param=123'
            );`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/someUrl?param=123',
                queryString: [
                    {
                        name: 'param',
                        value: '123',
                    }
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
            true
        );
    });
});
