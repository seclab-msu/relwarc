import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTestSinkCall } from '../utils';

describe('Tests for Axios library\'s DEPs args', () => {
    it('axios get request as function (without method)', function () {
        const scripts = [
            `axios('/user?id=12');`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios',
                'args': [
                    '/user?id=12'
                ]
            } as SinkCall,
        );
    });

    it('axios get request as function', function () {
        const scripts = [
            `axios({
                method: 'get',
                url: '/user?id=12'
            });`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios',
                'args': [
                    {
                        method: 'get',
                        url: '/user?id=12'
                    }
                ]
            } as SinkCall,
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
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios',
                'args': [
                    {
                        method: 'post',
                        url: '/user/12345',
                        data: {
                            firstName: 'Fred',
                            lastName: 'Flintstone'
                        }
                    }
                ]
            } as SinkCall,
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
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios',
                'args': [
                    {
                        method: 'put',
                        url: '/user/12345',
                        data: {
                            firstName: 'Fred',
                            lastName: 'Flintstone'
                        }
                    }
                ]
            } as SinkCall,
        );
    });

    it('axios get request as object\'s method', function () {
        const scripts = [
            `axios.get('/user?id=12')`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios.get',
                'args': [
                    '/user?id=12'
                ]
            } as SinkCall,
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
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios.post',
                'args': [
                    '/user/12345',
                    {
                        firstName: 'Fred',
                        lastName: 'Flintstone'
                    }
                ]
            } as SinkCall,
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
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios.put',
                'args': [
                    '/user/12345',
                    {
                        firstName: 'Fred',
                        lastName: 'Flintstone'
                    }
                ]
            } as SinkCall,
        );
    });
});
