import { Analyzer, SinkCall } from "../../src/analyzer/analyzer";


function makeAndRunSimple(script: string, url='http://example.com/'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.mineArgsForDEPCalls(url);
    return analyzer;
}

describe("Analyzer finding args of DEP sinks", () => {
    it("smoke test", function() {
        makeAndRunSimple('console.log("Hello World!");');
    });

    it("finds nothing for code without DEPS", () => {
        const analyzer = makeAndRunSimple('console.log("Hello World!");');
        expect(analyzer.results.length).toEqual(0);     
    });

    it("handles fetch /", () => {
        const analyzer = makeAndRunSimple('fetch("/");');
        
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "fetch",
            "args": ["/"]
        } as SinkCall);
    });

    it("handles $.ajax /", () => {
        const analyzer = makeAndRunSimple('$.ajax("/");');
        
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": ["/"]
        } as SinkCall);
    });

    it("supports call with settings object", () => {
        const analyzer = makeAndRunSimple(`$.ajax({
            method: "POST",
            url: "http://test.site/action",
            data: {
                a: 1,
                "b": "xx"
            }
        });`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                method: "POST",
                url: "http://test.site/action",
                data: {
                    a: 1,
                    b: "xx"
                }
            }]
        } as SinkCall);
    });

    it("supports several args", () => {
        const analyzer = makeAndRunSimple(`$.ajax("/test", {
            method: "POST",
            url: "http://test.site/action"
        });`);
        expect(analyzer.results.length).toEqual(1);
        // @ts-ignore
        expect(analyzer.results[0].args).toEqual([
            "/test",
            {
                method: "POST",
                url: "http://test.site/action"
            }
        ]);
    });

    it("supports integer addition", () => {
        const analyzer = makeAndRunSimple(`$.ajax({
            url: "/",
            data: { a: 5 + 4 }
        });`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0].args[0]).toEqual({
            url: '/',
            data: { a: 9 }
        });
    });

    it("supports location.href", () => {
        const url = 'http://tst.io/testin?param=1337';
        const sourceCode = `$.ajax({
            data: { "myurl": location.href }
        });`;
        const analyzer = makeAndRunSimple(sourceCode, url);
        
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0].args[0]).toEqual({
            data: { "myurl": url }
        });
    });
});