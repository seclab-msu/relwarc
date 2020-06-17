import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";
import { UNKNOWN } from '../../../src/analyzer/types/unknown';
import { makeAndRunSimple } from './common';


describe("DEP sink call args are deduplicated", () => {
    it("with two identical calls", () => {
        const analyzer = makeAndRunSimple(`
            fetch("/123");
            fetch("/123");
        `);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            funcName: "fetch",
            args: ["/123"]
        } as SinkCall);
    });

    it("with different calls producing the same args", () => {
        const analyzer = makeAndRunSimple(`
            $.ajax("/test1234", {
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
            }
        `);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            funcName: "$.ajax",
            args: ["/test1234", {
                'method': "POST",
                data: {
                    x: 33,
                    y: [5, 6, 7, 8, {"te": "st"}]
                }
            }]
        } as SinkCall);
    });

    it("with two sets of duplicates", () => {
        const analyzer = makeAndRunSimple(`
            if (window.name === "kek") {
                if (Math.random > 0.01) {
                    fetch("/kek");
                } else {
                    $.get("/lol");
                }
            } else {
                if (Math.random > 0.01) {
                    $.get("/lol");
                } else {
                    fetch("/kek");
                }
            }
        `);
        expect(analyzer.results.length).toEqual(2);
        expect(analyzer.results).toContain({
            funcName: "fetch",
            args: ["/kek"]
        } as SinkCall);
        expect(analyzer.results).toContain({
            funcName: "$.get",
            args: ["/lol"]
        } as SinkCall);
    });

    it("duplicate unknown value in different calls", () => {
        const analyzer = makeAndRunSimple(`
            $.ajax('/api/report.php', {
                data: { value: document.querySelector("#info").value }
            });
            var v = document.querySelectorAll(".moreinfo"),
                d = {
                    value: v[0].value
                };
            if (window.name === 'provideMorelInfo') {
                $.ajax('/api/report.php', { data: d });
            }
        `);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            funcName: '$.ajax',
            args: ['/api/report.php', { data: { value: UNKNOWN } }]
        } as SinkCall);
    });

    it("when duplication is caused by unknown val following call chain", () => {
        const analyzer = makeAndRunSimple(`
            function g(data) {
                var param = prompt();
                f(param);
            }
            function f(x) {
                $.ajax("/", { data: { param: x } });
            }
        `);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            funcName: '$.ajax',
            args: ['/', { data: { param: UNKNOWN } }]
        } as SinkCall);
    });

    it("when duplication is caused by second call following call chain", () => {
        const analyzer = makeAndRunSimple(`
            function g(data) {
                var param = 'info';
                f(param);
            }
            function f(x) {
                $.ajax("/", { data: { param: x } });
                fetch('/223344');
            }
        `);
        expect(analyzer.results.length).toBeLessThanOrEqual(3);
        expect(analyzer.results).toContain({
            funcName: '$.ajax',
            args: ['/', { data: { param: 'info' } }]
        } as SinkCall);
        expect(analyzer.results).toContain({
            funcName: 'fetch',
            args: ['/223344']
        } as SinkCall);
    });
});