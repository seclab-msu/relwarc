import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { testWS } from './webserver'

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Regression tests', () => {
    it('uncommenter with ivalid script for parser', async () => {
        const dpa = new DynamicPageAnalyzer();

        const url = testWS.getFullURL('/test-regression-uncommenter.html');
        await dpa.run(url, true);

        expect(dpa.analyzer.hars.length).toEqual(1);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/test'),
            "queryString": [],
            "bodySize": 0
        }));
        dpa.close();
    });

    it('unsupported regex by firefox', async () => {
        const dpa = new DynamicPageAnalyzer();

        const url = testWS.getFullURL('/test-unsupported-regex.html');
        await dpa.run(url, true);

        expect(dpa.analyzer.hars.length).toEqual(1);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/test'),
            "queryString": [],
            "bodySize": 0
        }));
        dpa.close();
    });
});
