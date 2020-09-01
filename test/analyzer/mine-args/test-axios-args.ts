import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTest } from '../run-tests-helper';

describe('Tests for Axios library\'s DEPs args', () => {
    it('axios get request as function (without method)', function () {
        const scripts = [
            `axios('/user?id=12');`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': 'axios',
                'args': [
                    '/user?id=12'
                ]
            } as SinkCall,
            false
        );
    });

    it('axios get request as function', function () {
        const scripts = [
            `axios({
                method: 'get',
                url: '/user?id=12'
            });`
        ];
        runSingleTest(
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
            false
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
        runSingleTest(
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
            false
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
        runSingleTest(
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
            false
        );
    });

    it('axios get request as object\'s method', function () {
        const scripts = [
            `axios.get('/user?id=12')`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': 'axios.get',
                'args': [
                    '/user?id=12'
                ]
            } as SinkCall,
            false
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
        runSingleTest(
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
            false
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
        runSingleTest(
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
            false
        );
    });
});
