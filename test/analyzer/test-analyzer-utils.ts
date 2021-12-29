import { Value } from '../../src/types/generic';
import { ValueSet } from '../../src/types/value-set';
import { checkCircularOrValueSet } from '../../src/utils/analyzer';
import { UNKNOWN } from '../../src/types/unknown';
import { isNonemptyObject, isSimpleObject } from '../../src/types/is-special';


describe('Test function "checkCircularOrValueSet"', () => {
    it('detects circular objects', () => {
        const v: Record<string, Value> = {
            x: 123
        };
        v.y = v;
        const result = checkCircularOrValueSet(v);

        expect(result.isCircular).toBeTrue();
        expect(result.hasValueSet).toBeFalse();
    });
    it('does not give false positives on sibling same objects', () => {
        const v: Record<string, Value> = {};
        const v2 = {};
        v.x = v2;
        v.y = v2;

        const result = checkCircularOrValueSet(v);

        expect(result.isCircular).toBeFalse();
        expect(result.hasValueSet).toBeFalse();

        const a = [v2, v2];

        const result2 = checkCircularOrValueSet(a);

        expect(result2.isCircular).toBeFalse();
        expect(result.hasValueSet).toBeFalse();
    });
    it('detects top level value set', () => {
        const vs = new ValueSet([1, 2, 3]);

        const result = checkCircularOrValueSet(vs);

        expect(result.hasValueSet).toBeTrue();
        expect(result.isCircular).toBeFalse();
    });
    it('detects nested value set', () => {
        const vs = new ValueSet([1, 2, 3]);

        const v = {
            x: vs
        };

        const result = checkCircularOrValueSet(v);

        expect(result.hasValueSet).toBeTrue();
        expect(result.isCircular).toBeFalse();
    });
    it('detects ref circle through value set', () => {
        const v: Record<string, Value> = { abc: 123 };

        v.c = new ValueSet([
            null,
            [v]
        ]);

        const result = checkCircularOrValueSet(v);

        expect(result.isCircular).toBeTrue();
    });
});

describe('Tests functions "isNonemptyObject" and "isSimpleObject"', () => {
    it('with UNKNOWN', () => {
        expect(isNonemptyObject(UNKNOWN)).toBeFalse();
        expect(isSimpleObject(UNKNOWN)).toBeFalse();
    });
});
