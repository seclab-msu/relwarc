"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../../src/analyzer/analyzer");
const fs_1 = require("fs");
const unknown_1 = require("../../../src/analyzer/types/unknown");
function readSrc(path) {
    return fs_1.readFileSync(path, "utf8");
}
function readCheckFromFile(path) {
    const check = JSON.parse(readSrc(path), function (k, v) {
        if (v === "UNKNOWN") {
            return unknown_1.UNKNOWN;
        }
        if (v === "FROM_FUNCTION_CALL") {
            return unknown_1.UNKNOWN;
        }
        return v;
    });
    return check;
}
function check(argsFromAnalyzer, argsFromChecker) {
    for (let i = 0; i < argsFromChecker.length; i++) {
        expect(argsFromAnalyzer).toContain(argsFromChecker[i]);
    }
}
function makeAndRunSimple(script, url = "http://example.com/") {
    const analyzer = new analyzer_1.Analyzer();
    analyzer.addScript(script);
    analyzer.mineArgsForDEPCalls(url);
    return analyzer;
}
describe("Analyzer finding args of DEP sinks (from task 6.3)", () => {
    it("sample 1", () => {
        const test = 1;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "$.ajax",
            args: [
                {
                    url: "/jp/eltex/xsp/ajax/custom/AjaxSuggestBean.json",
                    dataType: "json",
                    type: "GET",
                    cache: false,
                    data: {
                        q: unknown_1.UNKNOWN,
                    },
                    success: unknown_1.UNKNOWN,
                    error: unknown_1.UNKNOWN,
                },
            ],
        });
    });
    it("sample 2", () => {
        const test = 2;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(1);
        expect(analyzer.results[0]).toEqual({
            funcName: "$.ajax",
            args: [
                {
                    url: "/doing/actions.php",
                    data: {
                        n: "x85",
                    },
                },
            ],
        });
        expect(analyzer.results[1]).toEqual({
            funcName: "fetch",
            args: [
                "/doing/actions.php",
                {
                    method: "PUT",
                    body: "xn=85",
                    headers: {
                        "X-Tok": "abcd",
                    },
                },
            ],
        });
    });
    it("sample 3", () => {
        const test = 3;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "$http.get",
            args: ["/Umbraco/EuroNCAP/Widgets/GetTweets/17131"],
        });
    });
    xit("sample 4", () => {
        const test = 4;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "fetch",
            args: [
                "/stats/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: "action=wikiPageView&url=http%3A%2F%2Fjs-training.seclab%2Fjs-dep%2Ffunc-args%2Fsamples%2Fcomputed%2F4.html",
                },
            ],
        });
    });
    it("sample 5", () => {
        const test = 5;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "fetch",
            args: [
                "http://www.aninews.in/devices/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: '{"registration_id":"UNKNOWN","type":"web"}',
                    credentials: "include",
                },
            ],
        });
    });
    it("sample 6", () => {
        const test = 6;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "$http",
            args: [
                {
                    method: "GET",
                    url: "https://www.site24x7.com/benchmarks/app?vertical=UNKNOWN&daySeparator=UNKNOWN",
                },
            ],
        });
    });
    it("sample 7", () => {
        const test = 7;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "fetch",
            args: [
                "/ODVA/_vti_bin/OID.SharePoint.FormBuilder/submissions.svc/",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "content-type": "application/json",
                        "X-RequestDigest": unknown_1.UNKNOWN,
                    },
                    body: '{"formId":"83e3b0f2-1aea-4e88-a9f7-70c399316d2e","formState":"UNKNOWN","fieldValues":"UNKNOWN","reCaptchaResponse":"UNKNOWN","files":"UNKNOWN"}',
                },
            ],
        });
    });
    it("sample 18", () => {
        const test = 18;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(3);
        check(analyzer.results, readCheckFromFile(__dirname + `/data/check/${test}_args.json`));
    });
    xit("sample 19 (coming soon)", () => {
        const test = 19;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(3);
        check(analyzer.results, readCheckFromFile(__dirname + `/data/check/${test}_args.json`));
    });
    it("sample 20", () => {
        const test = 20;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(3);
        check(analyzer.results, readCheckFromFile(__dirname + `/data/check/${test}_args.json`));
    });
    it("sample 21", () => {
        const test = 21;
        const analyzer = makeAndRunSimple(readSrc(__dirname + `/data/${test}.js`), `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`);
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "fetch",
            args: [
                "https://report.seznamzpravy.cz.test.js-training.seclab/report/custom",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: '{"$type":"runner:error","message":"UNKNOWN","stack":"UNKNOWN"}',
                },
            ],
        });
    });
});
