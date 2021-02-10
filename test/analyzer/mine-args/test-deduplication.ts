import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTestSinkCall, makeAndRunSimple } from '../utils';
import { UNKNOWN } from '../../../src/analyzer/types/unknown';

describe('DEP sink call args are deduplicated', () => {
    it('with two identical calls', () => {
        const scripts = [
            `fetch('/123');
            fetch('/123');`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            false
        );
        expect(analyzer.results.length).toEqual(1);
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': [
                    '/123'
                ]
            } as SinkCall,
        );
    });

    it('with different calls producing the same args', () => {
        const scripts = [
            `$.ajax("/test1234", {
                'method': "POST",
                data: {
                    x: 33,
                    y: [5, 6, 7, 8, {"te": "st"}]
                }
            });
            var l = "O",
                ob = {"te": "st"},
                arr = [5, 6, 7, 8, ob];
            if (window.name === "lal") {
                var conf = {
                    "data": {"y": arr, x: 33},
                    method: "P" + l + "ST"
                };
                $.ajax("/test1234", conf);
            } else {
                $.ajax("/te" + "st1234", {
                    method: "POST", data: {
                        x: 30 + 3, y: arr
                    }
                });
            }`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    '/test1234',
                    {
                        'method': 'POST',
                        'data':
                        {
                            x: 33,
                            y: [5, 6, 7, 8, { 'te': 'st' }]
                        }
                    }
                ]
            } as SinkCall,
        );
    });


    it('with two sets of duplicates', () => {
        const scripts = [
            `if (window.name === 'kek') {
                if (Math.random > 0.01) {
                    fetch('/kek');
                } else {
                    $.get('/lol');
                }
            } else {
                if (Math.random > 0.01) {
                    $.get('/lol');
                } else {
                    fetch('/kek');
                }
            }`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            false
        );
        expect(analyzer.results.length).toEqual(2);
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': [
                    '/kek'
                ]
            } as SinkCall,
        );
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.get',
                'args': [
                    '/lol'
                ]
            } as SinkCall,
        );
    });

    it('duplicate unknown value in different calls', () => {
        const scripts = [
            `$.ajax('/api/report.php', {
                data: { value: document.querySelector('#info').value }
            });
            var v = document.querySelectorAll('.moreinfo'),
                d = {
                    value: v[0].value
                };
            if (window.name === 'provideMorelInfo') {
                $.ajax('/api/report.php', { data: d });
            }`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            false
        );
        expect(analyzer.results.length).toEqual(1);
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    '/api/report.php',
                    {
                        data: {
                            value: UNKNOWN
                        }
                    }
                ]
            } as SinkCall,
        );
    });

    it('when duplication is caused by unknown val following call chain', () => {
        const scripts = [
            `function g(data) {
                var param = prompt();
                f(param);
            }
            function f(x) {
                $.ajax('/', { data: { param: x } });
            }`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            false
        );
        expect(analyzer.results.length).toEqual(1);
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    '/',
                    {
                        data: {
                            param: UNKNOWN
                        }
                    }
                ]
            } as SinkCall,
        );
    });

    it('when duplication is caused by second call following call chain', () => {
        const scripts = [
            `function g(data) {
                var param = 'info';
                f(param);
            }
            function f(x) {
                $.ajax('/', { data: { param: x } });
                fetch('/223344');
            }`
        ];
        const analyzer = makeAndRunSimple(
            scripts,
            false
        );
        expect(analyzer.results.length).toBeLessThanOrEqual(3);
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    '/',
                    {
                        data: {
                            param: 'info'
                        }
                    }
                ]
            } as SinkCall,
        );
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': ['/223344']
            } as SinkCall,
        );
    });
});
