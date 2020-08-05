import { Analyzer, SinkCall } from "../../src/analyzer/analyzer";
import { HAR } from "../../src/analyzer/har";
import { UNKNOWN } from "../../src/analyzer/types/unknown";
import * as fs from "fs";

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

function getArgsFromFile(path: string): any {
    const check = JSON.parse(fs.readFileSync(path).toString(), function (k, v) {
        if (v === "UNKNOWN") {
            return UNKNOWN;
        }
        if (v === "FROM_FUNCTION_CALL") {
            return UNKNOWN;
        }
        return v;
    });
    return check;
}

export function makeAndRunSimple(scripts: string[], isHAR: boolean, url='http://test.com/test'): Analyzer {
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

export function runSingleTest(scripts: string[], checkingObj: any, isHAR: boolean, url='http://test.com/test') {
    const analyzer = makeAndRunSimple(scripts, isHAR, url);
    if (isHAR === true) {
        let convertedHars: any[] = [];
        analyzer.hars.forEach((har) => {
            convertedHars.push(makeHarInterface(har));
        });
        if (typeof checkingObj === 'string') {
            const harsForCheck = JSON.parse(fs.readFileSync(checkingObj).toString());
            harsForCheck.forEach((har) => {
                har.headers = new Set(har.headers);
                har.queryString = new Set(har.queryString);
                if (har.postData && har.postData.params) {
                    har.postData.params = new Set(har.postData.params);
                }
            });
            for (let i = 0; i < harsForCheck.length; i++) {
                if (harsForCheck[i] !== undefined) {
                    expect(convertedHars).toContain(harsForCheck[i]);
                }
            }
        } else {
            expect(convertedHars).toContain(checkingObj);
        }
    } else {
        if (typeof checkingObj === 'string') {
            const argsFromFile = getArgsFromFile(checkingObj);
            for (let i = 0; i < argsFromFile.length; i++) {
                if (argsFromFile[i] !== undefined) {
                    expect(analyzer.results).toContain(argsFromFile[i] as SinkCall);
                }
            }
        } else {
            expect(analyzer.results).toContain(checkingObj);
        } 
    }
}
