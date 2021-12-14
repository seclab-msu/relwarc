import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { testWS } from './webserver'

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for variable scope on the page', () => {
    it('global variable in inline scripts ', async () => {
        const dpa = new DynamicPageAnalyzer();

        const url = testWS.getFullURL('/variable-scope/test-variable-scope1.html');
        await dpa.run(url, true);

        expect(dpa.analyzer.hars.length).toEqual(1);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': testWS.getFullURL('/test?a=1'),
            'queryString': [
                {
                    'name': 'a',
                    'value': '1'
                }
            ],
            'bodySize': 0
        }));
        dpa.close();
    });

    it('global variable in included script', async () => {
        const dpa = new DynamicPageAnalyzer();

        const url = testWS.getFullURL('/variable-scope/test-variable-scope2.html');
        await dpa.run(url, true);

        expect(dpa.analyzer.hars.length).toEqual(1);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': testWS.getFullURL('/test'),
            'queryString': [],
            'bodySize': 0
        }));
        dpa.close();
    });
});
