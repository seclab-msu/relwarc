import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('retrieve code from new Function constructor', () => {
    it('handles new Function scopes properly', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-new-function.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            method: "GET",
            url: testWS.getFullURL("/api/v2?action=logout"),
            httpVersion: "HTTP/1.1",
            queryString: [{
                "name": "action",
                "value": "logout"
            }],    
        }));
        dpa.close();
    });
});

