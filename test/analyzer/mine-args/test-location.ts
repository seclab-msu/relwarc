import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";
import { makeAndRunSimple } from './common';


describe("Analyzing code that uses location object", () => {
    it("does not fail on assigning", function() {
        makeAndRunSimple('location = "/test";');
        makeAndRunSimple('document.location = "/test";');
    });

    it("does not fail on assigning location property", function() {
        makeAndRunSimple('location.href = "/test";');
        makeAndRunSimple('document.location.href = "/test";');
    });

    it("does not fail when prop is set on copy", function() {
        makeAndRunSimple(`
            let x = location;
            x.href = "/test";
        `);
    });

    it("does not fail when prop is set on copy after assigning", function() {
        makeAndRunSimple(`
            let x = location;
            location = "/test";
            x.href = "/otherloc";
        `);
    });

    it("assigning location does not terminate analysis", function() {
        const analyzer = makeAndRunSimple(`
            if (true) {
                location = "/testingtest";
            }
            fetch("/api/info.jsp");
        `);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            'funcName': 'fetch',
            'args': ['/api/info.jsp']
        } as SinkCall);
    });

    it("handles location.pathname usage", function() {
        const analyzer = makeAndRunSimple(`
            let path = location.pathname;
            let secondDir = path.split("/")[2];
            fetch("/root/" + secondDir + "/testin.jsp");
        `, 'http://test.com/dir1/dir2/dir3/page.html');
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            'funcName': 'fetch',
            'args': ['/root/dir2/testin.jsp']
        } as SinkCall);
    });

    // TODO: this does not work for now
    xit("handles location.pathname usage with immediate split", function() {
        const analyzer = makeAndRunSimple(`
            let secondDir = location.pathname.split("/")[2];
            fetch("/root/" + secondDir + "/testin.jsp");
        `, 'http://test.com/dir1/dir2/dir3/page.html');
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            'funcName': 'fetch',
            'args': ['/root/dir2/testin.jsp']
        } as SinkCall);
    });
});
