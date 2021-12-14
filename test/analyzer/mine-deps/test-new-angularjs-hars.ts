import { runSingleTestHAR } from '../utils/utils';


describe('Tests for new AngularJS library\'s DEPs hars', () => {
    it('http.request get with HttpRequest as argument without params', function () {
        const scripts = [
            `const req = new HttpRequest('GET', '/someUrl') 
            this.http.request(req);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'GET',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    xit('http.request get with HttpRequest as argument with params', function () {
        const scripts = [
            `const par = new HttpParams().set('test', '1');
            const req = new HttpRequest('GET', '/someUrl', {params: par}); 
            this.http.request(req);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl?test=1',
                method: 'GET',
                queryString: [{
                    value: 'test',
                    name: '1',
                }],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('http.request post with HttpRequest as argument with text body', function () {
        const scripts = [
            `const body = 'params=1'
            const req = new HttpRequest('POST', '/someUrl', body); 
            this.http.request(req);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'POST',
                queryString: [],
                headers: [{
                    name: 'Host',
                    value: 'test.com'
                }, {
                    name: 'Content-Type',
                    value: 'text/plain'
                }, {
                    name: 'Content-Length',
                    value: '8'
                }],
                postData: {
                    text: 'params=1',
                    mimeType: 'text/plain'
                },
                bodySize: 8
            },
        );
    });

    it('http.request post with HttpRequest as argument with json body', function () {
        const scripts = [
            `const body = {"params": "1"};
            const req = new HttpRequest('POST', '/someUrl', body); 
            this.http.request(req);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'POST',
                queryString: [],
                headers: [{
                    name: 'Host',
                    value: 'test.com'
                }, {
                    name: 'Content-Type',
                    value: 'application/json'
                }, {
                    name: 'Content-Length',
                    value: '14'
                }],
                postData: {
                    text: '{"params":"1"}',
                    mimeType: 'application/json'
                },
                bodySize: 14
            },
        );
    });

    it('http.delete request as object\'s method', function () {
        const scripts = [
            `this.http.delete('/someUrl');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'DELETE',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('http.get request as object\'s method', function () {
        const scripts = [
            `this.http.get('/someUrl');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'GET',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('http.get request as object\'s method with headers', function () { // надо проверить заголовки
        const scripts = [
            `
            this.http.get('/someUrl');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'GET',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('http.head request as object\'s method', function () {
        const scripts = [
            `this.http.head('/someUrl');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'HEAD',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('http.head request as object\'s method', function () {
        const scripts = [
            `this.http.options('/someUrl');`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'OPTIONS',
                queryString: [],
                headers: [{
                    value: 'test.com',
                    name: 'Host',
                }],
                bodySize: 0
            },
        );
    });

    it('http.patch request as object\'s method with json body', function () {
        const scripts = [
            `this.http.patch('/someUrl', {"params": 1});`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'PATCH',
                queryString: [],
                headers: [{
                    name: 'Host',
                    value: 'test.com'
                }, {
                    name: 'Content-Type',
                    value: 'application/json'
                }, {
                    name: 'Content-Length',
                    value: '12'
                }],
                postData: {
                    text: '{"params":1}',
                    mimeType: 'application/json'
                },
                bodySize: 12
            },
        );
    });

    it('http.post request as object\'s method with text body', function () {
        const scripts = [
            `this.http.post('/someUrl', "params=1");`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'POST',
                queryString: [],
                headers: [{
                    name: 'Host',
                    value: 'test.com'
                }, {
                    name: 'Content-Type',
                    value: 'text/plain'
                }, {
                    name: 'Content-Length',
                    value: '8'
                }],
                postData: {
                    text: 'params=1',
                    mimeType: 'text/plain'
                },
                bodySize: 8
            },
        );
    });

    xit('http.put request as object\'s method', function () {
        const scripts = [
            `const body = new HttpParams().set('params', '1')
            this.http.post('/someUrl', body);`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/someUrl',
                method: 'POST',
                queryString: [],
                headers: [{
                    name: 'Host',
                    value: 'test.com'
                }, {
                    name: 'Content-Type',
                    value: 'application/x-www-form-urlencoded'
                }, {
                    name: 'Content-Length',
                    value: '8'
                }],
                postData: {
                    text: 'params=1',
                    mimeType: 'application/x-www-form-urlencoded'
                },
                bodySize: 8
            },
        );
    });
});
