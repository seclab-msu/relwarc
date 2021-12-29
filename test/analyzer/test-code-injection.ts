import { makeAndRunSimple } from './utils/utils';

function makeExploit(payload: string): string {
    const exploitTemlate = `var x = "123";
        var sp = x.__proto__;
        sp.fc = sp.constructor.constructor;
        sp.ev = x.fc('x', 'return eval(x)');
        var z = x.ev('%PAYLOAD%');`;
    return exploitTemlate.replace('%PAYLOAD%', payload);
}

describe('Check that code injection is fixed', () => {
    it('by injecting code raising exception', () => {
        const scripts = [
            makeExploit('throw new Error("PWNED");')
        ];
        makeAndRunSimple(
            scripts,
            true
        );
    });

    it('by injecting syntactically invalid code', () => {
        const scripts = [
            makeExploit('*)))))))')
        ];
        makeAndRunSimple(
            scripts,
            true
        );
    });

    it('by injecting syntactically invalid code without eval', () => {
        const scripts = [
            `var x = "123";
            var sp = x.__proto__;
            sp.fc = sp.constructor.constructor;
            sp.ev = x.fc('*))))))');`
        ];
        makeAndRunSimple(
            scripts,
            true
        );
    });

    it('by injecting syntactically invalid code without __proto__ and eval', () => {
        const scripts = [
            `var x = "123";
            var sp = x.constructor.prototype;
            sp.fc = sp.constructor.constructor;
            sp.ev = x.fc('*))))))');`
        ];
        makeAndRunSimple(
            scripts,
            true
        );
    });

    it('by testing for prototype modification', () => {
        const scripts = [
            `var x = "123";
            var sp = x.constructor.prototype;
            sp.test12345 = '54321test';
            `
        ];
        makeAndRunSimple(
            scripts,
            true
        );
        expect(String.prototype['test12345']).not.toBeDefined();
        scripts.push(`var x = "123";
            var sp = x.constructor.prototype;
            sp.substring = 'broken';
            `
        );
        expect('123'.substring).not.toEqual('broken');
        '123'.substring(1);
    });
});
