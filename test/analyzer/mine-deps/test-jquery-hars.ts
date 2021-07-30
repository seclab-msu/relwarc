import { runSingleTestHAR } from '../utils/utils';

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
});
