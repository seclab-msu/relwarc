import { runSingleTest } from "../run-tests-helper";

describe("Analyzer mining HARs from fetch() calls", () => {
    it("handles window.fetch()", () => {
        const scripts = [
            'window.fetch("/testing/tst");'
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url: "http://example.com/testing/tst",
                queryString: new Set([]),
                headers: new Set([
                    {
                        value: "example.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"
            },
            true,
            "http://example.com/"
        );
    });
});
