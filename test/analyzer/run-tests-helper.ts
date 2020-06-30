import { Analyzer } from "../../src/analyzer/analyzer";
import { HAR } from "../../src/analyzer/har";

function makeAndRunSimple(scripts: string[], isHAR: boolean, url='http://test.com/test'): Analyzer {
    const analyzer = new Analyzer();
    scripts.forEach(script => {
        analyzer.addScript(script);
    });
    if (isHAR === true) {
        analyzer.analyze(url);
    } else {
        analyzer.mineArgsForDEPCalls(url);
    }
    return analyzer;
}

function makeHarInterface(harIn: HAR): any {
    interface HARForCheck {
        url: string;
        method: string;
        httpVersion: string;
        headers: any;
        queryString: any;
        bodySize: number;
        postData?: any;
    }
    const harOut: HARForCheck = {
        url: harIn.url,
        method: harIn.method,
        httpVersion: harIn.httpVersion,
        headers: new Set(harIn.headers),
        queryString: new Set(harIn.queryString),
        bodySize: harIn.bodySize,
        postData: harIn.getPostData() ? harIn.getPostData() : null,
    };
    if (harOut.postData == null) {
        delete harOut.postData;
    } else if (typeof harOut.postData.params !== 'undefined'){
        harOut.postData.params = new Set(harOut.postData.params);
    }
    return harOut;
}

export function runSingleTest(scripts: string[], obj: any, isHAR: boolean) {
    const analyzer = makeAndRunSimple(scripts, isHAR);
    if (isHAR === true) {
        expect(analyzer.hars.length).toBeGreaterThanOrEqual(1);
        let hars: any[] = [];
        analyzer.hars.forEach((har) => hars.push(makeHarInterface(har)));
        expect(hars).toContain(obj);
    } else {
        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain(obj);
    }
}