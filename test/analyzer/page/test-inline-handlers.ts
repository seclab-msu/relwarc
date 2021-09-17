import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('retrieve code from inline event handlers', () => {
    it('handles their scopes properly', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-inline-handlers.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            method: "GET",
            url: testWS.getFullURL("/api"),
            httpVersion: "HTTP/1.1",
            queryString: [],    
        }));
        dpa.close();
    });
});