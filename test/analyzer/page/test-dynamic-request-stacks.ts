import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

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
                    {
                        "name": "f",
                        "lineNumber": 7,
                        "columnNumber": 12,
                        "sourceLine": "",
                        "pretty": `f@${url}:8:13`,
                        "fileURI": url
                    },
                    {
                        "name": "g",
                        "lineNumber": 10,
                        "columnNumber": 12,
                        "sourceLine": "",
                        "pretty": `g@${url}:11:13`,
                        "fileURI": url
                    },
                    {
                        "name": null,
                        "lineNumber": 12,
                        "columnNumber": 8,
                        "sourceLine": "",
                        "pretty": `@${url}:13:9`,
                        "fileURI": url
                    }
                ]
            }
        }));
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
                    {
                        "name": "f",
                        "lineNumber": 9,
                        "columnNumber": 12,
                        "sourceLine": "",
                        "pretty": `f@${url}:10:13`,
                        "fileURI": url
                    },
                    {
                        "name": null,
                        "lineNumber": 11,
                        "columnNumber": 8,
                        "sourceLine": "",
                        "pretty": `@${url}:12:9`,
                        "fileURI": url
                    }
                ]
            }
        }));
    });
    it('call stack grows from event handler', async () => {
        const dpa = new DynamicPageAnalyzer({recordRequestStackTraces: true});
        const url = wwwURL('onload.html');

        await dpa.run(url);

        const deps = dpa.dynamicDEPs;

        expect(deps.length).toBeGreaterThan(0);

        const hars = deps.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "initiator": {
                "type": "fetch",
                "stack": [{
                    "name": "f",
                    "lineNumber": 7,
                    "columnNumber": 12,
                    "sourceLine": "",
                    "pretty": `f@${url}:8:13`,
                    "fileURI": url
                }, {
                    "name": "g",
                    "lineNumber": 10,
                    "columnNumber": 12,
                    "sourceLine": "",
                    "pretty": `g@${url}:11:13`,
                    "fileURI": url
                }, {
                    "name": "onload",
                    "lineNumber": 0,
                    "columnNumber": 0,
                    "sourceLine": "",
                    "pretty": `onload@${url}:1:1`,
                    "fileURI": url
                }]
            }
        }));
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
                "stack": [{
                    "name": "abcd",
                    "lineNumber": 1,
                    "columnNumber": 4,
                    "sourceLine": "",
                    "pretty": `abcd@${scriptURL}:2:5`,
                    "fileURI": scriptURL
                }, {
                    "name": "efgh",
                    "lineNumber": 5,
                    "columnNumber": 4,
                    "sourceLine": "",
                    "pretty": `efgh@${scriptURL}:6:5`,
                    "fileURI": scriptURL
                }, {
                    "name": "f",
                    "lineNumber": 9,
                    "columnNumber": 4,
                    "sourceLine": "",
                    "pretty": `f@${scriptURL}:10:5`,
                    "fileURI": scriptURL
                }, {
                    "name": null,
                    "lineNumber": 7,
                    "columnNumber": 8,
                    "sourceLine": "",
                    "pretty": `@${url}:8:9`,
                    "fileURI": url
                }]
            }
        }));
    });
    it('html code is minified into one line', async () => {
        const dpa = new DynamicPageAnalyzer({recordRequestStackTraces: true});
        const url = wwwURL('oneline.html');

        await dpa.run(url);

        const deps = dpa.dynamicDEPs;

        expect(deps.length).toBeGreaterThan(0);

        const hars = deps.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "initiator": {
                "type": "fetch",
                "stack": [{
                    "name": "f",
                    "lineNumber": 0,
                    "columnNumber": 15,
                    "sourceLine": "",
                    "pretty": `f@${url}:1:16`,
                    "fileURI": url
                }, {
                    "name": null,
                    "lineNumber": 0,
                    "columnNumber": 44,
                    "sourceLine": "",
                    "pretty": `@${url}:1:45`,
                    "fileURI": url
                }]
            }
        }));
    });
});

