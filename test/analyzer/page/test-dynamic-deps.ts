import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Analyzing Dynamic DEPs', () => {
    it('XHR request', async () => {
        const dpa = new DynamicPageAnalyzer({
            mineDynamicDEPs: true
        });

        const url = testWS.getFullURL('/test-dynamic-dep1.html');

        await dpa.run(url);

        expect(dpa.dynamicDEPs.length).toBeGreaterThan(0);

        const hars = dpa.dynamicDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/example/test?q=enjoy'),
            "queryString": [
                {
                    "name": "q",
                    "value": "enjoy"
                }
            ],
            "bodySize": 0
        }));
        dpa.close();
    });
    it('POST request with rename jQuery', async () => {
        const dpa = new DynamicPageAnalyzer({
            mineDynamicDEPs: true
        });

        const url = testWS.getFullURL('/test-dynamic-dep2.html');

        await dpa.run(url);

        expect(dpa.dynamicDEPs.length).toBeGreaterThan(0);

        const hars = dpa.dynamicDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "POST",
            "url": testWS.getFullURL('/test/test2'),
            "queryString": [],
            "bodySize": 14,
            "postData": {
                "text": "id=1&test=true",
                "mimeType": "application/x-www-form-urlencoded; charset=UTF-8",
                "params": [
                    {
                        "name": "id",
                        "value": "1"
                    },
                    {
                        "name": "test",
                        "value": "true"
                    }
                ]
            }
        }));
        dpa.close();
    });
});
