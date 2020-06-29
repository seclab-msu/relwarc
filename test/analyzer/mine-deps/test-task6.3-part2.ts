import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";
const fs = require('fs'); 
import { HAR } from "../../../src/analyzer/har";

import {
    UNKNOWN,
    UNKNOWN_FUNCTION,
    UNKNOWN_FROM_FUNCTION,
    isUnknown,
    isUnknownOrUnknownString
} from '../../../src/analyzer/types/unknown';

function makeSimpleHar(dep: HAR): any {
    interface NewHar {
        url: any;
        method: any;
        httpVersion: any;
        headers: any;
        queryString: any;
        bodySize: any;
        postData?: any;
    }

    const check: NewHar = {
        url: dep.url,
        method: dep.method,
        httpVersion: dep.httpVersion,
        headers: dep.headers,
        queryString: dep.queryString,
        bodySize: dep.bodySize,
        postData: dep.getPostData() ? dep.getPostData() : null,
    };
    if (check.postData == null) {
        delete check.postData;
    }

    return check;
}

const removeEmpty = (obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
      else if (obj[key] === undefined) delete obj[key];
    });
    return obj;
};

function makeAndRunSimple(script: string, url='http://example.com/'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.analyze(url);
    return analyzer;
}

describe("Analyzer mining HARs for JS DEPs (from task 6.3) - part 2", () => {
    
    it("task6.3 8-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/8.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/8.html';
        const analyzer = makeAndRunSimple(script, url);
        expect(analyzer.hars.length).toEqual(1);
        const har = makeSimpleHar(analyzer.hars[0]);
        expect(har).toEqual({
            queryString : [
               {
                  value : "134769",
                  name : "id"
               },
               {
                  name : "disable_layout",
                  value : "1"
               }
            ],
            bodySize : 0,
            url : "http://js-training.seclab/news/news/view?id=134769&disable_layout=1",
            headers : [
               {
                  name : "Host",
                  value : "js-training.seclab"
               }
            ],
            method : "GET",
            httpVersion : "HTTP/1.1"
        });
    });

    it("task6.3 9-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/9.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/9.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/9.json`, "utf-8"));
        expect(analyzer.hars.length).toEqual(5);
        let hars : any[] = [];
        analyzer.hars.forEach(h => {
            hars.push(makeSimpleHar(h));
        });
        for (let i = 0; i < 5; i++) {
            expect(hars).toContain(check[i]);
        }
    });

    it("task6.3 10-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/10.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/10.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(__dirname + '/../data/6_3task_tests/10.json', "utf-8"));
        expect(analyzer.hars.length).toEqual(6);
        let hars : any[] = [];
        analyzer.hars.forEach(h => {
            hars.push(makeSimpleHar(h));
        });
        for (let i = 0; i < 6; i++) {
            expect(hars).toContain(check[i]);
        }
    });

    it("task6.3 11-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/11.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/11.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/11.json`, "utf-8"));
        expect(analyzer.hars.length).toBeGreaterThanOrEqual(18);
        let hars : any[] = [];
        analyzer.hars.forEach(h => {
            hars.push(makeSimpleHar(h));
        });
        for (let i = 0; i < 18; i++) {
            expect(hars).toContain(check[i]);
        }
    });

    it("task6.3 12-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/12.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/12.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(__dirname + '/../data/6_3task_tests/12.json', "utf-8"));
        expect(analyzer.hars.length).toEqual(5);
        let hars : any[] = [];
        analyzer.hars.forEach(h => {
            hars.push(makeSimpleHar(h));
        });
        for (let i = 0; i < 5; i++) {
            expect(hars).toContain(check[i]);
        }
    });

    it("task6.3 13-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/13.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/13.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(__dirname + '/../data/6_3task_tests/13.json', "utf-8"));
        expect(analyzer.hars.length).toEqual(2);
        let hars : any[] = [];
        analyzer.hars.forEach(h => {
            hars.push(makeSimpleHar(h));
        });
        for (let i = 0; i < 2; i++) {
            expect(hars).toContain(check[i]);
        }
    });

    it("task6.3 14-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/14.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/14.html';
        const analyzer = makeAndRunSimple(script, url);
        expect(analyzer.hars.length).toEqual(1);
        const har = makeSimpleHar(analyzer.hars[0]);
        expect(har).toEqual({
            "queryString" : [
               {
                  "value" : "",
                  "name" : "UNKNOWN"
               }
            ],
            "method" : "GET",
            "headers" : [
               {
                  "value" : "js-training.seclab",
                  "name" : "Host"
               }
            ],
            "bodySize" : 0,
            "url" : "http://js-training.seclab/api/channel/playlists?UNKNOWN",
            "httpVersion" : "HTTP/1.1"
        });
    });

    it("task6.3 15-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/15.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/15.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/15.json`, "utf-8"));
        expect(analyzer.hars.length).toBeGreaterThanOrEqual(2);
        let hars : any[] = [];
        analyzer.hars.forEach(h => {
            hars.push(makeSimpleHar(h));
        });
        for (let i = 0; i < 2; i++) {
            expect(hars).toContain(check[i]);
        }
    });

    it("task6.3 22-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/22.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/22.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/22.json`, "utf-8"), function(k, v) {
            if (v === "UNKNOWN") {
                return UNKNOWN;
            }
            return v;
        });
        
        expect(analyzer.hars.length).toBeGreaterThanOrEqual(30);
        let hars : any[] = [];
        analyzer.hars.forEach(h => {
            hars.push(makeSimpleHar(h));
        });
        hars = removeEmpty(hars);
        for (let i = 0; i < 30; i++) {
            expect(hars).toContain(check[i]);
        }
    });

    it("task6.3 26-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/26.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/26.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(__dirname + '/../data/6_3task_tests/26.json', "utf-8"));
        expect(analyzer.hars.length).toEqual(2);
        let hars : any[] = [];
        analyzer.hars.forEach(h => {
            hars.push(makeSimpleHar(h));
        });
        for (let i = 0; i < 2; i++) {
            expect(hars).toContain(check[i]);
        }
    });
});