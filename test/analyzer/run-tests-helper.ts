import { Analyzer, SinkCall } from "../../src/analyzer/analyzer";
import { UNKNOWN } from "../../src/analyzer/types/unknown";
import * as fs from "fs";

function makeSets(hars: any) {
    hars.forEach(har => {
        har.headers = new Set(har.headers);
        har.queryString = new Set(har.queryString);
        if (har.postData && har.postData.params) {
            har.postData.params = new Set(har.postData.params);
        }
    });
    return hars;
}

function getArgsFromFile(path: string): any {
    const check = JSON.parse(fs.readFileSync(path).toString(), function (k, v) {
        if (v === "UNKNOWN") {
            if (k === "Content-Type") {
                return undefined;
            }
            return UNKNOWN;
        }
        if (v === "FROM_FUNCTION_CALL") {
            return UNKNOWN;
        }
        return v;
    });
    return check;
}

function removeEmpty(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
      } else if (obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
};

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
        let convertedHars = JSON.parse(JSON.stringify(analyzer.hars));
        convertedHars = makeSets(convertedHars);
        if (typeof checkingObj === 'string') {
            let harsForCheck = JSON.parse(fs.readFileSync(checkingObj).toString());
            harsForCheck = makeSets(harsForCheck);
            for (let i = 0; i < harsForCheck.length; i++) {
                if (harsForCheck[i] !== undefined) {
                    expect(convertedHars).toContain(harsForCheck[i]);
                }
            }
        } else {
            checkingObj = JSON.parse(JSON.stringify(checkingObj));
            checkingObj.headers = new Set(Object.values(checkingObj.headers))
            checkingObj.queryString = new Set(Object.values(checkingObj.queryString))
            if (checkingObj.postData && checkingObj.postData.params) {
                checkingObj.postData.params = new Set(Object.values(checkingObj.postData.params));
            }
            expect(convertedHars).toContain(checkingObj);
        }
    } else {
        if (typeof checkingObj === 'string') {
            const argsFromFile = getArgsFromFile(checkingObj);
            const results = removeEmpty(analyzer.results);
            for (let i = 0; i < argsFromFile.length; i++) {
                if (argsFromFile[i] !== undefined) {
                    expect(results).toContain(argsFromFile[i] as SinkCall);
                }
            }
        } else {
            expect(analyzer.results).toContain(checkingObj);
        } 
    }
}
