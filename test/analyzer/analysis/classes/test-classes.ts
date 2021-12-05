import { makeAndRunSimple } from '../../utils/utils';

describe('Test support for OOP (Classes):', () => {
    it('value assigned in ctor and used in method', () => {
        const src = `
            class T {
                constructor() {
                    this.field = 'abcd123';
                }
                method() {
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
    it('value assigned in one method and used in another', () => {
        const src = `
            class T {
                method1() {
                    this.field = 'abcd123';
                }
                method2() {
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
    it('value used in method coming before one where it\'s assigned', () => {
        const src = `
            class T {
                method1() {
                    fetch('/tst/' + this.field);
                }
                method2() {
                    this.field = 'abcd123';
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
    it('value assigned in ctor and read from instance', () => {
        const src = `
            class T {
                constructor() {
                    this.field = 'abcd123';
                }
            }
            function f() {
                var v = new T();

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
                class T {
                    constructor() {
                        this.field = 'abcd123';
                    }
                }
                var v = new T();

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
            class T {
                constructor() {
                    this.field = 'abcd123';
                }
                method1() {
                    this.field = this.field + '56'
                }
            }
            function f() {
                var v = new T();

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
    describe('class decl, and instance is reassigned', () => {
        it('to global var', () => {
            const src = `
                class T {
                    constructor() {
                        this.field = 'abcd123';
                    }
                }
                var gT = T;
                function f() {
                    var v = new gT();

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
                class T {
                    constructor() {
                        this.field = 'abcd123';
                    }
                }
                function f() {
                    var lt = T;
                    var v = new lt();

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
                class T {
                    constructor() {
                        this.field = 'abcd123';
                    }
                }
                function f() {
                    var lt, lt2;

                    lt = T;
                    lt2 = lt;

                    var v = new lt2();

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
    describe('class expression', () => {
        it('value assigned in ctor and used in method', () => {
            const src = `
                function f() {
                    var Cls = class {
                        constructor() {
                            this.field = 'abcd123';
                        }
                        method() {
                            fetch('/tst/' + this.field);
                        }
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
                    var Cls = class {
                        constructor() {
                            this.field = 'abcd123';
                        }
                    }

                    var inst = new Cls();
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
                    var Cls = class {
                        method1() {
                            this.field2 = 'kek/' + this.field;
                        }

                        method2() {
                            this.field = 'abcd123';
                        }
                    }

                    var inst = new Cls();
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
});
