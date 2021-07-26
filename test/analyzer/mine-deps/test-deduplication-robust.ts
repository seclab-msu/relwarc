import { deduplicateDEPs } from '../../../src/analyzer/comparison-deps';
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

        hars = deduplicateDEPs(analyzer.hars, true).map(JSONObjectFromHAR);
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

        hars = deduplicateDEPs(analyzer.hars, true).map(JSONObjectFromHAR);
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

        hars = deduplicateDEPs(analyzer.hars, true).map(JSONObjectFromHAR);
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

        hars = deduplicateDEPs(analyzer.hars, true).map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);
    });

    it('different values of important params', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication5.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        let hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        hars = deduplicateDEPs(analyzer.hars, true).map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test?route=test',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'route',
                    value: 'test'
                }
            ],
            'bodySize': 0
        }));
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/test?route=example',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'route',
                    value: 'example'
                }
            ],
            'bodySize': 0
        }));
    });

    it('routing param "r"', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication6.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(analyzer.hars, true).map(JSONObjectFromHAR);
        expect(hars.length).toEqual(2);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/auto/index.php?r=/order/test&pserid=4907',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'r',
                    value: '/order/test'
                },
                {
                    name: 'pserid',
                    value: '4907'
                }
            ],
            'bodySize': 0
        }));
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/auto/index.php?r=%2Ftest%2Fexample&pserid=4907',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'r',
                    value: '%2Ftest%2Fexample'
                },
                {
                    name: 'pserid',
                    value: '4907'
                }
            ],
            'bodySize': 0
        }));
    });

    it('simple param "r"', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/test-deduplication7.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = deduplicateDEPs(analyzer.hars, true).map(JSONObjectFromHAR);
        expect(hars.length).toEqual(1);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/auto/index.php?r=testing&pserid=4907',
            'httpVersion': 'HTTP/1.1',
            'queryString': [
                {
                    name: 'r',
                    value: 'testing'
                },
                {
                    name: 'pserid',
                    value: '4907'
                }
            ],
            'bodySize': 0
        }));
    });
});
