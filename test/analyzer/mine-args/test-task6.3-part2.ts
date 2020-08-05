import { SinkCall } from "../../../src/analyzer/analyzer";
import { runSingleTest } from "../run-tests-helper";
import { UNKNOWN } from "../../../src/analyzer/types/unknown";
import * as fs from "fs";

describe("Analyzer finding args of DEP sinks (from task 6.3) - part 2", () => {
    it("task 6.3 8-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/8.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                "funcName": "$.ajax",
                "args": [
                    {
                        "async": true,
                        "url": "/news/news/view?id=134769&disable_layout=1",
                        "type": "GET",
                        "success": UNKNOWN
                    }
                ]
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/8.html'
        );
    });
    it("task6.3 9-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/9.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/6_3task_tests/args9.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/9.html'
        );
    });

    it("task6.3 10-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/10.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/6_3task_tests/args10.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/10.html'
        );
    });

    it("task6.3 11-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/11.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/6_3task_tests/args11.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/11.html'
        );
    })

    it("task6.3 12-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/12.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/6_3task_tests/args12.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/12.html'
        );
    });

    it("task6.3 13-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/13.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/6_3task_tests/args13.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/13.html'
        );
    });

    it("task6.3 14-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/14.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                "funcName": "fetch",
                "args": [
                    "/api/channel/playlists?UNKNOWN",
                    {}
                ]
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/14.html'
        );
    });

    it("task6.3 15-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/15.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/6_3task_tests/args15.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/15.html'
        );
    });

    /*it("task6.3 22-th test", () => {
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

        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/22.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/6_3task_tests/args22.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/22.html'
        );
    });*/

    it("task6.3 26-th test", () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/26.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/6_3task_tests/args26.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/26.html'
        );
    });
    
});
