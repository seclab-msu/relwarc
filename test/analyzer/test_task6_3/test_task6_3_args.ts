import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";
import { readFileSync } from "fs";

import {
    UNKNOWN,
    UNKNOWN_FUNCTION,
    UNKNOWN_FROM_FUNCTION,
} from "../../../src/analyzer/types/unknown";

function readSrc(path: string): string {
    return readFileSync(path, "utf8");
}

function makeAndRunSimple(
    script: string,
    url = "http://example.com/"
): Analyzer {
    const analyzer = new Analyzer();
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
                        q: UNKNOWN,
                    },
                    success: UNKNOWN,
                    error: UNKNOWN,
                },
            ],
        } as SinkCall);
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
        } as SinkCall);
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
        } as SinkCall);
    });

    it("sample 3", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/3.js"));
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "$http.get",
            args: ["/Umbraco/EuroNCAP/Widgets/GetTweets/17131"],
        } as SinkCall);
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
                    body:
                        "action=wikiPageView&url=http%3A%2F%2Fjs-training.seclab%2Fjs-dep%2Ffunc-args%2Fsamples%2Fcomputed%2F4.html",
                },
            ],
        } as SinkCall);
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
        } as SinkCall);
    });

    it("sample 6", () => {
        const analyzer = makeAndRunSimple(readSrc(__dirname + "/data/6.js"));
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "$http",
            args: [
                {
                    method: "GET",
                    url:
                        "https://www.site24x7.com/benchmarks/app?vertical=UNKNOWN&daySeparator=UNKNOWN",
                },
            ],
        } as SinkCall);
    });
});
