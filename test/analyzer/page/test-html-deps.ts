import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { testWS } from './webserver'

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
        dpa.close();
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
        dpa.close();
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
        dpa.close();
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
        dpa.close();
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
        dpa.close();
    });

    it('simple form POST request', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep6.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "POST",
            "url": testWS.getFullURL('/application/eihoS4/interface/zee5Ii/handle'),
            "httpVersion": "HTTP/1.1",
            "queryString": [],
            "bodySize": 7,
            "postData": {
                "text": "ae9ieC=",
                "mimeType": "application/x-www-form-urlencoded",
                "params": [
                    {
                        "name": "ae9ieC",
                        "value": "",
                        "type": "text"
                    }
                ]
            }
        }));
        dpa.close();
    });

    it('form POST request with multiple params', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep7.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "POST",
            "url": testWS.getFullURL('/application/asdfds/interface/dsads/handle'),
            "httpVersion": "HTTP/1.1",
            "queryString": [],
            "bodySize": 31,
            "postData": {
                "text": "password=&tag=default&username=",
                "mimeType": "application/x-www-form-urlencoded",
                "params": [
                    {
                        "name": "password",
                        "value": "",
                        "type": "text"
                    },
                    {
                        "name": "tag",
                        "value": "default",
                        "type": "text"
                    },
                    {
                        "name": "username",
                        "value": "",
                        "type": "text"
                    }
                ]
            }
        }));
        dpa.close();
    });

    it('multipart form POST request', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep8.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "POST",
            "url": testWS.getFullURL('/application/m1nk1l/interface/1l23nl/handle'),
            "httpVersion": "HTTP/1.1",
            "queryString": [],
            "bodySize": 42,
            "postData": {
                "text": null,
                "mimeType": "multipart/form-data",
                "params": [
                    {
                        "name": "password",
                        "value": "random",
                        "type": "text"
                    },
                    {
                        "name": "tag",
                        "value": "default",
                        "type": "text"
                    },
                    {
                        "name": "username",
                        "value": "admin",
                        "type": "text"
                    }
                ]
            }
        }));
        dpa.close();
    });

    it('form POST request with input type "password"', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-html-dep9.html');

        await dpa.run(url);

        expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

        const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "POST",
            "url": testWS.getFullURL('/user/login'),
            "httpVersion": "HTTP/1.1",
            "queryString": [],
            "bodySize": 11,
            "postData": {
                "text": "user=&pswd=",
                "mimeType": "application/x-www-form-urlencoded",
                "params": [{
                    "name": "user",
                    "value": "",
                    "type": "text"
                }, {
                    "name": "pswd",
                    "value": "",
                    "type": "password"
                }]
            }
        }));
        dpa.close();
    });

    describe('form action clobbered', () => {
        it('clobbered by input', async () => {
            const dpa = new DynamicPageAnalyzer();
            const url = testWS.getFullURL('/test-html-dep-clobbered-form-action.html');

            await dpa.run(url);

            expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

            const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

            expect(hars).toContain(jasmine.objectContaining({
                "method": "POST",
                "url": testWS.getFullURL('/user/login'),
                "httpVersion": "HTTP/1.1",
                "queryString": [],
                "bodySize": 19,
                "postData": {
                    "text": "action=abc&test=123",
                    "mimeType": "application/x-www-form-urlencoded",
                    "params": [{
                        "name": "action",
                        "value": "abc",
                        "type": "text"
                    }, {
                        "name": "test",
                        "value": "123",
                        "type": "text"
                    }]
                }
            }));
            dpa.close();
        });
        it('clobbered by input, with base tag', async () => {
            const dpa = new DynamicPageAnalyzer();
            const url = testWS.getFullURL('/test-html-dep-clobbered-form-action-with-base.html');

            await dpa.run(url);

            expect(dpa.htmlDEPs.length).toBeGreaterThan(0);

            const hars = dpa.htmlDEPs.map(JSONObjectFromHAR);

            expect(hars).toContain(jasmine.objectContaining({
                "method": "POST",
                "url": testWS.getFullURL('/aaa/bbb/foo/bar'),
                "httpVersion": "HTTP/1.1",
                "queryString": [],
                "bodySize": 19,
                "postData": {
                    "text": "action=abc&test=123",
                    "mimeType": "application/x-www-form-urlencoded",
                    "params": [{
                        "name": "action",
                        "value": "abc",
                        "type": "text"
                    }, {
                        "name": "test",
                        "value": "123",
                        "type": "text"
                    }]
                }
            }));
            dpa.close();
        });
    });
});

