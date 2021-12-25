import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { testWS } from './webserver'

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Handling of <base> tag', () => {
    it('Works with jQuery', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-jquery-base-tag.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": "http://api.example.com/index.php?route=cart",
        }));
        dpa.close();
    });

    it('Works with Axios', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-axios-base-tag.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": "http://api.example.com/index.php?route=product/23/overview",
        }));
        dpa.close();
    });
    it('Works with AngularJS', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-angular-base-tag.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": "http://api.example.com/index.php?route=cart/checkout",
        }));
        dpa.close();
    });
    it('Works with XMLHttpRequest', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-xhr-base-tag.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "POST",
            "url": "http://api.example.com/index.php?route=user/logout",
        }));
        dpa.close();
    });
    it('Works with base tag without trailing slash in URL', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-base-tag-no-trailing-slash.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/kek/index.php?route=tovary/1633'),
        }));
        dpa.close();
    });
    it('Works with relative base', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/basetag-testdir/test-rel-base-tag.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/basetag-testdir/kek/lol/index.php?route=tovary/1633'),
        }));
        dpa.close();
    });
    it('Works with absolute urls', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-abs-req-base-tag.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/index.php?route=tovary/sale'),
        }));
        dpa.close();
    });
    it('Computes document.location properly', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-doc-loc-base-tag.html');

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": testWS.getFullURL('/index.php?route=tovary/russia'),
        }));
        dpa.close();
    });
});

