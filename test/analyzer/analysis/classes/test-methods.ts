import { makeAndRunSimple } from '../../utils/utils';

describe('Test support of class method calls:', () => {
    it('class method transforms value', () => {
        const src = `
            class Cl {
                meth1(x) {
                    return x + 5;
                }
            }

            function f() {
                var ob = new Cl();
                var y = ob.meth1(6);

                fetch('/x?a=' + y);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/x?a=11']
        });
    });
    it('setter', () => {
        const src = `
            class RequestSender {
                constructor() {
                    this.baseURL = null;
                }
                setBaseURL(u) {
                    return this.baseURL = u;
                }
                sendRequest(endpoint) {
                    fetch(this.baseURL + '/' + endpoint);
                }
            }

            function f() {
                var reqSender = new RequestSender();
                reqSender.setBaseURL('/api/base');

                reqSender.sendRequest('action.aspx?param=123');
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/action.aspx?param=123']
        });
    });
    it('setter called from constructor', () => {
        const src = `
            class RequestSender {
                constructor() {
                    this.setParams('param', '123');
                }
                setParams(name, value) {
                    this.params = name + '=' + value;
                }
                sendRequest(base) {
                    fetch(base + '?' + this.params);
                }
            }

            function f() {
                var reqSender = new RequestSender();

                reqSender.sendRequest('/api/action');
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/action?param=123']
        });
    });
    xit('method sets value through other method', () => { // TODO: needs additional analysis pass
        const src = `
            class TestClass{
                constructor() {
                    this.datum = null;
                }

                f1(a) {
                    this.datum = a;
                }

                f2(b) {
                    this.f1(b);
                    fetch('/api/' + this.datum);
                }
            }

            function testing() {
                var pc = new TestClass();

                pc.f2('endp.oint?foo=bar');
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/endp.oint?foo=bar']
        });
    });
    xit('method sets value through other method - vanilla', () => { // TODO: needs additional analysis pass
        const src = `
            function TestClass() {
                this.datum = null;
            }

            TestClass.prototype.f1 = function(a) {
                this.datum = a;
            }

            TestClass.prototype.f2 = function(b) {
                this.f1(b);
                fetch('/api/' + this.datum);
            }


            function testing() {
                var pc = new TestClass();

                pc.f2('endp.oint?foo=bar');
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/endp.oint?foo=bar']
        });
    });
    it('priv8 method (setter)', () => {
        const src = `
            class TestClass{
                constructor() {
                    this.baseURL = null;
                }

                #setup(a) {
                    this.baseURL = '/api/base';
                }

                initialize() {
                    this.#setup();
                }

                doReq(x) {
                    fetch(this.baseURL + '/endpoi.nt?x=' + x);
                }
            }

            function testing() {
                var pc = new TestClass();

                pc.doReq(34);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/endpoi.nt?x=34']
        });
    });
    it('"this" still works with exotic method name', () => {
        const src = `
            var strangeMethodName = generateMethodName();
            class TestClass{
                constructor() {
                    this.baseURL = '/api/base/test';
                }

                [strangeMethodName]() {
                    var u = this.baseURL + '/action.php?param=test';
                    this.sendreq(u);
                }

                sendreq(reqURL) {
                    $.ajax({
                        url: reqURL
                    });
                }
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: '$.ajax',
            args: [{ url: '/api/base/test/action.php?param=test' }]
        });
    });
});
