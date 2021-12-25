// We need this because we want to use promises and async (because, for example,
// Chrome debugger protocol is fully async), but at the same time we want some
// callbacks to run fully synchronously - for example, on Slimer we want to run
// synchronously inside 'document-element-inserted' callback, otherwise we will
// have a race condition and will miss some events

import { isPromise } from '../../../../utils/common';

export function synchronousePromiseResolve<T>(
    val?: T | PromiseLike<T>
): PromiseLike<T> {
    if (isPromise(val)) {
        return val;
    }
    return {
        then<TR>(cb?: (v?: T) => TR | PromiseLike<TR>): PromiseLike<TR> {
            if (cb) {
                const res = cb(val);
                return synchronousePromiseResolve<TR>(res);
            } else {
                return synchronousePromiseResolve<TR>();
            }
        }
    };
}
