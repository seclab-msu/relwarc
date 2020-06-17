import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";
const fs = require('fs'); 

import {
    UNKNOWN,
    UNKNOWN_FUNCTION,
    UNKNOWN_FROM_FUNCTION,
    isUnknown,
    isUnknownOrUnknownString
} from '../../../src/analyzer/types/unknown';

function makeAndRunSimple(script: string, url='http://example.com/'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.mineArgsForDEPCalls(url);
    return analyzer;
}

const removeEmpty = (obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
      else if (obj[key] === undefined) delete obj[key];
    });
    return obj;
};

describe("Analyzer finding args of DEP sinks", () => {
    it("smoke test", function() {
        makeAndRunSimple('console.log("Hello World!");');
    });

    it("finds nothing for code without DEPS", () => {
        const analyzer = makeAndRunSimple('console.log("Hello World!");');
        expect(analyzer.results.length).toEqual(0);     
    });
    it("task 6.3 8-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/8.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/8.html';
        const analyzer = makeAndRunSimple(script, url);

        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [
                {
                    "async": true,
                    "url": "/news/news/view?id=134769&disable_layout=1",
                    "type": "GET",
                    "success": UNKNOWN
                }
            ]
        } as SinkCall);
    });
    it("task6.3 9-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/9.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/9.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/args9.json`, "utf-8"));
        expect(analyzer.results.length).toEqual(5);
        for (let i = 0; i < 5; i++) {
            expect(analyzer.results).toContain(check[i]);
        }
    });

    it("task6.3 10-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/10.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/10.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/args10.json`, "utf-8"), function (k,v) {
            if (v === "UNKNOWN") {
                return UNKNOWN;
            }
            return v;
        });
        expect(analyzer.results.length).toEqual(6);
        for (let i = 0; i < 6; i++) {
            expect(analyzer.results).toContain(check[i]);
        }
    });

    it("task6.3 11-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/11.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/11.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/args11.json`, "utf-8"), function(k,v) {
            if (v === "UNKNOWN") {
                return UNKNOWN;
            }
            return v;
        });
        expect(analyzer.results.length).toBeGreaterThanOrEqual(18);
        for (let i = 0; i < 18; i++) {
            expect(analyzer.results).toContain(check[i]);
        }
    })

    it("task6.3 12-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/12.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/12.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/args12.json`, "utf-8"), function(k,v) {
            if (v === "UNKNOWN") {
                return UNKNOWN;
            }
            return v;
        });
        expect(analyzer.results.length).toEqual(5);
        for (let i = 0; i < 5; i++) {
            expect(analyzer.results).toContain(check[i]);
        }
    });

    it("task6.3 13-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/13.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/13.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/args13.json`, "utf-8"), function(k,v) {
            if (v === "UNKNOWN") {
                return UNKNOWN;
            }
            return v;
        });

        expect(analyzer.results.length).toEqual(2);
        for (let i = 0; i < 2; i++) {
            expect(analyzer.results).toContain(check[i]);
        }
    });

    it("task6.3 14-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/14.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/14.html';
        const analyzer = makeAndRunSimple(script, url);

        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "fetch",
            "args": [
                "/api/channel/playlists?UNKNOWN",
                {}
            ]
        } as SinkCall);
    });

    it("task6.3 15-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/15.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/15.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/args15.json`, "utf-8"), function(k,v) {
            if (v === "UNKNOWN") {
                return UNKNOWN;
            }
            return v;
        });

        expect(analyzer.results.length).toBeGreaterThanOrEqual(2);
        for (let i = 0; i < 2; i++) {
            expect(analyzer.results).toContain(check[i]);
        }
    });

    it("task6.3 22-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/22.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/22.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/args22.json`, "utf-8"), function(k,v) {
            if (v === "UNKNOWN") {
                if (k === "Content-Type") {
                    return undefined;
                }
                return UNKNOWN;
            }
            return v;
        });
       
        expect(analyzer.results.length).toBeGreaterThanOrEqual(30);
        const results = removeEmpty(analyzer.results);
        for (let i = 0; i < 30; i++) {
            expect(results).toContain(check[i]);
        }
    });

    it("task6.3 26-th test", () => {
        const script = fs.readFileSync(`${__dirname}/../data/6_3task_tests/26.js`, "utf-8");
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/26.html';
        const analyzer = makeAndRunSimple(script, url);
        const check = JSON.parse(fs.readFileSync(`${__dirname}/../data/6_3task_tests/args26.json`, "utf-8"), function(k,v) {
            if (v === "UNKNOWN") {
                return UNKNOWN;
            }
            return v;
        });

        expect(analyzer.results.length).toEqual(2);
        for (let i = 0; i < 2; i++) {
            expect(analyzer.results).toContain(check[i]);
        }
    });
    
});
