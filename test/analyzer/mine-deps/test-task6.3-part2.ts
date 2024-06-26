import { runSingleTestHAR, runSingleTestHARFromFile, makeAndRunSimple, makeUnorderedHARS } from '../utils/utils';
import * as fs from 'fs';

describe('Analyzer mining HARs for JS DEPs (from task 6.3) - part 2', () => {
    it('task6.3 8-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/8.js').toString()
        ];
        runSingleTestHAR(
            scripts,
            {
                queryString: [
                    {
                        value: '134769',
                        name: 'id'
                    },
                    {
                        name: 'disable_layout',
                        value: '1'
                    }
                ],
                bodySize: 0,
                url: 'http://js-training.seclab/news/news/view?id=134769&disable_layout=1',
                headers: [
                    {
                        name: 'Host',
                        value: 'js-training.seclab'
                    }
                ],
                method: 'GET',
                httpVersion: 'HTTP/1.1'
            },
            'http://js-training.seclab/js-dep/func-args/samples/computed/8.html',
        );
    });

    it('task6.3 9-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/9.js').toString()
        ];
        const url = 'http://js-training.seclab/js-dep/func-args/samples/computed/9.html';
        const checkingHAR = __dirname + '/../data/6_3task_tests/9.json';
        const checkingHARWithRegexUrl = __dirname + '/../data/6_3task_tests/9-regexurl.json';
        const analyzer = makeAndRunSimple(scripts, true, url);
        let convertedHars = JSON.parse(JSON.stringify(analyzer.hars));
        convertedHars = makeUnorderedHARS(convertedHars);
        let harsForCheck = JSON.parse(
            fs.readFileSync(checkingHAR).toString()
        );
        harsForCheck = makeUnorderedHARS(harsForCheck);
        let harsForCheckWithRegexUrl = JSON.parse(
            fs.readFileSync(checkingHARWithRegexUrl).toString()
        );
        harsForCheckWithRegexUrl = makeUnorderedHARS(harsForCheckWithRegexUrl);

        for (let i = 0; i < harsForCheck.length; i++) {
            expect(convertedHars).toContain(harsForCheck[i]);
        }
        harsForCheckWithRegexUrl.forEach(function (testHAR) {
            let isMatched = false;
            const testUrlRegex = new RegExp(testHAR.url);
            convertedHars.forEach(function (resultHAR) {
                const resultUrl = resultHAR.url;
                if (testUrlRegex.test(resultUrl)) {
                    isMatched = true;
                    delete resultHAR.url;
                    delete testHAR.url;
                    expect(resultHAR).toEqual(testHAR);
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
        runSingleTestHARFromFile(
            scripts,
            __dirname + '/../data/6_3task_tests/10.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/10.html',
        );
    });

    it('task6.3 11-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/11.js').toString()
        ];
        runSingleTestHARFromFile(
            scripts,
            __dirname + '/../data/6_3task_tests/11.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/11.html',
        );
    });

    it('task6.3 12-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/12.js').toString()
        ];
        runSingleTestHARFromFile(
            scripts,
            __dirname + '/../data/6_3task_tests/12.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/12.html',
        );
    });

    it('task6.3 13-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/13.js').toString()
        ];
        runSingleTestHARFromFile(
            scripts,
            __dirname + '/../data/6_3task_tests/13.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/13.html',
        );
    });

    it('task6.3 14-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/14.js').toString()
        ];
        runSingleTestHAR(
            scripts,
            {
                queryString: [
                    {
                        value: '',
                        name: 'UNKNOWN'
                    }
                ],
                method: 'GET',
                headers: [
                    {
                        value: 'js-training.seclab',
                        name: 'Host'
                    }
                ],
                bodySize: 0,
                url: 'http://js-training.seclab/api/channel/playlists?UNKNOWN',
                httpVersion: 'HTTP/1.1'
            },
            'http://js-training.seclab/js-dep/func-args/samples/computed/14.html',
        );
    });

    it('task6.3 15-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/15.js').toString()
        ];
        runSingleTestHARFromFile(
            scripts,
            __dirname + '/../data/6_3task_tests/15.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/15.html',
        );
    });

    it('task6.3 22-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/22.js').toString()
        ];
        runSingleTestHARFromFile(
            scripts,
            __dirname + '/../data/6_3task_tests/22.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/22.html',
        );
    });

    it('task6.3 26-th test', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6_3task_tests/26.js').toString()
        ];
        runSingleTestHARFromFile(
            scripts,
            __dirname + '/../data/6_3task_tests/26.json',
            'http://js-training.seclab/js-dep/func-args/samples/computed/26.html',
        );
    });
});
