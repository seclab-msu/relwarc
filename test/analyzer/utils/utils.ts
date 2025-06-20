import { Analyzer, SinkCall } from '../../../src/analyzer';
import { UNKNOWN } from '../../../src/types/unknown';
import { HAR } from '../../../src/har';
import { TestHAR, UnorderedHAR } from './types';
import * as fs from 'fs';

export function makeUnorderedHARS(hars: (HAR|TestHAR)[]): UnorderedHAR[] {
    return hars.map(function (har: HAR|TestHAR): UnorderedHAR {
        const newHAR: UnorderedHAR = {
            method: har.method,
            url: har.url,
            httpVersion: har.httpVersion,
            headers: new Set(har.headers),
            queryString: new Set(har.queryString),
            bodySize: har.bodySize,
        };
        const postData = har instanceof HAR ? har.getPostData() : har.postData;
        if (postData) {
            newHAR.postData = {
                text: postData.text,
                mimeType: postData.mimeType
            };
            if (postData.params) {
                newHAR.postData.params = new Set(postData.params);
            }
        }
        return newHAR;
    });
}

export function getArgsFromFile(path: string): SinkCall[] {
    return JSON.parse(fs.readFileSync(path).toString(), function (k, v) {
        if (v === 'UNKNOWN') {
            if (k === 'Content-Type') {
                return undefined;
            }
            return UNKNOWN;
        }
        if (v === 'FROM_FUNCTION_CALL') {
            return UNKNOWN;
        }
        return v;
    });
}

export function removeEmpty(obj: SinkCall[]): SinkCall[] {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
            removeEmpty(obj[key]);
        } else if (obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
}

export function removeLocation(obj: SinkCall[]): SinkCall[] {
    obj.forEach(arg => delete arg.location);
    return obj;
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

export function runSingleTestHARFromFile(
    scripts: string[],
    checkingHAR: string,
    url='http://test.com/test'
): void {
    const analyzer = makeAndRunSimple(scripts, true, url);
    let convertedHars = JSON.parse(JSON.stringify(analyzer.hars));
    convertedHars = makeUnorderedHARS(convertedHars);
    let harsForCheck = JSON.parse(
        fs.readFileSync(checkingHAR).toString()
    );
    harsForCheck = makeUnorderedHARS(harsForCheck);
    for (let i = 0; i < harsForCheck.length; i++) {
        expect(convertedHars).toContain(harsForCheck[i]);
    }
}

export function runSingleTestHAR(
    scripts: string[],
    checkingHAR: HAR|TestHAR,
    url='http://test.com/test',
): void {
    const analyzer = makeAndRunSimple(scripts, true, url);
    let convertedHars = JSON.parse(JSON.stringify(analyzer.hars), function (k, v) {
        if (typeof v === 'number' && k !== 'bodySize') {
            return String(v);
        }
        return v;
    });
    convertedHars = makeUnorderedHARS(convertedHars);
    const checkHAR: UnorderedHAR = makeUnorderedHARS([checkingHAR])[0];
    expect(convertedHars).toContain(checkHAR);
}

export function runSingleTestSinkCall(
    scripts: string[],
    checkingObj: SinkCall|string,
    url='http://test.com/test'
): void {
    const analyzer = makeAndRunSimple(scripts, false, url);
    if (typeof checkingObj === 'string') {
        const argsFromFile = getArgsFromFile(checkingObj);
        const results = removeLocation(removeEmpty(analyzer.results));
        for (let i = 0; i < argsFromFile.length; i++) {
            expect(results).toContain(argsFromFile[i] as SinkCall);
        }
    } else {
        expect(removeLocation(analyzer.results)).toContain(checkingObj);
    }
}

function _setEqual<T>(s1: Set<T>, s2: Set<T>): boolean {
    if (s1.size != s2.size) {
        return false;
    }
    for (const el of s1) {
        if (!s2.has(el)) {
            return false;
        }
    }
    return true;
}

export function setEqual<T>(s1: Set<T>|T[], s2: Set<T>|T[]): boolean {
    if (Array.isArray(s1)) {
        s1 = new Set(s1);
    }
    if (Array.isArray(s2)) {
        s2 = new Set(s2);
    }
    return _setEqual(s1, s2);
}
