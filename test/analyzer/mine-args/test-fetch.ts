import { SinkCall } from "../../../src/analyzer/analyzer";
import { runSingleTest } from "../run-tests-helper";


describe("Analyzer finding args of fetch() calls", () => {
    it("works with window.fetch()", () => {
        const scripts = [
            `window.fetch("/testing/test");`
        ];
        runSingleTest(
            scripts,
            {
                "funcName": "window.fetch",
                "args": ["/testing/test"]
            } as SinkCall,
            false
        );
    });

    // TODO: does not currently work, reconsider whether it should be added
    xit("works with this.fetch()", () => {
        const scripts = [
            `this.fetch("/testing/test");`
        ];
        runSingleTest(
            scripts,
            {
                "funcName": "this.fetch",
                "args": ["/testing/test"]
            } as SinkCall,
            false
        );
    });
});