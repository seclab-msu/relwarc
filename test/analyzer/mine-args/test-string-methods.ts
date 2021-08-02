import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTestSinkCall } from '../utils/utils';

import * as fs from 'fs';

describe('Analyzer processes args came from String.prototype methods', () => {
    it('works with String.prototype.concat chain with dynamically computed attributes', function () {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-string-methods-1.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios.get',
                'args': ['http://bestpetshop.com/search?pet=dog&name=Bobik']
            } as SinkCall,
        );
    });
    it('works with String.prototype.concat', function () {
        const scripts = [
            `let query = 'dogs';
            $http.get('http://bestpetshop.com/api/search?query='.concat(query))`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$http.get',
                'args': ['http://bestpetshop.com/api/search?query=dogs']
            } as SinkCall,
        );
    });
    it('works with String.prototype.concat with unknown argument', function () {
        const scripts = [
            `function f(x) {
                axios.get("https://support.freshbooks.com/api/v2/search.json?query=".concat(x));
            }`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'axios.get',
                'args': ['https://support.freshbooks.com/api/v2/search.json?query=UNKNOWN']
            } as SinkCall,
        );
    });
});