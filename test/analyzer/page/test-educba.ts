import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Analyzing DEPs on educba.com', () => {
    it('educba.com', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/educba.com/index.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            method: "POST",
            url: testWS.getFullURL("/educba.com/sel_sub_posi.php"),
            httpVersion: "HTTP/1.1",
            queryString: [],
            bodySize: 13,
            postData: {
                text: "mposi=UNKNOWN",
                mimeType: "application/x-www-form-urlencoded",
                params: [
                    { name: "mposi",value: "UNKNOWN" }
                ]
            }
        }));
        dpa.close();
    });
});

