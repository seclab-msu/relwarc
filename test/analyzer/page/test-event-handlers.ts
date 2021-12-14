import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { testWS } from './webserver'

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Test with calls in event handlers', () => {
    it('function call in "onclick"', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-event-handler1.html');

        await dpa.run(url);

        expect(dpa.analyzerDEPs.length).toBeGreaterThan(0);

        const hars = dpa.analyzerDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "POST",
            "url": testWS.getFullURL('/login.php'),
            "httpVersion": "HTTP/1.1",
            "queryString": [],
            "bodySize": 30,
            "postData": {
                "text": "login=UNKNOWN&password=UNKNOWN",
                "mimeType": "text/plain"
            }
        }));
        dpa.close();
    });

    it('ajax call in "onkeyup" with argument value from script', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-event-handler2.html');

        await dpa.run(url);

        expect(dpa.analyzerDEPs.length).toBeGreaterThan(0);

        const hars = dpa.analyzerDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/test?a=123'),
            "httpVersion": "HTTP/1.1",
            "queryString": [
                {
                    "name": "a",
                    "value": "123"
                }
            ],
            "bodySize": 0,
        }));
        dpa.close();
    });
});

