import { SinkCall } from '../../../src/analyzer/analyzer';
import { makeAndRunSimple } from '../utils/utils';
import * as fs from 'fs';

describe('Regression test of issue 1225 - analyzer finding XHR request to ampcid.google.com when other XHR request is present', () => {
    it('two DEPs are found and are equal to expected values', function () {
        const scripts = [fs.readFileSync(__dirname + '/../data/sample-xhr-several-1225.js').toString()];

        const analyzer = makeAndRunSimple(scripts, false, 'http://test.com/abcd');
        expect(analyzer.results.length).toEqual(2);
        expect(analyzer.results).toContain({
            'funcName': 'XMLHttpRequest.send',
            'args': [
                {
                    'name': 'open',
                    'args': [
                        'POST',
                        'https://ampcid.google.com/v1/publisher:getClientId?key=AIzaSyA65lEHUEizIsNtlbNo-l2K18dT680nsaM',
                        true
                    ]
                },
                {
                    'name': 'setRequestHeader',
                    'args': [
                        'Content-Type',
                        'text/plain'
                    ]
                },
                {
                    'name': 'send',
                    'args': [
                        '{"originScope":"AMP_ECID_GOOGLE","securityToken":"UNKNOWN"}'
                    ]
                }
            ]
        } as SinkCall);

        expect(analyzer.results).toContain({
            'funcName': 'XMLHttpRequest.send',
            'args': [
                {
                    'name': 'open',
                    'args': [
                        'POST',
                        '/foo',
                        true
                    ]
                },
                {
                    'name': 'send',
                    'args': [
                        'bar'
                    ]
                }
            ]
        } as SinkCall);
    });
});
