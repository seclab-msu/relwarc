"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../../src/analyzer/analyzer");
const fs_1 = require("fs");
const unknown_1 = require("../../../src/analyzer/types/unknown");
function readSrc(path) {
    return fs_1.readFileSync(path, "utf8");
}
function makeAndRunSimple(script, url = "http://example.com/") {
    const analyzer = new analyzer_1.Analyzer();
    analyzer.addScript(script);
    analyzer.mineArgsForDEPCalls(url);
    return analyzer;
}
describe("Analyzer finding args of DEP sinks (from task 6.3)", () => {
    it("sample 1", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/1.js"));
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
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/2.js"));
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
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/3.js"));
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "$http.get",
            args: ["/Umbraco/EuroNCAP/Widgets/GetTweets/17131"],
        });
    });
    xit("sample 4", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/4.js"));
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
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/5.js"));
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
});
