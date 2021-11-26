import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Analyzing DEPs on web page', () => {
    it('smoke test', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/smoke.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/testing/test.aspx?p=38'),
            "queryString": [
                {
                    "name": "p",
                    "value": "38"
                }
            ],
            "bodySize": 0
        }));
        dpa.close();
    });

    it('works when page links script with "<script src=..."', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/linkscript.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/test/testing.php?a=3&b=8'),
            "queryString": [
                {
                    "name": "a",
                    "value": "3"
                },
                {
                    "name": "b",
                    "value": "8"
                }
            ],
            "bodySize": 0
        }));
        dpa.close();
    });

    it('works when request info is split between scripts', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/multiple-scripts/page.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/sites/main/api/v1.0/query.cgi?test=tst1&key=0d4d264c32dbafcb51cdd4446c8f454ec4a0adb8c192607b0103126c15c8b38c'),
            "queryString": [
                {
                    "name": "test",
                    "value": "tst1"
                },
                {
                    "name": "key",
                    "value": "0d4d264c32dbafcb51cdd4446c8f454ec4a0adb8c192607b0103126c15c8b38c"
                }
            ],
            "bodySize": 0
        }));
        dpa.close();
    });
});

