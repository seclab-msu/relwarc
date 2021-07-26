import { deduplicateDEPs } from '../../../src/analyzer/comparsion-deps';
import { makeAndRunSimple } from '../utils/utils';

import * as fs from 'fs';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for comparison library', () => {
    it('unknown and defined param value in two calls', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication1.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(analyzer.hars).map(JSONObjectFromHAR);
        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/testing/test?a=123',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    'name': 'a',
                    'value': '123'
                }
            ],
            'bodySize': 0,
        }));
    });

    it('param values are defined in two calls', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication2.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(analyzer.hars).map(JSONObjectFromHAR);
        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://test.com/example/test.aspx',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 17,
            'postData': {
                text: 'name=admin&id=123',
                mimeType: 'application/x-www-form-urlencoded',
                params: [
                    {
                        name: 'name',
                        value: 'admin'
                    },
                    {
                        name: 'id',
                        value: '123'
                    }
                ]
            }
        }));
    });

    it('param values are defined in three calls', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication3.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(3);

        hars = deduplicateDEPs(analyzer.hars).map(JSONObjectFromHAR);
        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/example?a=1&b=test&c=3',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'a',
                    value: '1'
                },
                {
                    name: 'b',
                    value: 'test'
                },
                {
                    name: 'c',
                    value: '3'
                }
            ],
            'bodySize': 0
        }));
    });

    it('different content-type in calls', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication4.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(analyzer.hars).map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);
    });
});
