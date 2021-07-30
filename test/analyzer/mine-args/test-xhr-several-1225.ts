import { runSingleTestSinkCall } from '../utils/utils';
import * as fs from 'fs';

describe('Regression test of issue 1225 - analyzer finding XHR request to ampcid.google.com when other XHR request is present', () => {
    it('two DEPs are found and are equal to expected values', function () {
        const scripts = [fs.readFileSync(__dirname + '/../data/sample-xhr-several-1225.js').toString()];

        runSingleTestSinkCall(
            scripts,
            __dirname + '/../data/args-sample-xhr-several-1225.json',
            'http://test.com/abcd'
        );
    });
});
