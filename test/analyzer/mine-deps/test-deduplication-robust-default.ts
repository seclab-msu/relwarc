import { deduplicateDEPs } from '../../../src/analyzer/comparison-deps';
import { makeAndRunSimple } from '../utils/utils';

import * as fs from 'fs';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for default comparison hars', () => {
    it('hars with numeric values', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication8.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(analyzer.hars, 'default').map(JSONObjectFromHAR);
        expect(hars.length).toEqual(1);
    });

    it('hars with unknown and numeric values', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication9.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(analyzer.hars, 'default').map(JSONObjectFromHAR);
        expect(hars.length).toEqual(1);
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example/test.php?r=test&a=123&c=789',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'r',
                    value: 'test'
                },
                {
                    name: 'a',
                    value: '123'
                },
                {
                    name: 'c',
                    value: '789'
                }
            ],
            'bodySize': 0
        }));
    });

    it('different types of param value', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication10.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = deduplicateDEPs(analyzer.hars, 'default').map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(analyzer.hars, 'extended').map(JSONObjectFromHAR);
        expect(hars.length).toEqual(1);
    });
});
