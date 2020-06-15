import { Analyzer } from "../../src/analyzer/analyzer";


function makeAndRunSimple(script: string, url='http://example.com/'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.analyze(url);
    return analyzer;
}

describe("Analyzer mining HARs for JS DEPs", () => {
    it("smoke test", () => {
        const analyzer = new Analyzer();
        analyzer.addScript('console.log("Hello World!");');
        analyzer.analyze('http://example.com/');
    });

    it("handles fetch /", () => {
        const analyzer = new Analyzer();
        analyzer.addScript('fetch("/");');

        analyzer.analyze('http://example.com/');

        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://example.com/");
        expect(dep.method).toEqual("GET");
        expect(dep.getHeader('host')).toEqual("example.com");
        expect(dep.queryString).toEqual([]);
        expect(dep.bodySize).toEqual(0);
    });

    it("supports $.ajax with settings object", () => {
        const analyzer = makeAndRunSimple(`$.ajax({
            method: "POST",
            url: "http://test.site/action",
            data: {
                a: 1,
                "b": "xx"
            }
        });`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://test.site/action");
        expect(dep.method).toEqual('POST');
        expect(dep.getHeader('host')).toEqual('test.site');

        const expectedPostBody = 'a=1&b=xx';
        const expectedPostData = {
            text: expectedPostBody,
            params: [
                { name: 'a', value: '1' },
                { name: 'b', value: 'xx' }
            ],
            mimeType: "application/x-www-form-urlencoded"
        };
        
        expect(dep.bodySize).toEqual(expectedPostBody.length);

        const postData = dep.getPostData();

        expect(postData).toBeDefined();

        if (typeof postData !== 'undefined') {
            expect(postData).toEqual(expectedPostData);
        }
    });
});