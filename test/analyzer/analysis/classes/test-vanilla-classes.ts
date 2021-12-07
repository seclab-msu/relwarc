import { makeAndRunSimple } from '../../utils/utils';

describe('Test support for OOP (Vanilla Classes):', () => {
    it('value assigned in ctor and used in prototype method', () => {
        const src = `
            function fetcher() {
                this.path = '/path';
            }

            fetcher.prototype._fetch = function() {
                fetch(this.path);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/path']
        });
    });
    it('value assigned in one method and used in another', () => {
        const src = `
            function fetcher() {}

            fetcher.prototype.initPath = function() {
                this.path = '/path';
            }

            fetcher.prototype._fetch = function() {
                fetch(this.path);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/path']
        });
    });
    it('value used in method coming before one where it\'s assigned', () => {
        const src = `
            function fetcher() {}

            fetcher.prototype.method1 = function() {
                fetch('/tst/' + this.field);
            }

            fetcher.prototype.method2 = function() {
                this.field = 'abcd123';
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd123']
        });
    });
    it('value assigned in ctor and read from instance', () => {
        const src = `
            function store() {
                this.field = 'abcd123';
            }

            function f() {
                var v = new store();

                fetch('/tst/' + v.field);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd123']
        });
    });
    it('value assigned in ctor and read from instance - local decl', () => {
        const src = `
            function f() {
                function store() {
                    this.field = 'abcd123';
                }

                var v = new store();

                fetch('/tst/' + v.field);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd123']
        });
    });
    it('value assigned in ctor, modified in method, used from instance', () => {
        const src = `
            function store() {
                this.field = 'abcd123';
            }

            store.prototype.method1 = function() {
                this.field = this.field + '56';
            }

            function f() {
                var v = new store();

                fetch('/tst/' + v.field);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd12356']
        });
    });
    it('method assigned in ctor, modified value, used from instance', () => {
        const src = `
            function store() {
                this.field = 'abcd123';
                this.method = function() {
                    this.field = this.field + '56';
                }
            }

            function f() {
                var v = new store();

                fetch('/tst/' + v.field);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd12356']
        });
    });
    it('declared method assigned in ctor, modified value, used from instance', () => {
        const src = `
            function store() {
                this.field = 'abcd123';
                function a() {
                    this.field = this.field + '56';
                }
                this.method = a;
            }

            function f() {
                var v = new store();

                fetch('/tst/' + v.field);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd12356']
        });
    });
    it('declared arrow method assigned in ctor, modified value, used from instance', () => {
        const src = `
            function store() {
                this.field = 'qwe';
                let b = () => {
                    this.field = this.field + 'zxy';
                }
                this.method = b;
            }

            function f() {
                var v = new store();

                fetch('/tst/' + v.field);
            }
        `;
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/qwezxy']
        });
    });
    describe('vanilla class decl, and instance is reassigned', () => {
        it('to global var', () => {
            const src = `
                function store() {
                    this.field = 'abcd123';
                }
                var reStore = store;
                function f() {
                    var v = new reStore();

                    fetch('/tst/' + v.field);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst/abcd123']
            });
        });
        it('to local var', () => {
            const src = `
                function store() {
                    this.field = 'abcd123';
                }

                function f() {
                    var reStore = store;
                    var v = new reStore();

                    fetch('/tst/' + v.field);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst/abcd123']
            });
        });
        it('double reassignment', () => {
            const src = `
                function store() {
                    this.field = 'abcd123';
                }

                function f() {
                    var reStore, reStore2;

                    reStore = store;
                    reStore2 = reStore;

                    var v = new reStore2();

                    fetch('/tst/' + v.field);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst/abcd123']
            });
        });
    });
    describe('vanilla class expression', () => {
        it('value assigned in ctor and used in method', () => {
            const src = `
                function f() {
                    var store = function() {
                        this.field = 'abcd123';
                    }
                    store.prototype.fetcher = function() {
                        fetch('/tst/' + this.field);
                    }
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst/abcd123']
            });
        });
        it('value assigned in ctor and used in instance', () => {
            const src = `
                function f() {
                    var store = function() {
                        this.field = 'abcd123';
                    }

                    var inst = new store();
                    fetch('/tst/' + inst.field);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst/abcd123']
            });
        });
        it('value used in method coming before one where assigned', () => {
            const src = `
                function f() {
                    var store = function() {}

                    store.prototype.method1 = function() {
                        this.field2 = 'kek/' + this.field;
                    }

                    store.prototype.method2 = function() {
                        this.field = 'abcd123';
                    }

                    var inst = new store();
                    fetch('/tst/' + inst.field2);
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst/kek/abcd123']
            });
        });
    });
    describe('method names are correctly determined', () => {
        it('in prototype assinment', () => {
            const src = `
                function TestClass() {
                    this.base = '/testapi/actions/';
                }

                TestClass.prototype.testMethod1 = function(a) {
                    fetch(this.base + 'do.action?' + a);
                }

                function testing() {
                    var pc = new TestClass();

                    pc.testMethod1('x=3');
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/testapi/actions/do.action?x=3']
            });
        });
        it('in this assinment', () => {
            const src = `
                function TestClass() {
                    this.base = '/testapi/actions/';
                    this.testMethod1 = function(a) {
                        fetch(this.base + 'do.action?' + a);
                    }
                }

                function testing() {
                    var pc = new TestClass();

                    pc.testMethod1('x=3');
                }
            `;
            const analyzer = makeAndRunSimple([src], false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/testapi/actions/do.action?x=3']
            });
        });
    });
});
