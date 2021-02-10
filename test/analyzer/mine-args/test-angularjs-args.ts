import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTestSinkCall } from '../utils';

describe('Tests for AngularJS library\'s DEPs args', () => {
    it('$http get request as function', function () {
        const scripts = [
            `$http({
                method: 'GET',
                url: '/someUrl?id=12&param=delete'
            });`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http',
                'args': [
                    {
                        method: 'GET',
                        url: '/someUrl?id=12&param=delete'
                    }
                ]
            } as SinkCall,
        );
    });

    it('$http post request as function', function () {
        const scripts = [
            `$http({
                method: 'POST',
                url: '/someUrl',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: { 'testparam': 'test'}
            });`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http',
                'args': [
                    {
                        method: 'POST',
                        url: '/someUrl',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            'testparam': 'test'
                        }
                    }
                ]
            } as SinkCall,
        );
    });

    it('$http put request as function', function () {
        const scripts = [
            `$http({
                method: 'PUT',
                url: '/someUrl',
                data: { testval: 'value' }
            });`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http',
                'args': [
                    {
                        method: 'PUT',
                        url: '/someUrl',
                        data: { testval: 'value' }
                    }
                ]
            } as SinkCall,
        );
    });

    it('$http jsonp request as function', function () {
        const scripts = [
            `$http({
                method: 'JSONP',
                url: '/someUrl?param=1234'
            });`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http',
                'args': [
                    {
                        method: 'JSONP',
                        url: '/someUrl?param=1234'
                    }
                ]
            } as SinkCall,
        );
    });

    it('$http get request as object\'s method', function () {
        const scripts = [
            `$http.get(
                '/someUrl?param=123',
                {
                    headers: {
                        'name': 'X-Auth-Tok',
                        'value': '5fc2de39242922efd3'
                    }
                }
            );`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http.get',
                'args': [
                    '/someUrl?param=123',
                    {
                        headers: {
                            'name': 'X-Auth-Tok',
                            'value': '5fc2de39242922efd3'
                        }
                    }
                ]
            } as SinkCall,
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
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http.post',
                'args': [
                    '/someUrl',
                    {
                        'name': 'username',
                        'value': 'Name'
                    }
                ]
            } as SinkCall,
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
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http.put',
                'args': [
                    '/someUrl',
                    {
                        'name': 'username',
                        'value': 'Name'
                    }
                ]
            } as SinkCall,
        );
    });

    it('$http jsonp request as object\'s method', function () {
        const scripts = [
            `$http.jsonp(
                '/someUrl?param=value'
            );`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http.jsonp',
                'args': [
                    '/someUrl?param=value'
                ]
            } as SinkCall,
        );
    });
});
