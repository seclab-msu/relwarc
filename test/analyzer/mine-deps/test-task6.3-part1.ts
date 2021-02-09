import { runSingleTest } from '../utils';
import { UNKNOWN } from '../../../src/analyzer/types/unknown';
import * as fs from 'fs';

describe('Analyzer mining HARs for JS DEPs (from task 6.3) - part 1', () => {
    it('sample 1', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/1.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url:
                    'http://js-training.seclab/jp/eltex/xsp/ajax/custom/AjaxSuggestBean.json?q=UNKNOWN',
                queryString: [
                    {
                        name: 'q',
                        value: 'UNKNOWN',
                    },
                ],
                headers: [
                    {
                        value: 'js-training.seclab',
                        name: 'Host',
                    },
                ],
                bodySize: 0,
                method: 'GET',
            },
            true,
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
                method: 'GET',
                url: 'http://js-training.seclab/doing/actions.php?n=x85',
                httpVersion: 'HTTP/1.1',
                headers: [
                    {
                        name: 'Host',
                        value: 'js-training.seclab',
                    },
                ],
                queryString: [
                    {
                        name: 'n',
                        value: 'x85',
                    },
                ],
                bodySize: 0,
            },
            true,
            'http://js-training.seclab/js-dep/func-args/samples/computed/2.html'
        );
        runSingleTest(
            scripts,
            {
                method: 'PUT',
                url: 'http://js-training.seclab/doing/actions.php',
                httpVersion: 'HTTP/1.1',
                headers: [
                    {
                        name: 'Host',
                        value: 'js-training.seclab',
                    },
                    {
                        name: 'X-Tok',
                        value: 'abcd',
                    },
                    {
                        name: 'Content-Length',
                        value: '5',
                    },
                ],
                queryString: [],
                bodySize: 5,
                postData: {
                    text: 'xn=85',
                },
            },
            true,
            'http://js-training.seclab/js-dep/func-args/samples/computed/2.html'
        );
    });

    it('sample 3', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/3.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                method: 'GET',
                httpVersion: 'HTTP/1.1',
                bodySize: 0,
                queryString: [],
                headers: [
                    {
                        value: 'js-training.seclab',
                        name: 'Host',
                    },
                ],
                url:
                    'http://js-training.seclab/Umbraco/EuroNCAP/Widgets/GetTweets/17131',
            },
            true,
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
                httpVersion: 'HTTP/1.1',
                bodySize: 106,
                method: 'POST',
                headers: [
                    {
                        name: 'Host',
                        value: 'js-training.seclab',
                    },
                    {
                        value: 'application/x-www-form-urlencoded',
                        name: 'Content-Type',
                    },
                    {
                        value: '106',
                        name: 'Content-Length',
                    },
                ],
                queryString: [],
                url: 'http://js-training.seclab/stats/',
                postData: {
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        {
                            value: 'wikiPageView',
                            name: 'action',
                        },
                        {
                            value:
                                'http%3A%2F%2Fjs-training.seclab%2Fjs-dep%2Ffunc-args%2Fsamples%2Fcomputed%2F4.html',
                            name: 'url',
                        },
                    ],
                    text:
                        'action=wikiPageView&url=http%3A%2F%2Fjs-training.seclab%2Fjs-dep%2Ffunc-args%2Fsamples%2Fcomputed%2F4.html',
                },
            },
            true,
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
                url: 'http://www.aninews.in/devices/',
                postData: {
                    text: '{"registration_id":"UNKNOWN","type":"web"}',
                    mimeType: 'application/json',
                },
                httpVersion: 'HTTP/1.1',
                method: 'POST',
                headers: [
                    {
                        value: 'www.aninews.in',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/json',
                    },
                    {
                        value: '42',
                        name: 'Content-Length',
                    },
                ],
                bodySize: 42,
                queryString: [],
            },
            true,
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
                bodySize: 0,
                url:
                    'https://www.site24x7.com/benchmarks/app?vertical=UNKNOWN&daySeparator=UNKNOWN',
                headers: [
                    {
                        name: 'Host',
                        value: 'www.site24x7.com',
                    },
                ],
                httpVersion: 'HTTP/1.1',
                method: 'GET',
                queryString: [
                    {
                        name: 'vertical',
                        value: 'UNKNOWN',
                    },
                    {
                        value: 'UNKNOWN',
                        name: 'daySeparator',
                    },
                ],
            },
            true,
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
                url:
                    'http://js-training.seclab/ODVA/_vti_bin/OID.SharePoint.FormBuilder/submissions.svc/',
                postData: {
                    text:
                        '{"formId":"83e3b0f2-1aea-4e88-a9f7-70c399316d2e","formState":"UNKNOWN","fieldValues":"UNKNOWN","reCaptchaResponse":"UNKNOWN","files":"UNKNOWN"}',
                    mimeType: 'application/json',
                },
                headers: [
                    {
                        name: 'Host',
                        value: 'js-training.seclab',
                    },
                    {
                        name: 'content-type',
                        value: 'application/json',
                    },
                    {
                        name: 'X-RequestDigest',
                        value: UNKNOWN,
                    },
                    {
                        name: 'Content-Length',
                        value: '143',
                    },
                ],
                httpVersion: 'HTTP/1.1',
                bodySize: 143,
                queryString: [],
                method: 'POST',
            },
            true,
            'http://js-training.seclab/js-dep/func-args/samples/computed/7.html'
        );
    });

    it('sample 18', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/18.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/check/18_hars.json',
            true,
            'http://js-training.seclab/js-dep/func-args/samples/computed/18.html'
        );
    });

    xit('sample 19 (coming soon)', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/19.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/check/19_hars.json',
            true,
            'http://js-training.seclab/js-dep/func-args/samples/computed/19.html'
        );
    });

    it('sample 20', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/20.js').toString()
        ];
        runSingleTest(
            scripts,
            __dirname + '/../data/check/20_hars.json',
            true,
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
                bodySize: 62,
                url:
                    'https://report.seznamzpravy.cz.test.js-training.seclab/report/custom',
                httpVersion: 'HTTP/1.1',
                headers: [
                    {
                        value: 'report.seznamzpravy.cz.test.js-training.seclab',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/json',
                    },
                    {
                        name: 'Content-Length',
                        value: '62',
                    },
                ],
                method: 'POST',
                queryString: [],
                postData: {
                    mimeType: 'application/json',
                    text:
                        '{"$type":"runner:error","message":"UNKNOWN","stack":"UNKNOWN"}',
                },
            },
            true,
            'http://js-training.seclab/js-dep/func-args/samples/computed/21.html'
        );
    });
});
