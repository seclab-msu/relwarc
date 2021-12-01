import { makeAndRunSimple } from '../utils/utils';
import { hasattr } from '../../../src/utils/common';

describe('Test ValueSet', () => {
    it('basic - if', () => {
        const src = `
        let x;
        if (hui()) {
            x = 5;
        } else {
            x = 8;
        }
        fetch('/test?x=' + x);
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/test?x=5']
        });

        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/test?x=8']
        });
    });
    it('basic - ternary', () => {
        const src = `
        let x = hui() ? 5 : 8;
        fetch('/test?x=' + x);
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/test?x=5']
        });

        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/test?x=8']
        });
    });
    it('if - overwrite', () => {
        const src = `
        let x;
        if (hui()) {
            x = 5;
        } else {
            x = 8;
        }
        x = 9;
        fetch('/test?x=' + x);
        `;

        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));

        expect(res as object[]).toEqual([{
            funcName: 'fetch',
            args: ['/test?x=9']
        }]);
    });
    describe('object props', () => {
        it('assign', () => {
            const src = `
            let x = hui() ? { a: 10 } : { a: 20 };

            x.b = 22;
            $.ajax('/test', { data: x });
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', {
                    data: {
                        a: 10,
                        b: 22
                    }
                }]
            });

            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', {
                    data: {
                        a: 20,
                        b: 22
                    }
                }]
            });
        });
        it('assign - overwrite', () => {
            const src = `
            let x = hui() ? { a: 10 } : { a: 20 };

            x.a = 22;
            $.ajax('/test', { data: x });
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(1);

            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', {
                    data: {
                        a: 22
                    }
                }]
            });
        });
        it('read', () => {
            const src = `
            let x = hui() ? { a: 10 } : { a: 20 };

            let y = x.a;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=10']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=20']
            });
        });
        it('read prop with name "values"', () => {
            const src = `
            let x = hui() ? { values: 10 } : { values: 20 };

            let y = x.values;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=10']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=20']
            });
        });
        it('read overwritten', () => {
            const src = `
            let x = hui() ? { a: 10 } : { a: 20 };

            x.a = 30;

            let y = x.a;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(1);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=30']
            });
        });
        it('read - one of values is null', () => {
            const src = `
            let x = hui() ? { a: 10 } : null;

            let y = x.a;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=10']
            });
        });
        it('read - one of values is undefined', () => {
            const src = `
            let x = hui() ? { a: 10 } : undefined;

            let y = x.a;

            fetch('/test?y=' + y);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?y=10']
            });
        });
        it('read prop with multi name', () => {
            const src = `
            let x = { a: 10, b: 20 };
            let y = nonexist() ? 'a' : 'b';

            fetch('/test?param=' + x[y]);
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?param=10']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?param=20']
            });
        });
    });
    describe('call chains', () => {
        it('ternary', () => {
            const src = `
            function f(x) {
                const v = hui() ? x : x + 1;

                fetch('/test?v=' + v);
            }
            function g() {
                f(5);
            }
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?v=5']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?v=6']
            });
        });
        it('FROM_ARG substring', () => {
            const src = `
            function f(x) {
                let v;

                if (hui()) {
                    v = 'kek_' + x;
                } else {
                    v = x + '_lol';
                }

                fetch('/test?v=' + v);
            }
            function g() {
                f('test');
            }
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?v=kek_test']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?v=test_lol']
            });
        });
        it('FROM_ARG in deeper object', () => {
            const src = `
            function f(x) {
                let v;

                if (hui()) {
                    v = {
                        n: ['kek_' + x]
                    }
                } else {
                    v = {
                        m: [x + '_lol']
                    }
                }

                $.ajax('/test', { data: v });
            }
            function g() {
                f('test');
            }
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);


            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', {
                    data: {
                        n: ['kek_test']
                    }
                }]
            });

            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', {
                    data: {
                        m: ['test_lol']
                    }
                }]
            });
        });
    });
    describe('builtins', () => {
        it('String.prototype.concat', () => {
            const src = `
            function f() {
                var x = hui() ? 'foo' : 'bar';
                var url = '/test?x='.concat(x);

                fetch(url);
            }
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?x=foo']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?x=bar']
            });
        });
        it('String.prototype.replace', () => {
            const src = `
            function f() {
                var x = hui() ? 'x' : 'n';
                var url = '/test?x=' + 'test'.replace('s', x);

                fetch(url);
            }
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?x=text']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?x=tent']
            });
        });
        xit('String.prototype.replaceAll (delayed till browser upgrade)', () => {
            const src = `
            function f() {
                var x = hui() ? 'l' : 'd';
                var url = '/test?x=' + 'test'.replaceAll('t', x);

                fetch(url);
            }
            `;

            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));

            expect(res.length).toBeGreaterThanOrEqual(2);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?x=lesl']
            });

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/test?x=desd']
            });
        });
    });
    describe('nested ValueSet', () => {
        it('ternary and "+"', () => {
            const src = `
            let path = is_admin === true ? '/admin': '/user';
            let hostname = local === true ? 'dev.server': 'prod.server';
            let finalUrl = hostname + path;
            fetch(finalUrl);
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res.length).toBeGreaterThanOrEqual(4);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['dev.server/admin']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['dev.server/user']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['prod.server/admin']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['prod.server/user']
            });
        });
        it('if statement with ternary and plus', () => {
            const src = `
            let url;
            if (isBranch) {
                url = 'test.host';
            } else if (isSecondBranch) {
                url = 'test2.host';
            } else {
                url = 'prod.host';
            }
            let path = needPath ? '/kek': '/';
            let finalUrl = url + path;
            fetch(finalUrl);
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res.length).toBeGreaterThanOrEqual(6);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test.host/kek']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test.host/']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test2.host/kek']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test2.host/']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['prod.host/kek']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['prod.host/']
            });
        });
        xit('some operation applied to ValueSet (delayed till #6869 will be complete)', () => {
            const src = `
            let url;
            if (someFunc()) {
                url = 'test.com';
            } else {
                url = 'test2.com';
            }
            url += '/api/';
            path = isProd()? 'prod': 'stand';
            const finalURL = url + path;
            fetch(finalUrl);
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res.length).toBeGreaterThanOrEqual(6);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test.com/api/prod']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test2.com/api/prod']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test.com/api/stand']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test2.com/api/stand']
            });
        });
        xit('if statement with ternary + concat (delayed till #6862 will be complete)', () => {
            const src = `
            let url;
            if (isBranch) {
                url = 'test.host';
            } else if (isSecondBranch) {
                url = 'test2.host';
            } else {
                url = 'prod.host';
            }
            let path = needPath ? '/kek': '/';
            let finalUrl = url.concat(path);
            fetch(finalUrl);
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res.length).toBeGreaterThanOrEqual(6);

            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test.host/kek']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test.host/']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test2.host/kek']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['test2.host/']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['prod.host/kek']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['prod.host/']
            });
        });
        xit('nested ternary', () => {
            const src = `
            let data = {};
            isAdmin ? (
                isSuperAdmin? data.role = 'SuperAdmin': data.role = 'Admin'
            ) : data.role = 'User';
            data.twoAuth = need2Auth ? true: false;
            $.ajax('/test', { data: data });
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res.length).toBeGreaterThanOrEqual(6);

            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', { 'data': { 'role': 'User', 'twoAuth': true } }]
            });
            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', { 'data': { 'role': 'User', 'twoAuth': true } }]
            });
            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', { 'data': { 'role': 'SuperAdmin', 'twoAuth': true } }]
            });
            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', { 'data': { 'role': 'SuperAdmin', 'twoAuth': true } }]
            });
            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', { 'data': { 'role': 'Admin', 'twoAuth': true } }]
            });
            expect(res as object[]).toContain({
                funcName: '$.ajax',
                args: ['/test', { 'data': { 'role': 'Admin', 'twoAuth': true } }]
            });
        });
    });
    describe('ValueSet in propName', () => {
        it('basic ternary', () => {
            const src = `
            const prop = someBranch ? 'kek': 'lol';
            let data = {};
            data[prop] = 'test';
            `;
            const analyzer = makeAndRunSimple([src], false);
            const data = analyzer.getVariable('data');
            const expectedKeys = [
                'kek', 'lol',
            ];
            for (const key in data as object) {
                if (hasattr(data as object, key)) {
                    expect(expectedKeys).toContain(key);
                }
            }
        });
        it('basic if statement', () => {
            const src = `
            let prop;
            if (someFunc()) {
                prop = 'kek';
            } else {
                prop = 'lol';
            }
            let data = {};
            data[prop] = 'test';
            `;
            const analyzer = makeAndRunSimple([src], false);
            const data = analyzer.getVariable('data');
            const expectedKeys = [
                'kek', 'lol',
            ];
            for (const key in data as object) {
                if (hasattr(data as object, key)) {
                    expect(expectedKeys).toContain(key);
                }
            }
        });
        it('assignment ValueSet to obj with existed props', () => {
            const src = `
            let data = {
                url: 'http://www.test.com'
            };
            let prop = someFunc() ? 'kek': 'lol';
            data[prop] = 'something...';
            `;
            const analyzer = makeAndRunSimple([src], false);
            const data = analyzer.getVariable('data');
            const expectedKeys = [
                'kek', 'lol', 'url',
            ];
            for (const key in data as object) {
                if (hasattr(data as object, key)) {
                    expect(expectedKeys).toContain(key);
                }
            }
        });
        it('ternary op inside property', () => {
            const src = `
            let data = {
                url: 'http://www.test.com'
            };
            data[someFunc() ? 'kek': 'lol'] = 'something...';
            `;
            const analyzer = makeAndRunSimple([src], false);
            const data = analyzer.getVariable('data');
            const expectedKeys = [
                'kek', 'lol', 'url',
            ];
            for (const key in data as object) {
                if (hasattr(data as object, key)) {
                    expect(expectedKeys).toContain(key);
                }
            }
        });
        it('assigment to prop checked by equality', () => {
            const src = `
            let data = {
                url: 'http://www.test.com',
                someProp: 'test'
            };
            const p = someFunc() ? 'someProp': 'prop2';
            for (const key in data) {
                if (key === p) {
                    data[key] = 'kek';
                }
            }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const data = analyzer.getVariable('data');
            const expectedKeys = [
                'url', 'someProp', 'prop2',
            ];
            for (const key in data as object) {
                if (hasattr(data as object, key)) {
                    expect(expectedKeys).toContain(key);
                }
            }
        });
        it('assigment ValueSet to existed viriable', () => {
            const src = `
            const prop = 'testProp';
            prop = someFunc()? 'newProp': 'otherProp';
            let data = {};
            data[prop] = 'test';
            `;
            const analyzer = makeAndRunSimple([src], false);
            const data = analyzer.getVariable('data');
            const expectedKeys = [
                'testProp', 'newProp', 'otherProp',
            ];
            for (const key in data as object) {
                if (hasattr(data as object, key)) {
                    expect(expectedKeys).toContain(key);
                }
            }
        });
    });
});
