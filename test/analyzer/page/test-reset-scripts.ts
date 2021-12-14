import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { testWS } from './webserver'

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Resetting scripts when window is recreated', () => {
    describe('redirect to page', () => {
        it('with duplicate const', async () => {
            const dpa = new DynamicPageAnalyzer();
            const url = testWS.getFullURL('/reset/index.html');

            await dpa.run(url);

            expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

            const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

            expect(hars).toContain(jasmine.objectContaining({
                "method": "GET",
                "url": testWS.getFullURL('/api/main/action.php'),
                "queryString": [],
                "bodySize": 0
            }));
            dpa.close();
        });
        it('with similar called function', async () => {
            const dpa = new DynamicPageAnalyzer();
            const url = testWS.getFullURL('/reset/index2.html');

            await dpa.run(url);

            expect(dpa.analyzer.hars.length).toBe(1);

            const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

            expect(hars).toContain(jasmine.objectContaining({
                "method": "POST",
                "url": testWS.getFullURL('/main/action'),
                "queryString": [],
                "bodySize": 4,
                "postData": {
                    "text": "info"
                }
            }));
            dpa.close();
        });
    });
    describe('reparse caused by meta charset', () => {
        it('with duplicate const', async () => {
            const dpa = new DynamicPageAnalyzer();
            const url = testWS.getFullURL('/reset/reparse-meta.html');

            await dpa.run(url);

            expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

            const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

            expect(hars).toContain(jasmine.objectContaining({
                "method": "GET",
                "url": testWS.getFullURL('/api/base/getinfo.action'),
                "queryString": [],
                "bodySize": 0
            }));
            dpa.close();
        });
        it('with similar called function', async () => {
            const dpa = new DynamicPageAnalyzer();
            const url = testWS.getFullURL('/reset/reparse-meta2.html');

            await dpa.run(url);

            expect(dpa.analyzer.hars.length).toBe(1);

            const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

            expect(hars).toContain(jasmine.objectContaining({
                "method": "GET",
                "url": testWS.getFullURL('/api/base/getinfo.action'),
                "queryString": [],
                "bodySize": 0
            }));
            dpa.close();
        });
    });
});

