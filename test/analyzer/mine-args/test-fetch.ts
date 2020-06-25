import { SinkCall } from "../../../src/analyzer/analyzer";
import { makeAndRunSimple } from './common';


describe("Analyzer finding args of fetch() calls", () => {
    it("works with window.fetch()", () => {
        const analyzer = makeAndRunSimple('window.fetch("/testing/test");');

        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain({
            "funcName": "window.fetch",
            "args": ["/testing/test"]
        } as SinkCall);
    });

    // TODO: does not currently work, reconsider whether it should be added
    xit("works with this.fetch()", () => {
        const analyzer = makeAndRunSimple('this.fetch("/testing/test");');

        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain({
            "funcName": "this.fetch",
            "args": ["/testing/test"]
        } as SinkCall);
    });
});