import { SinkCall } from '../../../src/analyzer';
import { runSingleTestSinkCall, getArgsFromFile, removeEmpty, removeLocation, makeAndRunSimple } from '../utils/utils';
import { UNKNOWN } from '../../../src/types/unknown';
import * as fs from 'fs';

describe('Analyzer finding args of DEP sinks (from task 6.3) - part 2', () => {
    it('task 6.3 8-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/8.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        'async': true,
                        'url': '/news/news/view?id=134769&disable_layout=1',
                        'type': 'GET',
                        'success': UNKNOWN
                    }
                ]
            } as SinkCall,
            'http://js-training.seclab/js-dep/func-args/samples/computed/8.html',
        );
    });
    it('task6.3 9-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/9.js').toString()
        ];
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/9.html';
        const analyzer = makeAndRunSimple(scripts, false, url);
        const checkingObj = __dirname + '/../data/6_3task_tests/args9.json';
        const checkingObjWithRegexUrl = __dirname + '/../data/6_3task_tests/args9-regexurl.json';
        const argsFromFile = getArgsFromFile(checkingObj);
        const argsFromFileWithRegexUrl = getArgsFromFile(checkingObjWithRegexUrl);
        const results = removeLocation(removeEmpty(analyzer.results));
        for (let i = 0; i < argsFromFile.length; i++) {
            delete results[i].location;
            expect(results).toContain(argsFromFile[i] as SinkCall);
        }
        argsFromFileWithRegexUrl.forEach(function (test) {
            let isMatched = false;
            const testUrlRegex = new RegExp(String(test.args[0]));
            results.forEach(function (result) {
                const resultUrl = String(result.args[0]);
                if (testUrlRegex.test(resultUrl)) {
                    isMatched = true;
                    delete result.args[0];
                    delete test.args[0];
                    expect(result).toEqual(test);
                }
            });
            if (!isMatched) {
                fail(`Expected to find an url that matches with ${testUrlRegex}`);
            }
        });
    });

    it('task6.3 10-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/10.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            __dirname + '/../data/6_3task_tests/args10.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/10.html',
        );
    });

    it('task6.3 11-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/11.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            __dirname + '/../data/6_3task_tests/args11.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/11.html',
        );
    });

    it('task6.3 12-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/12.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            __dirname + '/../data/6_3task_tests/args12.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/12.html',
        );
    });

    it('task6.3 13-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/13.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            __dirname + '/../data/6_3task_tests/args13.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/13.html',
        );
    });

    it('task6.3 14-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/14.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': [
                    '/api/channel/playlists?UNKNOWN',
                    {}
                ]
            } as SinkCall,
            'http://js-training.seclab/js-dep/func-args/samples/computed/14.html',
        );
    });

    it('task6.3 15-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/15.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            __dirname + '/../data/6_3task_tests/args15.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/15.html',
        );
    });

    it('task6.3 22-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/22.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            __dirname + '/../data/6_3task_tests/args22.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/22.html',
        );
    });

    it('task6.3 26-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/26.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            __dirname + '/../data/6_3task_tests/args26.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/26.html',
        );
    });
});
