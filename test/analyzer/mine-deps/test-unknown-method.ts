import { runSingleTestHAR } from '../utils/utils';

describe('Tests to check the correct work with UNKNOWN method', () => {
    it('jquery library', () => {
        const scripts = [
            `$.ajax({
                method: unknown,
                url: '/test/data'
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/test/data',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Length',
                        value: '0',
                    }
                ],
                bodySize: 0,
                method: 'UNKNOWN',
                postData: {
                    text: ''
                }
            }
        );
    });
    it('axios library', () => {
        const scripts = [
            `axios({
                method: unknown,
                url: '/test/data',
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/test/data',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Length',
                        value: '0',
                    }
                ],
                bodySize: 0,
                method: 'UNKNOWN',
                postData: {
                    text: ''
                }
            }
        );
    });
    it('angularjs library', () => {
        const scripts = [
            `$http({
                method: unknown,
                url: '/test/data',
            });`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://test.com/test/data',
                queryString: [],
                headers: [
                    {
                        value: 'test.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Length',
                        value: '0',
                    }
                ],
                bodySize: 0,
                method: 'UNKNOWN',
                postData: {
                    text: ''
                }
            }
        );
    });
});
