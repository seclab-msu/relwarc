import { makeAndRunSimple } from "../run-tests-helper";

describe("DEP HARs are deduplicated", () => {
    it("with two identical calls", () => {
        const scripts = [
            `fetch("/123");
            fetch("/123");`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            true
        );
        expect(analyzer.hars.length).toEqual(1);
    });

    it("with different args but same HARs", () => {
        const scripts = [
            `$.ajax("/test/endpoint.php", {
                method: "GET",
                data: {
                    "x": 'tst333'
                }
            });
            $.get("/test/endpoint.php", { "x": 'tst333' });

            $http.get("/test/endpoint.php?x=tst333");`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            true
        );
        expect(analyzer.hars.length).toEqual(1);
    });
});
