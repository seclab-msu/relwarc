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

    it('process callback as 2-nd $.getScript param properly', function () {
        const scripts = [
            `cb = function() {}
            $.getScript("/misha.html", cb)
            `
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/misha.html',
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

    it('process callback as 2-nd $.get param properly', function () {
        const scripts = [
            `cb = function() {}
            $.get("/misha.html", cb)
            `
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/misha.html',
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

    it('process callback as 2-nd $.post param properly', function () {
        const scripts = [
            `cb = (() => {})
            $.post("/denis.html", cb)
            `
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/denis.html',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        value: '0',
                        name: 'Content-Length'
                    }
                ],
                bodySize: 0,
                postData: {
                    text: ''
                },
                method: 'POST',
            }
        );
    });

    it('process callback as 2-nd $.load param properly', function () {
        const scripts = [
            `cb = (() => {})
            $("body").load("/vitalik.html", cb)
            `
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/vitalik.html',
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

    it('not losing param name if param value is empty array', function () {
        const scripts = [
            `let usernames = [];
            $.ajax({
                url: '/signin',
                type: 'post',
                data: {
                    users: usernames
                }
            });
            `
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/signin',
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
                        value: '19'
                    }
                ],
                bodySize: 19,
                method: 'POST',
                postData: {
                    text: 'users%5B%5D=UNKNOWN',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'users%5B%5D',
                            value: 'UNKNOWN'
                        }
                    ]
                }
            }
        );
    });

    it('get shorthand method with string as data', () => {
        const scripts = [
            `
                username = 'admin';
                $.get('http://example.com/users', 'username=' + username);
            `
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/users?username=admin',
                queryString: [
                    {
                        name: 'username',
                        value: 'admin'
                    }
                ],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            }
        );
    });

    it('work correct with bad args types', function () {
        const scripts = [
            `
            $.get(0);
            $.get('http://example.com', null)
            $.post('http://example.com', undefined)
            $.getJSON('http://example.com/get_script', null)
            $.load('http://example.com/load_script', undefined)
            $.ajax(false);
            $.post(Math.random());
            $.ajax('http://example.com/admin?test=a', null)
            $.ajax('http://example.com/admin?test=a', undefined)
            $.getScript('http://example.com/admin?test=a', null)
            $.getScript('http://example.com/admin?test2=a', undefined)
            `
        ];
        const analyzer = makeAndRunSimple(scripts, true);
        const convertedHars = JSON.parse(JSON.stringify(analyzer.hars));
        expect(convertedHars.length).toEqual(2);
    });

    it('jQuery jsonp post request with callback param in query string', () => {
        const scripts = [
            `$.ajax({
                type: "POST",
                url: "/ajax/checklogin.php?callbackparam=?",
                dataType: "jsonp"
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/ajax/checklogin.php?callbackparam=jQuery111106567430573505544_1591529444128',
                method: 'POST',
                queryString: [{
                    name: 'callbackparam',
                    value: 'jQuery111106567430573505544_1591529444128'
                }],
                headers: [{
                    name: 'Host',
                    value: 'test.com'
                }, {
                    value: '0',
                    name: 'Content-Length',
                }],
                postData: {
                    text: '',
                },
                bodySize: 0
            }
        );
    });

    it('jQuery jsonp request with callback param in query string and settings', () => {
        const scripts = [
            `$.ajax({
                type: "GET",
                url: "/checklogin.php?qqq=?",
                dataType: "jsonp",
                jsonp: "callback"
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/checklogin.php?qqq=jQuery111106567430573505544_1591529444128',
                method: 'GET',
                queryString: [{
                    name: 'qqq',
                    value: 'jQuery111106567430573505544_1591529444128'
                }],
                headers: [{
                    name: 'Host',
                    value: 'test.com'
                }],
                bodySize: 0
            }
        );
    });

    it('jquery request with unknown headers', function () {
        const scripts = [
            `const n = someUnknownFunc();
            $.ajax({
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
});
