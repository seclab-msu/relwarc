import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Analyzing DEPs from location assignment', () => {
    it('assigning location in event handler', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-replace-location1.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            method: "GET",
            url: testWS.getFullURL("/secure/newAd"),
            httpVersion: "HTTP/1.1",
            queryString: [],    
        }));

        dpa.close();
    });

    it('assigning location in inline script', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-replace-location2.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            method: "GET",
            url: testWS.getFullURL("/test"),
            httpVersion: "HTTP/1.1",
            queryString: [],    
        }));

        dpa.close();
    });
});

