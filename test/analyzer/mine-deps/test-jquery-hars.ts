import { runSingleTestHAR, makeAndRunSimple } from '../utils/utils';

describe('Tests for jQuery library hars', () => {
    it('jQuery post request with settings', function () {
        const scripts = [
            `$.post({
                url: "/admin",
                data: {
                    name: "admin",
                    id: "123"
                }
            })`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/admin',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    },
                    {
                        name: 'Content-Length',
                        value: '17'
                    }
                ],
                bodySize: 17,
                method: 'POST',
                postData: {
                    text: 'name=admin&id=123',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'name',
                            value: 'admin'
                        },
                        {
                            name: 'id',
                            value: '123'
                        }
                    ]
                },
            },
        );
    });

    it('jQuery post request with data as object', function () {
        const scripts = [
            `$.post('/admin', {
                name: 'admin',
                id: '123'
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/admin',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    },
                    {
                        name: 'Content-Length',
                        value: '17'
                    }
                ],
                bodySize: 17,
                method: 'POST',
                postData: {
                    text: 'name=admin&id=123',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'name',
                            value: 'admin'
                        },
                        {
                            name: 'id',
                            value: '123'
                        }
                    ]
                },
            },
        );
    });

    it('jQuery post request with data as string', function () {
        const scripts = [
            `$.post('/admin', 'name=admin&id=123');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/admin',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    },
                    {
                        name: 'Content-Length',
                        value: '17'
                    }
                ],
                bodySize: 17,
                method: 'POST',
                postData: {
                    text: 'name=admin&id=123',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'name',
                            value: 'admin'
                        },
                        {
                            name: 'id',
                            value: '123'
                        }
                    ]
                },
            },
        );
    });

    it('"headers" in $.ajax options', function () {
        const scripts = [
            `$.ajax({
                url: "/admin",
                headers: {
                    "testHeader": "test1"
                }
            })`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/admin',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        name: 'testHeader',
                        value: 'test1'
                    }
                ],
                bodySize: 0,
                method: 'GET',
            }
        );
    });

    it('deduplicate "Content-Type" header', function () {
        const scripts = [
            `$.post({
                url: "/admin",
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    "test": "data"
                }
            })`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/admin',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/json'
                    },
                    {
                        name: 'Content-Length',
                        value: '9'
                    }
                ],
                bodySize: 9,
                method: 'POST',
                postData: {
                    text: 'test=data',
                    mimeType: 'application/json'
                }
            }
        );
    });

    it('process callback as 2-nd getJSON param properly', function () {
        const scripts = [
            `cb = function() {}
            $.getJSON("/andrey", cb)
            `
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/andrey',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET',
            }
        );
    });

    it('processes null/undefined ajax args properly', function () {
        const scripts = [
            `let url1 = {a:3}; $.ajax(url1.b);
            let url2; $.ajax(url2);
            let url3 = null; $.ajax(url3);
            let url4 = undefined;$.ajax(url4);
            `
        ];
        const url = 'http://test.com/test';
        const analyzer = makeAndRunSimple(scripts, true, url);
        const convertedHars = JSON.parse(JSON.stringify(analyzer.hars));
        expect(convertedHars).toEqual([]);
    });

    it('handles null and undefined URLs', function () {
        const scripts = [
            `$.post({
                url: null,
                data: {
                    "test": "data"
                }
            })`,
            `$.post({
                url: undefined,
                data: {
                    "test": "data"
                }
            })`
        ];
        const analyzer = makeAndRunSimple(scripts, true);
        expect(analyzer.hars).toEqual([]);
    });
});
