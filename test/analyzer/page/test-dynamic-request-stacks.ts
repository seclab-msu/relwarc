import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';

import { BackendKind, currentBackend } from '../../../src/backend';

import { testWS } from './webserver'

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Stacks of JS requests seen in dynamic are found when', () => {
    function wwwURL(filename) {
        return testWS.getFullURL('/dynamic-request-stacks/' + filename);
    }
    it('request was made with fetch', async () => {
        const dpa = new DynamicPageAnalyzer({recordRequestStackTraces: true});
        const url = wwwURL('with-fetch.html');

        await dpa.run(url);

        const deps = dpa.dynamicDEPs;

        expect(deps.length).toBeGreaterThan(0);

        const hars = deps.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "initiator": {
                "type": "fetch",
                "stack": [
                    jasmine.objectContaining({
                        "name": "f",
                        "lineNumber": 7,
                        "columnNumber": 12,
                        "pretty": `f@${url}:8:13`,
                        "fileURI": url
                    }),
                    jasmine.objectContaining({
                        "name": "g",
                        "lineNumber": 10,
                        "columnNumber": 12,
                        "pretty": `g@${url}:11:13`,
                        "fileURI": url
                    }),
                    jasmine.objectContaining({
                        "name": null,
                        "lineNumber": 12,
                        "columnNumber": 8,
                        "pretty": `@${url}:13:9`,
                        "fileURI": url
                    })
                ]
            }
        }));
        dpa.close();
    });
    it('request was made with XMLHttpRequest', async () => {
        const dpa = new DynamicPageAnalyzer({recordRequestStackTraces: true});
        const url = wwwURL('with-xhr.html');

        await dpa.run(url);

        const deps = dpa.dynamicDEPs;

        expect(deps.length).toBeGreaterThan(0);

        const hars = deps.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "initiator": {
                "type": "xhr",
                "stack": [
                    jasmine.objectContaining({
                        "name": "f",
                        "lineNumber": 9,
                        "columnNumber": jasmine.stringMatching('1[2-8]'),
                        "pretty": jasmine.stringMatching(`f@${url}:10:1[3-9]`),
                        "fileURI": url
                    }),
                    jasmine.objectContaining({
                        "name": null,
                        "lineNumber": 11,
                        "columnNumber": 8,
                        "pretty": `@${url}:12:9`,
                        "fileURI": url
                    })
                ]
            }
        }));
        dpa.close();
    });
    it('call stack grows from event handler', async () => {
        const dpa = new DynamicPageAnalyzer({recordRequestStackTraces: true});
        const url = wwwURL('onload.html');

        await dpa.run(url);

        const deps = dpa.dynamicDEPs;

        expect(deps.length).toBeGreaterThan(0);

        const hars = deps.map(JSONObjectFromHAR);

        let lineNumber = 17;
        let columnNumber = 20;

        if (currentBackend === BackendKind.SlimerJS) { // because slimer gives position in the handler
            lineNumber = 0;
            columnNumber = 0;
        }

        expect(hars).toContain(jasmine.objectContaining({
            "initiator": {
                "type": "fetch",
                "stack": [
                    jasmine.objectContaining({
                        "name": "f",
                        "lineNumber": 7,
                        "columnNumber": 12,
                        "pretty": `f@${url}:8:13`,
                        "fileURI": url
                    }),
                    jasmine.objectContaining({
                        "name": "g",
                        "lineNumber": 10,
                        "columnNumber": 12,
                        "pretty": `g@${url}:11:13`,
                        "fileURI": url
                    }),
                    jasmine.objectContaining({
                        "name": "onload",
                        "lineNumber": lineNumber,
                        "columnNumber": columnNumber,
                        "pretty": `onload@${url}:${lineNumber+1}:${columnNumber+1}`,
                        "fileURI": url
                    })
                ]
            }
        }));
        dpa.close();
    });
    it('request is made from js file linked by script src', async () => {
        const dpa = new DynamicPageAnalyzer({recordRequestStackTraces: true});
        const url = wwwURL('extscript.html');

        await dpa.run(url);

        const deps = dpa.dynamicDEPs;

        expect(deps.length).toBeGreaterThan(0);

        const hars = deps.map(JSONObjectFromHAR);

        const scriptURL = wwwURL('script.js');

        expect(hars).toContain(jasmine.objectContaining({
            "initiator": {
                "type": "fetch",
                "stack": [
                    jasmine.objectContaining({
                        "name": "abcd",
                        "lineNumber": 1,
                        "columnNumber": 4,
                        "pretty": `abcd@${scriptURL}:2:5`,
                        "fileURI": scriptURL
                    }),
                    jasmine.objectContaining({
                        "name": "efgh",
                        "lineNumber": 5,
                        "columnNumber": 4,
                        "pretty": `efgh@${scriptURL}:6:5`,
                        "fileURI": scriptURL
                    }),
                    jasmine.objectContaining({
                        "name": "f",
                        "lineNumber": 9,
                        "columnNumber": 4,
                        "pretty": `f@${scriptURL}:10:5`,
                        "fileURI": scriptURL
                    }),
                    jasmine.objectContaining({
                        "name": null,
                        "lineNumber": 7,
                        "columnNumber": 8,
                        "pretty": `@${url}:8:9`,
                        "fileURI": url
                    })
                ]
            }
        }));
        dpa.close();
    });
    it('html code is minified into one line', async () => {
        const dpa = new DynamicPageAnalyzer({recordRequestStackTraces: true});
        const url = wwwURL('oneline.html');

        await dpa.run(url);

        const deps = dpa.dynamicDEPs;

        expect(deps.length).toBeGreaterThan(0);

        const hars = deps.map(JSONObjectFromHAR);

        let columnNumber1 = 15;
        let columnNumber2 = 44;

        expect(hars).toContain(jasmine.objectContaining({
            "initiator": {
                "type": "fetch",
                "stack": [
                    jasmine.objectContaining({
                        "name": "f",
                        "lineNumber": 0,
                        "columnNumber": columnNumber1,
                        "pretty": `f@${url}:1:${columnNumber1+1}`,
                        "fileURI": url
                    }),
                    jasmine.objectContaining({
                        "name": null,
                        "lineNumber": 0,
                        "columnNumber": columnNumber2,
                        "pretty": `@${url}:1:${columnNumber2+1}`,
                        "fileURI": url
                    })
                ]
            }
        }));
        dpa.close();
    });
});

