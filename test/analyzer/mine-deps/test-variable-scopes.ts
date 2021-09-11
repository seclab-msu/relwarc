import { makeAndRunSimple } from '../utils/utils';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Correct work with scopes', () => {
    it('local and global variables with the same name', async () => {
        const scripts = [
            `const a = '/test';
            function p(a) {
                a = "/example";
                fetch(a);
            }
            fetch(a);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(2);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0,
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0
        }));
    });

    it('chemistwarehouse.com.au', async () => {
        const scripts = [
            `function f(window) {};
            var uri = 'https://' + window.location.hostname + '/ssdata_nocache.ashx?callback=?';
            $.getJSON(uri);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'https://test.com/ssdata_nocache.ashx?callback=?',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    'name': 'callback',
                    'value': '?'
                }
            ],
            'bodySize': 0,
        }));
    });

    it('variables with \'var\' in global scope', async () => {
        const scripts = [
            `Data = {};
            url = 'http://test.com/';
            Data.url = url;

            var Data = window.Data;

            function f() {
                $.ajax({
                    dataType: 'JSON',
                    url: Data.url + 'index.php?option=1',
                });
            }`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/index.php?option=1',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    'name': 'option',
                    'value': '1'
                }
            ],
            'bodySize': 0,
        }));
    });

    it('different variable scopes', async () => {
        const scripts = [
            `data = "/test1";
            var data;

            function f() {
                var data = "/test2";
                (function() {
                    var data;
                    data = '/test3';
                    fetch(data);

                    function g(data) {
                        $.ajax(data);
                    };
                    g('/test4');

                })();
                fetch(data);
            }

            fetch(data);`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars.length).toEqual(4);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test1',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0,
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test2',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0,
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test3',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0,
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test4',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0,
        }));
    });
    it('Handles addition assigment operator inside function call, where oldValue is arg', async () => {
        const scripts = [
            `function callAjax1(action,params)
            {    
              params+="&lang="+lang;
              $.ajax({    
                type: "POST",
                url: "http://example.com/"+action,
                data: params,       
              })
            }        
            callAjax1("saveAvatar",'filename=');`,

            `function callAjax2(action,params)
            {    
              params+="&lang="+"SOMETHING_KNOWN";
              $.ajax({    
                type: "POST",
                url: "http://example.com/"+action,
                data: params,       
              })
            }   
            callAjax2("saveAvatar",'filename=');`
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toBeLessThanOrEqual(5);
        console.log(JSON.stringify(hars, null, 4));
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://example.com/saveAvatar',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'postData': {
                'text': 'filename=&lang=UNKNOWN',
                'mimeType': 'application/x-www-form-urlencoded',
                'params': [
                    {
                        'name': 'filename',
                        'value': ''
                    },
                    {
                        'name': 'lang',
                        'value': 'UNKNOWN'
                    }
                ]
            },
            'bodySize': 22
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://example.com/saveAvatar',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'postData': {
                'text': 'filename=&lang=SOMETHING_KNOWN',
                'mimeType': 'application/x-www-form-urlencoded',
                'params': [
                    {
                        'name': 'filename',
                        'value': ''
                    },
                    {
                        'name': 'lang',
                        'value': 'SOMETHING_KNOWN'
                    }
                ]
            },
            'bodySize': 30
        }));
    });
});
