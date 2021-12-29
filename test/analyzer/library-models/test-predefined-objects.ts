import { readFileSync } from 'fs';
import * as path from 'path';

import { makeAndRunSimple } from '../utils/utils';

const TEST_DATA_DIR = path.join(__dirname, 'data/');

function getTestFile(name: string): string {
    return readFileSync(path.join(TEST_DATA_DIR, name), 'utf8');
}

describe('Test support for predefined library objects', () => {
    it('Yahoo lib: YAHOO.util.Connect.asyncRequest call', () => {
        const yahooLib = getTestFile('yahoo.js');
        const code = [
            yahooLib,
            `
            function test() {
                YAHOO.util.Connect.asyncRequest('GET', '/foo/bar/test.aspx', () => {}, null);
            }`
        ];
        const analyzer = makeAndRunSimple(code, false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            'funcName': 'XMLHttpRequest.send',
            'args': [
                {
                    'name': 'open',
                    'args': [
                        'GET',
                        '/foo/bar/test.aspx',
                        true
                    ]
                },
                {
                    'name': 'send',
                    'args': [
                        null
                    ]
                }
            ]
        });
    });
});
