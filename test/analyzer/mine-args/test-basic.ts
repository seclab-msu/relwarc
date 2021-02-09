import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTest, makeAndRunSimple } from '../utils';


describe('Analyzer finding args of DEP sinks', () => {
    it('smoke test', function () {
        const scripts = [
            `console.log('Hello World!');`
        ];
        makeAndRunSimple(
            scripts,
            false,
            'http://test.com/test'
        );
    });

    it('finds nothing for code without DEPS', function () {
        const scripts = [
            `console.log('Hello World!');`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            false,
            'http://test.com/test'
        );
        expect(analyzer.results.length).toEqual(0);
    });

    it('handles fetch /', function () {
        const scripts = [
            `fetch('/');`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': 'fetch',
                'args': ['/']
            } as SinkCall,
            false
        );
    });

    it('handles $.ajax /', function () {
        const scripts = [
            `$.ajax('/');`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$.ajax',
                'args': ['/']
            } as SinkCall,
            false
        );
    });

    it('supports call with settings object', function () {
        const scripts = [
            `$.ajax({
                method: 'POST',
                url: 'http://test.site/action',
                data: {
                    a: 1,
                    'b': 'xx'
                }
            });`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        method: 'POST',
                        url: 'http://test.site/action',
                        data: {
                            a: 1,
                            b: 'xx'
                        }
                    }
                ]
            } as SinkCall,
            false
        );
    });

    it('supports several args', function () {
        const scripts = [
            `$.ajax('/test', {
                method: 'POST',
                url: 'http://test.site/action'
            });`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    '/test',
                    {
                        method: 'POST',
                        url: 'http://test.site/action'
                    }
                ]
            } as SinkCall,
            false
        );
    });

    it('supports integer addition', function () {
        const scripts = [
            `$.ajax({
                url: '/',
                data: { a: 5 + 4 }
            });`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        url: '/',
                        data: { a: 9 }
                    }
                ]
            } as SinkCall,
            false
        );
    });

    it('supports location.href', function () {
        const url = 'http://tst.io/testin?param=1337';
        const scripts = [
            `$.ajax({
                data: { 'myurl': location.href }
            });`
        ];
        runSingleTest(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        data: { 'myurl': url }
                    }
                ]
            } as SinkCall,
            false,
            url
        );
    });
});
