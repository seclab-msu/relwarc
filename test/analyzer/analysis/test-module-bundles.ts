import { readFileSync } from 'fs';
import * as path from 'path';

import { makeAndRunSimple } from '../utils/utils';

const TEST_DATA_DIR = path.join(__dirname, 'data/module-bundles');

function getTestFile(name: string): string {
    return readFileSync(path.join(TEST_DATA_DIR, name), 'utf8');
}

describe('Test ability analyze code with bundled modules', () => {
    it('webpack - separate data module', () => {
        const src = getTestFile('webpack/sep-data-module.js');
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/data?par1=123&par2=abc']
        });
    });
    it('webpack - separate requester and data module', () => {
        const src = getTestFile('webpack/sep-requester-and-data-module.js');
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/data?par1=123&par2=abc']
        });
    });
    it('webpack - separate requester and data function module', () => {
        const src = getTestFile(
            'webpack/sep-requester-and-data-function-module.js'
        );
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/data?par1=foobar&par2=456']
        });
    });
    it('webpack - exports object is assigned to export req data', () => {
        const src = getTestFile(
            'webpack/sep-data-module-exports-assigned.js'
        );
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/data?param1=123&param2=abc']
        });
    });
    it('webpack - with modern class', () => {
        const src = getTestFile('webpack/modern-class.js');
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/base/?test=123&abc=def']
        });
    });
    it('webpack - exports accessed as "module.exports"', () => {
        const src = getTestFile('webpack/module-exports-accessed.js');
        const analyzer = makeAndRunSimple([src], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/data?par1=123&par2=abc']
        });
    });
    it('2 bundles', () => {
        const bundle1 = getTestFile('bundle1.js');
        const bundle2 = getTestFile('bundle2.js');
        const analyzer = makeAndRunSimple([bundle1, bundle2], false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/abcdef?par1=123&par2=abc']
        });
        expect(res as object[]).toContain({
            funcName: 'fetch',
            args: ['/api/foobar?par1=123&par2=abc']
        });
    });
});
