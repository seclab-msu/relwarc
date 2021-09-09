import { makeAndRunSimple } from '../utils/utils';
import * as fs from 'fs';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for formal arg values', () => {
    it('doesn\'t share formalarg values content between different call chains', async () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/formal-args-values.js').toString()
        ];

        const analyzer = makeAndRunSimple(
            scripts,
            true
        );

        const hars = analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/ajax_compare.php?compare_id=23931488&action=remove',
            'httpVersion': 'HTTP/1.1',
            'queryString': [{
                'name': 'compare_id',
                'value': '23931488'
            }, {
                'name': 'action',
                'value': 'remove'
            }]
        }));

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test.com/ajax_compare.php?compare_id=23931488&action=add',
            'httpVersion': 'HTTP/1.1',
            'queryString': [{
                'name': 'compare_id',
                'value': '23931488'
            }, {
                'name': 'action',
                'value': 'add'
            }]
        }));

        expect(hars).not.toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://test.com/ajax-get-filters-values'
        }));
    });

    it('doesn\'t seek for args depend on formal args when ajax call at the global scope', async () => {
        const scripts = [
            `var details = {};
            details.prop1 = "something"
            fp.get(function(e, t) {
                details.prop2 = e;
            })
            $.post('/api', details)`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            true
        );
        const hars = analyzer.hars.map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'POST',
            'url': 'http://test.com/api',
            'httpVersion': 'HTTP/1.1',
            'queryString': [],
            'bodySize': 29,
            'postData': {
                'text': 'prop1=something&prop2=UNKNOWN',
                'mimeType': 'application/x-www-form-urlencoded',
                'params': [
                    {
                        'name': 'prop1',
                        'value': 'something'
                    },
                    {
                        'name': 'prop2',
                        'value': 'UNKNOWN'
                    }
                ]
            }
        }));
    });
});
