import { makeAndRunSimple } from '../utils/utils';
import * as fs from 'fs';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for DEPs location in JS files', () => {
    it('Simple javascript file', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/dep-location.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 0,
            'initiator': {
                'type': 'analyzer',
                'lineNumber': 2,
                'columnNumber': 8
            }
        }));
    });
});
