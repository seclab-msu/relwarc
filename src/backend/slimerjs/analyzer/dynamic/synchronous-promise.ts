// We need this because we want to use promises and async (because, for example,
// Chrome debugger protocol is fully async), but at the same time we want some
// callbacks to run fully synchronously - for example, on Slimer we want to run
// synchronously inside 'document-element-inserted' callback, otherwise we will
// have a race condition and will miss some events

export function synchronousePromiseResolve<T>(
    val?: T | PromiseLike<T>
): PromiseLike<T> {
    if (
        val && typeof val === 'object' &&
        'then' in val &&
        typeof val.then === 'function'
    ) {
        throw new Error(
            'synchronousePromiseResolve: sub-promise not supported'
        );
    }
    return {
        then<TR>(cb?: (val?: T) => TR | PromiseLike<TR>): PromiseLike<TR> {
            if (cb) {
                const res = cb();
                return synchronousePromiseResolve<TR>(res);
            } else {
                return synchronousePromiseResolve<TR>();
            }
        }
    };
}
