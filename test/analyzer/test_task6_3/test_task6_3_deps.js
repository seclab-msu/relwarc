"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../../src/analyzer/analyzer");
const fs_1 = require("fs");
const unknown_1 = require("../../../src/analyzer/types/unknown");
function readSrc(path) {
    return fs_1.readFileSync(path, "utf8");
}
function readCheckFromFile(path) {
    const check = JSON.parse(readSrc(path));
    return check;
}
function makeSimpleHar(dep) {
    const check = {
        url: dep.url,
        method: dep.method,
        httpVersion: dep.httpVersion,
        headers: new Set(dep.headers),
        queryString: new Set(dep.queryString),
        bodySize: dep.bodySize,
        postData: dep.getPostData() ? dep.getPostData() : null,
    };
    if (check.postData == null) {
        delete check.postData;
    }
    return check;
}
function makeAndRunSimple(script, url = "http://example.com/") {
    const analyzer = new analyzer_1.Analyzer();
    analyzer.addScript(script);
    analyzer.analyze(url);
    return analyzer;
}
function convertToSet(deps) {
    deps.forEach((dep) => {
        dep.headers = new Set(dep.headers);
        dep.queryString = new Set(dep.queryString);
    });
    return deps;
}
function checker(depsFromAnalyzer, depsFromChecker) {
    let hars = [];
    depsFromAnalyzer.forEach((dep) => {
        hars.push(makeSimpleHar(dep));
    });
    for (let i = 0; i < depsFromChecker.length; i++) {
        expect(hars).toContain(depsFromChecker[i]);
    }
}
describe("Analyzer mining HARs for JS DEPs (from task 6.3)", () => {
    it("sample 1", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/1.js"), "http://js-training.seclab/js-dep/func-args/samples/computed/1.html");
        expect(analyzer.results.length).toBeGreaterThan(0);
        const dep = analyzer.hars;
        const check = [
            {
                httpVersion: "HTTP/1.1",
                url: "http://js-training.seclab/jp/eltex/xsp/ajax/custom/AjaxSuggestBean.json?q=UNKNOWN",
                queryString: [
                    {
                        name: "q",
                        value: "UNKNOWN",
                    },
                ],
                headers: [
                    {
                        value: "js-training.seclab",
                        name: "Host",
                    },
                ],
                bodySize: 0,
                method: "GET",
            },
        ];
        checker(dep, convertToSet(check));
    });
    it("sample 2", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/2.js"), "http://js-training.seclab/js-dep/func-args/samples/computed/2.html");
        expect(analyzer.results.length).toBeGreaterThan(1);
        const dep = analyzer.hars;
        const check = [
            {
                method: "GET",
                url: "http://js-training.seclab/doing/actions.php?n=x85",
                httpVersion: "HTTP/1.1",
                headers: new Set([
                    {
                        name: "Host",
                        value: "js-training.seclab",
                    },
                ]),
                queryString: [
                    {
                        name: "n",
                        value: "x85",
                    },
                ],
                bodySize: 0,
            },
            {
                method: "PUT",
                url: "http://js-training.seclab/doing/actions.php",
                httpVersion: "HTTP/1.1",
                headers: [
                    {
                        name: "Host",
                        value: "js-training.seclab",
                    },
                    {
                        name: "X-Tok",
                        value: "abcd",
                    },
                    {
                        name: "Content-Length",
                        value: "5",
                    },
                ],
                queryString: [],
                bodySize: 5,
                postData: {
                    text: "xn=85",
                },
            },
        ];
        checker(dep, convertToSet(check));
    });
    it("sample 3", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/3.js"), "http://js-training.seclab/js-dep/func-args/samples/computed/3.html");
        expect(analyzer.results.length).toBeGreaterThan(0);
        const dep = analyzer.hars;
        const check = [
            {
                method: "GET",
                httpVersion: "HTTP/1.1",
                bodySize: 0,
                queryString: [],
                headers: [
                    {
                        value: "js-training.seclab",
                        name: "Host",
                    },
                ],
                url: "http://js-training.seclab/Umbraco/EuroNCAP/Widgets/GetTweets/17131",
            },
        ];
        checker(dep, convertToSet(check));
    });
    xit("sample 4", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/4.js"), "http://js-training.seclab/js-dep/func-args/samples/computed/4.html");
        expect(analyzer.results.length).toBeGreaterThan(0);
        const dep = analyzer.hars;
        const check = [
            {
                httpVersion: "HTTP/1.1",
                bodySize: 31,
                method: "POST",
                headers: [
                    {
                        name: "Host",
                        value: "js-training.seclab",
                    },
                    {
                        value: "application/x-www-form-urlencoded",
                        name: "Content-Type",
                    },
                    {
                        value: "31",
                        name: "Content-Length",
                    },
                ],
                queryString: [],
                url: "http://js-training.seclab/stats/",
                postData: {
                    mimeType: "application/x-www-form-urlencoded",
                    params: [
                        {
                            value: "wikiPageView",
                            name: "action",
                        },
                        {
                            value: "UNKNOWN",
                            name: "url",
                        },
                    ],
                    text: "action=wikiPageView&url=UNKNOWN",
                },
            },
        ];
        checker(dep, convertToSet(check));
    });
    it("sample 5", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/5.js"), "http://js-training.seclab/js-dep/func-args/samples/computed/5.html");
        expect(analyzer.results.length).toBeGreaterThan(0);
        const dep = analyzer.hars;
        const check = [
            {
                url: "http://www.aninews.in/devices/",
                postData: {
                    text: '{"registration_id":"UNKNOWN","type":"web"}',
                    mimeType: "application/json",
                },
                httpVersion: "HTTP/1.1",
                method: "POST",
                headers: [
                    {
                        value: "www.aninews.in",
                        name: "Host",
                    },
                    {
                        name: "Content-Type",
                        value: "application/json",
                    },
                    {
                        value: "42",
                        name: "Content-Length",
                    },
                ],
                bodySize: 42,
                queryString: [],
            },
        ];
        checker(dep, convertToSet(check));
    });
    it("sample 6", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/6.js"), "http://js-training.seclab/js-dep/func-args/samples/computed/6.html");
        expect(analyzer.results.length).toBeGreaterThan(0);
        const dep = analyzer.hars;
        const check = [
            {
                bodySize: 0,
                url: "https://www.site24x7.com/benchmarks/app?vertical=UNKNOWN&daySeparator=UNKNOWN",
                headers: [
                    {
                        name: "Host",
                        value: "www.site24x7.com",
                    },
                ],
                httpVersion: "HTTP/1.1",
                method: "GET",
                queryString: [
                    {
                        name: "vertical",
                        value: "UNKNOWN",
                    },
                    {
                        value: "UNKNOWN",
                        name: "daySeparator",
                    },
                ],
            },
        ];
        checker(dep, convertToSet(check));
    });
    it("sample 7", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/7.js"), "http://js-training.seclab/js-dep/func-args/samples/computed/7.html");
        expect(analyzer.results.length).toBeGreaterThan(0);
        const dep = analyzer.hars;
        const check = [
            {
                url: "http://js-training.seclab/ODVA/_vti_bin/OID.SharePoint.FormBuilder/submissions.svc/",
                postData: {
                    text: '{"formId":"83e3b0f2-1aea-4e88-a9f7-70c399316d2e","formState":"UNKNOWN","fieldValues":"UNKNOWN","reCaptchaResponse":"UNKNOWN","files":"UNKNOWN"}',
                    mimeType: "application/json",
                },
                headers: [
                    {
                        name: "Host",
                        value: "js-training.seclab",
                    },
                    {
                        name: "content-type",
                        value: "application/json",
                    },
                    {
                        name: "X-RequestDigest",
                        value: unknown_1.UNKNOWN,
                    },
                    {
                        name: "Content-Length",
                        value: "143",
                    },
                ],
                httpVersion: "HTTP/1.1",
                bodySize: 143,
                queryString: [],
                method: "POST",
            },
        ];
        // expect(makeSimpleHar(dep[0])).toEqual(convertToSet(check)[0]);
        checker(dep, convertToSet(check));
    });
    it("sample 18", () => {
        const test = 18;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(3);
        const dep = analyzer.hars;
        const check = readCheckFromFile(__dirname + `/data/check/${test}_hars.json`);
        checker(dep, convertToSet(check));
    });
    xit("sample 19 (coming soon)", () => {
        const test = 19;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(12);
        const dep = analyzer.hars;
        const check = readCheckFromFile(__dirname + `/data/check/${test}_hars.json`);
        // expect(makeSimpleHar(dep[2])).toEqual(convertToSet(check)[2]);
        // checker(dep, convertToSet(check));
    });
    it("sample 20", () => {
        const test = 20;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(2);
        const dep = analyzer.hars;
        const check = readCheckFromFile(__dirname + `/data/check/${test}_hars.json`);
        checker(dep, convertToSet(check));
    });
    it("sample 21", () => {
        const test = 21;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(0);
        const dep = analyzer.hars;
        const check = [
            {
                bodySize: 62,
                url: "https://report.seznamzpravy.cz.test.js-training.seclab/report/custom",
                httpVersion: "HTTP/1.1",
                headers: [
                    {
                        value: "report.seznamzpravy.cz.test.js-training.seclab",
                        name: "Host",
                    },
                    {
                        name: "Content-Type",
                        value: "application/json",
                    },
                    {
                        name: "Content-Length",
                        value: "62",
                    },
                ],
                method: "POST",
                queryString: [],
                postData: {
                    mimeType: "application/json",
                    text: '{"$type":"runner:error","message":"UNKNOWN","stack":"UNKNOWN"}',
                },
            },
        ];
        checker(dep, convertToSet(check));
    });
});
