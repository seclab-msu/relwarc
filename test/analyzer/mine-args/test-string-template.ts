import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";


function makeAndRunSimple(script: string, url='http://test.com/test'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.mineArgsForDEPCalls(url);
    return analyzer;
}

describe("Analyzer finding args of requests which used `template strings` as args", () => {
    it("Template string without variables inside", function() {
        const analyzer = makeAndRunSimple(`
            var a = \`/randomurl?name=asd\`;
            $.ajax({ url: a});`
        );
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/randomurl?name=asd",
            }]
        } as SinkCall);
    });

    it("Template string without constant part", function() {
        const analyzer = makeAndRunSimple(`
            var url = "/randomtest/asdf?param=123";
            var a = \`\${url}\`;
            $.ajax({ url: a});`
        );
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/randomtest/asdf?param=123",
            }]
        } as SinkCall);
    });

    it("Template string with variable at the beginning", function() {
        const analyzer = makeAndRunSimple(`
            var url = "/tests";
            var a = \`\${url}/anxj22?id=123\`;
            $.ajax({ url: a});`
        );
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/tests/anxj22?id=123",
            }]
        } as SinkCall);
    });

    it("Template string with variable in the middle", function() {
        const analyzer = makeAndRunSimple(`
            var url = "/tests";
            var a = \`/anxj22\${url}?id=123\`;
            $.ajax({ url: a});`
        );
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/anxj22/tests?id=123",
            }]
        } as SinkCall);
    });

    it("Template string with variable in the end", function() {
        const analyzer = makeAndRunSimple(`
            var param = 123;
            var a = \`/test/anxj22?id=\${param}\`;
            $.ajax({ url: a});`
        );
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/test/anxj22?id=123",
            }]
        } as SinkCall);
    });

    it("Template string with two variables inside", function() {
        const analyzer = makeAndRunSimple(`
            var param = 123;
            var urlPart = "anxj22";
            var a = \`/test/\${urlPart}?id=\${param}\`;
            $.ajax({ url: a});`
        );
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/test/anxj22?id=123",
            }]
        } as SinkCall);
    });

    it("Template string with a lot of variables variables inside", function() {
        const analyzer = makeAndRunSimple(`
            var param = 123;
            var urlPart = "anxj22";
            var urlpart2 = "/asdf";
            var a = \`\${urlpart2}/test/\${urlPart}?id=\${param}&test=1234\`;
            $.ajax({ url: a});`
        );
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/asdf/test/anxj22?id=123&test=1234",
            }]
        } as SinkCall);
    });
});