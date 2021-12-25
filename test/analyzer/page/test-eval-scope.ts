import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { testWS } from './webserver'

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('eval\'d code collecting', () => {
    it('handles eval scopes propery (as block scopes)', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-eval-scope.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            method: "GET",
            url: testWS.getFullURL("/getPage.php?id=1234567"),
            httpVersion: "HTTP/1.1",
            queryString: [{
                "name": "id",
                "value": "1234567"
            }],    
        }));
        expect(hars).toContain(jasmine.objectContaining({
            method: "GET",
            url: testWS.getFullURL("/getPage.php?id=7654321"),
            httpVersion: "HTTP/1.1",
            queryString: [{
                "name": "id",
                "value": "7654321"
            }],    
        }));
        dpa.close();
    });
});

