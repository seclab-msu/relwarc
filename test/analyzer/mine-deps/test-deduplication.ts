import { makeAndRunSimple } from './common';


describe("DEP HARs are deduplicated", () => {
    it("with two identical calls", () => {
        const analyzer = makeAndRunSimple(`
            fetch("/123");
            fetch("/123");
        `);
        expect(analyzer.hars.length).toEqual(1);
    });

    it("with different args but same HARs", () => {
        const analyzer = makeAndRunSimple(`
            $.ajax("/test/endpoint.php", {
                method: "GET",
                data: {
                    "x": 'tst333'
                }
            });
            $.get("/test/endpoint.php", { "x": 'tst333' });

            $http.get("/test/endpoint.php?x=tst333");
        `);
        expect(analyzer.hars.length).toEqual(1);
    });
});
