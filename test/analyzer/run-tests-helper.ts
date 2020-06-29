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

function makeHar(harIn: HAR): any {
    interface KeyValue {
        name: string;
        value: string;
    }

    interface HARForCheck {
        url: string;
        method: string;
        httpVersion: string;
        headers: KeyValue[];
        queryString: KeyValue[];
        bodySize: number;
        postData?: any;
    }

    const harOut: HARForCheck = {
        url: harIn.url,
        method: harIn.method,
        httpVersion: harIn.httpVersion,
        headers: harIn.headers,
        queryString: harIn.queryString,
        bodySize: harIn.bodySize,
        postData: harIn.getPostData() ? harIn.getPostData() : null,
    };
    if (harOut.postData == null) {
        delete harOut.postData;
    }

    return harOut;
}

export function runSingleTest(scripts: string[], obj: any, isHAR: boolean) {
    const analyzer = makeAndRunSimple(scripts, isHAR);
    if (isHAR === true) {
        expect(analyzer.hars.length).toBeGreaterThanOrEqual(1);
        let hars: any[] = [];
        analyzer.hars.forEach((har) => hars.push(makeHar(har)));
        expect(hars).toContain(obj);
    } else {
        expect(analyzer.results.length).toBeGreaterThanOrEqual(1);
        expect(analyzer.results).toContain(obj);
    }
}