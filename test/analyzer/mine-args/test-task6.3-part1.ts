import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTest } from '../run-tests-helper';
import { UNKNOWN } from '../../../src/analyzer/types/unknown';
import * as fs from 'fs';

describe('Analyzer finding args of DEP sinks (from task 6.3) - part 1', () => {
    it('sample 1', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/1.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        url: '/jp/eltex/xsp/ajax/custom/AjaxSuggestBean.json',
                        dataType: 'json',
                        type: 'GET',
                        cache: false,
                        data: {
                            q: UNKNOWN,
                        },
                        success: UNKNOWN,
                        error: UNKNOWN,
                    },
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/1.html'
        );
    });

    it('sample 2', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/2.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        url: '/doing/actions.php',
                        data: {
                            n: 'x85',
                        },
                    },
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html'
        );
        runSingleTest(
            scripts,
            {
                'funcName': 'fetch',
                'args': [
                    '/doing/actions.php',
                    {
                        method: 'PUT',
                        body: 'xn=85',
                        headers: {
                            'X-Tok': 'abcd',
                        },
                    },
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/${test}.html'
        );
    });

    it('sample 3', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/3.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$http.get',
                'args': [
                    '/Umbraco/EuroNCAP/Widgets/GetTweets/17131'
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/3.html'
        );
    });

    it('sample 4', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/4.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                'funcName': 'fetch',
                'args': [
                    '/stats/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body:
                            'action=wikiPageView&url=http%3A%2F%2Fjs-training.seclab%2Fjs-dep%2Ffunc-args%2Fsamples%2Fcomputed%2F4.html',
                    },
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/4.html'
        );
    });

    it('sample 5', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/5.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                'funcName': 'fetch',
                'args': [
                    'http://www.aninews.in/devices/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: '{"registration_id":"UNKNOWN","type":"web"}',
                        credentials: 'include',
                    },
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/5.html'
        );
    });

    it('sample 6', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/6.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$http',
                'args': [
                    {
                        method: 'GET',
                        url: 'https://www.site24x7.com/benchmarks/app?vertical=UNKNOWN&daySeparator=UNKNOWN',
                    },
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/6.html'
        );
    });

    it('sample 7', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/7.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                funcName: 'fetch',
                args: [
                    '/ODVA/_vti_bin/OID.SharePoint.FormBuilder/submissions.svc/',
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'content-type': 'application/json',
                            'X-RequestDigest': UNKNOWN,
                        },
                        body:
                            '{"formId":"83e3b0f2-1aea-4e88-a9f7-70c399316d2e","formState":"UNKNOWN","fieldValues":"UNKNOWN","reCaptchaResponse":"UNKNOWN","files":"UNKNOWN"}',
                    },
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/7.html'
        );
    });

    it('sample 18', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/18.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/check/18_args.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/18.html'
        );
    });

    xit('sample 19 (coming soon)', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/19.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/check/19_args.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/19.html'
        );
    });

    it('sample 20', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/20.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/check/20_args.json',
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/20.html'
        );
    });

    it('sample 21', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/21.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                funcName: 'fetch',
                args: [
                    'https://report.seznamzpravy.cz.test.js-training.seclab/report/custom',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:
                            '{"$type":"runner:error","message":"UNKNOWN","stack":"UNKNOWN"}',
                    },
                ],
            } as SinkCall,
            false,
            'http://js-training.seclab/js-dep/func-args/samples/computed/21.html'
        );
    });
});
