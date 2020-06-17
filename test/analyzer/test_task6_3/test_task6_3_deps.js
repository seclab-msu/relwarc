"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../../src/analyzer/analyzer");
const fs_1 = require("fs");
function readSrc(path) {
    return fs_1.readFileSync(path, "utf8");
}
// function makeHar(har): HAR {
//     let check = new HAR("http://example.com/", "http://example.com/");
//     check.url = har.url;
//     check.method = har.method;
//     check.httpVersion = har.httpVersion;
//     check.headers = har.headers;
//     check.queryString = har.queryString;
//     check.bodySize = har.bodySize;
//     // if (check.bodySize != 0) {
//     //     check.postData = har.postData;
//     // }
//     return check;
// }
function makeSimpleHar(dep) {
    const check = {
        url: dep.url,
        method: dep.method,
        httpVersion: dep.httpVersion,
        headers: dep.headers,
        queryString: dep.queryString,
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
describe("Analyzer mining HARs for JS DEPs (from task 6.3)", () => {
    it("sample 1", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/1.js"), "http://js-training.seclab");
        expect(analyzer.results.length).toEqual(1);
        const dep = makeSimpleHar(analyzer.hars[0]);
        const check = {
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
        };
        expect(dep).toEqual(check);
    });
    it("sample 2", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/2.js"), "http://js-training.seclab");
        expect(analyzer.results.length).toEqual(2);
        const dep = new Set([
            makeSimpleHar(analyzer.hars[0]),
            makeSimpleHar(analyzer.hars[1]),
        ]);
        const check = new Set([
            {
                method: "GET",
                url: "http://js-training.seclab/doing/actions.php?n=x85",
                httpVersion: "HTTP/1.1",
                headers: [
                    {
                        name: "Host",
                        value: "js-training.seclab",
                    },
                ],
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
        ]);
        expect(dep).toEqual(check);
    });
    it("sample 3", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/3.js"), "http://js-training.seclab");
        expect(analyzer.results.length).toEqual(1);
        const dep = makeSimpleHar(analyzer.hars[0]);
        const check = {
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
        };
        expect(dep).toEqual(check);
    });
    xit("sample 4", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/4.js"), "http://js-training.seclab");
        expect(analyzer.results.length).toEqual(1);
        const dep = makeSimpleHar(analyzer.hars[0]);
        const check = {
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
        };
        expect(dep).toEqual(check);
    });
});
