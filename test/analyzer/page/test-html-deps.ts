import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Analyzing HTML DEPs', () => {
    it('"a" tag, 1 param test', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep1.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/application/l1ct6x/interface/p6tpft/handle?gh4gg34=1'),
            "queryString": [
                {
                    "name": "gh4gg34",
                    "value": "1"
                }
            ],
            "bodySize": 0
        }));
    });

    it('GET form, 1 param test', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep2.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/application/eihoS4/interface/zee5Ii/handle?ae9ieC='),
            "httpVersion": 'HTTP/1.1',
            "queryString": [
                {
                    "name": "ae9ieC",
                    "value": ""
                }
            ],
            "bodySize": 0
        }));
    });

    it('GET form, 2 params test', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep3.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/register.php?username=&password='),
            "queryString": [
                {
                    "name": "username",
                    "value": ""
                },
                {
                    "name": "password",
                    "value": ""
                }
            ],
            "bodySize": 0
        }));
    });

    it('GET form with inintial value of param', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep4.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/act/proc.aspx?data=&tada=adat'),
            "queryString": [
                {
                    "name": "data",
                    "value": ""
                },
                {
                    "name": "tada",
                    "value": "adat"
                }
            ],
            "bodySize": 0
        }));
    });

    it('"a" tag with hex encoded href', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep5.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/actions/getuserinfo/28/full?id=1'),
            "queryString": [
                {
                    "name": "id",
                    "value": "1"
                }
            ],
            "bodySize": 0
        }));
    });
});

