import { makeAndRunSimple } from '../../utils/utils';
import * as fs from 'fs';

describe('Test support of transpiled classes:', () => {
    it('value assigned in ctor and used in method', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/transpiled-classes/class1.js').toString()
        ];
        const analyzer = makeAndRunSimple(scripts, false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/']
        });
    });
    it('value assigned in one method and used in another', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/transpiled-classes/class2.js').toString()
        ];
        const analyzer = makeAndRunSimple(scripts, false);
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
        const scripts = [
            fs.readFileSync(__dirname + '/../data/transpiled-classes/class3.js').toString()
        ];
        const analyzer = makeAndRunSimple(scripts, false);
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
        const scripts = [
            fs.readFileSync(__dirname + '/../data/transpiled-classes/class4.js').toString()
        ];
        const analyzer = makeAndRunSimple(scripts, false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/abcd12356']
        });
    });
    xit('object field reassigned, invoked from returned value', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/transpiled-classes/class5.js').toString()
        ];
        const analyzer = makeAndRunSimple(scripts, false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/tst/new']
        });
    });
    describe('two classes', () => {
        it('two independent classes', () => {
            const scripts = [
                fs.readFileSync(__dirname + '/../data/transpiled-classes/class6.js').toString()
            ];
            const analyzer = makeAndRunSimple(scripts, false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst1/path1']
            });
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst2/path2']
            });
        });
        it('url builder helper', () => {
            const scripts = [
                fs.readFileSync(__dirname + '/../data/transpiled-classes/class7.js').toString()
            ];
            const analyzer = makeAndRunSimple(scripts, false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/a/p/i/tst/act.ion.aspx?x=foo&y=bar']
            });
        });
        it('req sender helper', () => {
            const scripts = [
                fs.readFileSync(__dirname + '/../data/transpiled-classes/class8.js').toString()
            ];
            const analyzer = makeAndRunSimple(scripts, false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/api/base/act.ion.aspx?x=foo&y=bar']
            });
        });
    });
    it('call method of initialized class', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/transpiled-classes/class9.js').toString()
        ];
        const analyzer = makeAndRunSimple(scripts, false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/act.ion.aspx?par=abc&par2=foobar']
        });
    });
    xit('class method transforms value', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/transpiled-classes/class9.js').toString()
        ];
        const analyzer = makeAndRunSimple(scripts, false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/act.ion.aspx?par=abc&par2=foobar']
        });
    });
    describe('extended classes', () => {
        it('child class: field setted in one method, used from another', () => {
            const scripts = [
                fs.readFileSync(__dirname + '/../data/transpiled-classes/class10.js').toString()
            ];
            const analyzer = makeAndRunSimple(scripts, false);
            const res = analyzer.results.map(el => ({
                funcName: el.funcName,
                args: el.args
            }));
            expect(res as object[]).toContain({
                funcName: 'fetch',
                args: ['/tst']
            });
        });
    });
});
