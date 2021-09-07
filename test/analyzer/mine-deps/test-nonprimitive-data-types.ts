import { runSingleTestHAR } from '../utils/utils';

describe('Tests with nonprimitive data types', () => {
    it('array data in jQuery post', function () {
        const scripts = [
            `const users = ['John', 'Joe', 'Mike'];
            $.post('/add_users', {
                users: users
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/add_users',
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
                        value: '49'
                    }
                ],
                bodySize: 49,
                method: 'POST',
                postData: {
                    text: 'users%5B%5D=John&users%5B%5D=Joe&users%5B%5D=Mike',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'users%5B%5D',
                            value: 'John'
                        },
                        {
                            name: 'users%5B%5D',
                            value: 'Joe'
                        },
                        {
                            name: 'users%5B%5D',
                            value: 'Mike'
                        }
                    ]
                }
            },
        );
    });

    it('array data in jQuery get', function () {
        const scripts = [
            `const users = ['John', 'Joe', 'Mike'];
            $.get('/add_users', {
                users: users
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/add_users?users%5B%5D=John&users%5B%5D=Joe&users%5B%5D=Mike',
                queryString: [{
                    name: 'users%5B%5D',
                    value: 'John'
                }, {
                    name: 'users%5B%5D',
                    value: 'Joe'
                }, {
                    name: 'users%5B%5D',
                    value: 'Mike'
                }],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            },
        );
    });

    it('nested object in jQuery post', function () {
        const scripts = [
            `$.post("/contact", {
                data: {
                    input_name: 'Joe',
                    value: 2,
                    section_id: 12309
                }
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/contact',
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
                        value: '69'
                    }
                ],
                bodySize: 69,
                method: 'POST',
                postData: {
                    text: 'data%5Binput_name%5D=Joe&data%5Bvalue%5D=2&data%5Bsection_id%5D=12309',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'data%5Binput_name%5D',
                            value: 'Joe'
                        },
                        {
                            name: 'data%5Bvalue%5D',
                            value: '2'
                        },
                        {
                            name: 'data%5Bsection_id%5D',
                            value: '12309'
                        }
                    ]
                }
            },
        );
    });

    it('nested object with array in jQuery get', function () {
        const scripts = [
            `$.get("/contact", {
                data: {
                    input_name: 'Joe',
                    value: [2, 3, 4],
                    section_id: 12309
                }
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://test.com/contact?data%5Binput_name%5D=Joe&data%5Bvalue%5D%5B%5D=2&data%5Bvalue%5D%5B%5D=3&data%5Bvalue%5D%5B%5D=4&data%5Bsection_id%5D=12309',
                queryString: [{
                    name: 'data%5Binput_name%5D',
                    value: 'Joe'
                },
                {
                    name: 'data%5Bvalue%5D%5B%5D',
                    value: '2'
                },
                {
                    name: 'data%5Bvalue%5D%5B%5D',
                    value: '3'
                },
                {
                    name: 'data%5Bvalue%5D%5B%5D',
                    value: '4'
                },
                {
                    name: 'data%5Bsection_id%5D',
                    value: '12309'
                }],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            },
        );
    });

    it('nested arrays in jQuery post', function () {
        const scripts = [
            `$.post("/api", {
                ids: [1, 2, 3, [4, 5], [6, 7]]
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/api',
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
                        value: '111'
                    }

                ],
                bodySize: 111,
                method: 'POST',
                postData: {
                    text: 'ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3&ids%5B3%5D%5B%5D=4&ids%5B3%5D%5B%5D=5&ids%5B4%5D%5B%5D=6&ids%5B4%5D%5B%5D=7',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'ids%5B%5D',
                            value: '1'
                        },
                        {
                            name: 'ids%5B%5D',
                            value: '2'
                        },
                        {
                            name: 'ids%5B%5D',
                            value: '3'
                        },
                        {
                            name: 'ids%5B3%5D%5B%5D',
                            value: '4'
                        },
                        {
                            name: 'ids%5B3%5D%5B%5D',
                            value: '5'
                        },
                        {
                            name: 'ids%5B4%5D%5B%5D',
                            value: '6'
                        },
                        {
                            name: 'ids%5B4%5D%5B%5D',
                            value: '7'
                        }
                    ]
                }
            },
        );
    });

    it('array with objects in jQuery post', function () {
        const scripts = [
            `$.post("/api", {
                users: [
                    {
                        "name": "Joe",
                        "liked_posts": [42, 5, 91]
                    },
                    {
                        "name": "John",
                        "liked_posts": [426, 90]
                    }
                ]
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/api',
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
                        value: '249'
                    }

                ],
                bodySize: 249,
                method: 'POST',
                postData: {
                    text: 'users%5B0%5D%5Bname%5D=Joe&users%5B0%5D%5Bliked_posts%5D%5B%5D=42&users%5B0%5D%5Bliked_posts%5D%5B%5D=5&users%5B0%5D%5Bliked_posts%5D%5B%5D=91&users%5B1%5D%5Bname%5D=John&users%5B1%5D%5Bliked_posts%5D%5B%5D=426&users%5B1%5D%5Bliked_posts%5D%5B%5D=90',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'users%5B0%5D%5Bname%5D',
                            value: 'Joe'
                        },
                        {
                            name: 'users%5B0%5D%5Bliked_posts%5D%5B%5D',
                            value: '42'
                        },
                        {
                            name: 'users%5B0%5D%5Bliked_posts%5D%5B%5D',
                            value: '5'
                        },
                        {
                            name: 'users%5B0%5D%5Bliked_posts%5D%5B%5D',
                            value: '91'
                        },
                        {
                            name: 'users%5B1%5D%5Bname%5D',
                            value: 'John'
                        },
                        {
                            name: 'users%5B1%5D%5Bliked_posts%5D%5B%5D',
                            value: '426'
                        },
                        {
                            name: 'users%5B1%5D%5Bliked_posts%5D%5B%5D',
                            value: '90'
                        }
                    ]
                }
            },
        );
    });

    it('nested object with array in jQuery post', function () {
        const scripts = [
            `$.post("/api", {
                data: {
                    roles: {
                        admin: 'Joe',
                        normal_users: {
                            first_user: 'Mike',
                            second_user: 'John'
                        }
                    },
                    ids: {
                        admin: 1,
                        users: [2, 3]
                    },
                    emails: emails
                }
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/api',
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
                        value: '259'
                    }

                ],
                bodySize: 259,
                method: 'POST',
                postData: {
                    text: 'data%5Broles%5D%5Badmin%5D=Joe&data%5Broles%5D%5Bnormal_users%5D%5Bfirst_user%5D=Mike&data%5Broles%5D%5Bnormal_users%5D%5Bsecond_user%5D=John&data%5Bids%5D%5Badmin%5D=1&data%5Bids%5D%5Busers%5D%5B%5D=2&data%5Bids%5D%5Busers%5D%5B%5D=3&data%5Bemails%5D=UNKNOWN',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'data%5Broles%5D%5Badmin%5D',
                            value: 'Joe'
                        },
                        {
                            name: 'data%5Broles%5D%5Bnormal_users%5D%5Bfirst_user%5D',
                            value: 'Mike'
                        },
                        {
                            name: 'data%5Broles%5D%5Bnormal_users%5D%5Bsecond_user%5D',
                            value: 'John'
                        },
                        {
                            name: 'data%5Bids%5D%5Badmin%5D',
                            value: '1'
                        },
                        {
                            name: 'data%5Bids%5D%5Busers%5D%5B%5D',
                            value: '2'
                        },
                        {
                            name: 'data%5Bids%5D%5Busers%5D%5B%5D',
                            value: '3'
                        },
                        {
                            name: 'data%5Bemails%5D',
                            value: 'UNKNOWN'
                        }
                    ]
                }
            },
        );
    });

    it('nested array with UNKNOWN in jQuery post', function () {
        const scripts = [
            `function sendNames(names) {
                $.post("/api", {
                    users: ['John', 'Joe', ['Mike', names]]
                });
            }`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/api',
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
                        value: '83'
                    }

                ],
                bodySize: 83,
                method: 'POST',
                postData: {
                    text: 'users%5B%5D=John&users%5B%5D=Joe&users%5B2%5D%5B%5D=Mike&users%5B2%5D%5B%5D=UNKNOWN',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'users%5B%5D',
                            value: 'John'
                        },
                        {
                            name: 'users%5B%5D',
                            value: 'Joe'
                        },
                        {
                            name: 'users%5B2%5D%5B%5D',
                            value: 'Mike'
                        },
                        {
                            name: 'users%5B2%5D%5B%5D',
                            value: 'UNKNOWN'
                        }
                    ]
                }
            },
        );
    });

    it('nested object with objects array with UNKNOWN element', function () {
        const scripts = [
            `let f;
            users = [
                { user_id: 0, name: 'John' },
                f,
                { user_id: 2, name: 'Joe' },
                { user_id: 3, name: 'Mike'}
              ]
            jQuery.post("/test", {database:users})
            `
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/test',
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
                        value: '207'
                    }

                ],
                bodySize: 207,
                method: 'POST',
                postData: {
                    text: 'database%5B0%5D%5Buser_id%5D=0&database%5B0%5D%5Bname%5D=John&database%5B%5D=UNKNOWN&database%5B2%5D%5Buser_id%5D=2&database%5B2%5D%5Bname%5D=Joe&database%5B3%5D%5Buser_id%5D=3&database%5B3%5D%5Bname%5D=Mike',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            name: 'database%5B0%5D%5Buser_id%5D',
                            value: '0'
                        },
                        {
                            name: 'database%5B0%5D%5Bname%5D',
                            value: 'John'
                        },
                        {
                            name: 'database%5B%5D',
                            value: 'UNKNOWN'
                        },
                        {
                            name: 'database%5B2%5D%5Buser_id%5D',
                            value: '2'
                        },
                        {
                            name: 'database%5B2%5D%5Bname%5D',
                            value: 'Joe'
                        },
                        {
                            name: 'database%5B3%5D%5Buser_id%5D',
                            value: '3'
                        },
                        {
                            name: 'database%5B3%5D%5Bname%5D',
                            value: 'Mike'
                        }
                    ]
                }
            },
        );
    });
});
