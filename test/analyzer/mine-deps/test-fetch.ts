import { Analyzer } from "../../../src/analyzer/analyzer";

import { makeAndRunSimple } from './common';

describe("Analyzer mining HARs from fetch() calls", () => {
    it("handles window.fetch()", () => {
        const analyzer = new Analyzer();
        analyzer.addScript('window.fetch("/testing/tst");');

        analyzer.analyze('http://example.com/');

        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://example.com/testing/tst");
        expect(dep.method).toEqual("GET");
        expect(dep.getHeader('host')).toEqual("example.com");
        expect(dep.queryString).toEqual([]);
        expect(dep.bodySize).toEqual(0);
    });
});
