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

function readCheckFromFile(path) {
    const check = JSON.parse(readSrc(path), function (k, v) {
        if (v === "UNKNOWN") {
            return UNKNOWN;
        }
        if (v === "FROM_FUNCTION_CALL") {
            return UNKNOWN;
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
        const test = 1;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
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
        const test = 2;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
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
        const test = 3;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
        expect(analyzer.results.length).toBeGreaterThan(0);
        expect(analyzer.results[0]).toEqual({
            funcName: "$http.get",
            args: ["/Umbraco/EuroNCAP/Widgets/GetTweets/17131"],
        } as SinkCall);
    });

    xit("sample 4", () => {
        const test = 4;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
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
        const test = 5;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
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
        const test = 6;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
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

    it("sample 7", () => {
        const test = 7;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
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
                        "X-RequestDigest": UNKNOWN,
                    },
                    body:
                        '{"formId":"83e3b0f2-1aea-4e88-a9f7-70c399316d2e","formState":"UNKNOWN","fieldValues":"UNKNOWN","reCaptchaResponse":"UNKNOWN","files":"UNKNOWN"}',
                },
            ],
        } as SinkCall);
    });

    it("sample 18", () => {
        const test = 18;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
        expect(analyzer.results.length).toBeGreaterThan(3);
        check(
            analyzer.results,
            readCheckFromFile(__dirname + `/data/check/${test}_args.json`)
        );
    });


    it("sample 20", () => {
        const test = 20;
        const analyzer = makeAndRunSimple(
            readSrc(__dirname + `/data/${test}.js`),
            `http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html`
        );
        expect(analyzer.results.length).toBeGreaterThan(3);
        check(
            analyzer.results,
            readCheckFromFile(__dirname + `/data/check/${test}_args.json`)
        );
    });
});
