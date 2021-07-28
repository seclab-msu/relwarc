import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTestSinkCall } from '../utils/utils';

describe('Test for right assignment computing in global scope', () => {
    it('didn\'t process global assignment second time', function () {
        const scripts = [
            `const version = 2;
            let base = 'http://haudasudhaks.com';
            let url = '';
            url = url + base + '/api' + '/v' + version;
            axios.post(url, 'Handshake');`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios.post',
                'args': [
                    'http://haudasudhaks.com/api/v2',
                    'Handshake'
                ]
            } as SinkCall,
        );
    });
});
