import { deepCopyObject } from '../../src/types/deep-copy';

describe('Test deepCopyObject function', () => {
    it('smoke test', () => {
        const TEST_OBJECT = {
            x: 123,
            y: 'test',
            z: ['a', 100, null]
        };

        const copy = deepCopyObject(TEST_OBJECT) as object;

        expect(copy).not.toBe(TEST_OBJECT);

        expect(copy).toEqual(TEST_OBJECT);
    });

    it('cyclic value', () => {
        const ob: Record<string, object> = {};

        ob.recur = ob;

        const copy = deepCopyObject(ob) as object;

        expect(copy).not.toBe(ob);

        expect(copy).toEqual(ob);
    });
});
