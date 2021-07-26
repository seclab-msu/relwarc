import { HAR, KeyValue } from './har';

const undefinedValues = ['UNKNOWN', ''];
const importantParams = ['route', 'action', 'type', 'r'];
const importantHeaders = ['Content-Type', 'Host'];
const urlMarkers = ['/', '%2F'];
const urlStarts = ['//', 'https://', 'http://'];

function compareKeys(a: KeyValue[], b: KeyValue[]): boolean {
    const aKeys = a.map(param => param.name).sort();
    const bKeys = b.map(param => param.name).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

function extendedComparison(
    params1: KeyValue[],
    params2: KeyValue[]
): boolean {
    return importantParams.some(value => {
        const impParam1 = params1.find(param => param.name === value);
        const impParam2 = params2.find(param => param.name === value);
        if (
            impParam1 &&
            impParam2 &&
            !undefinedValues.includes(impParam1.value) &&
            !undefinedValues.includes(impParam2.value) &&
            impParam1.value !== impParam2.value
        ) {
            if (value === 'r') {
                const impValue1 = impParam1.value;
                const impValue2 = impParam2.value;
                return (
                    !urlStarts.some(el => {
                        return (
                            impValue1.startsWith(el) ||
                            impValue2.startsWith(el) ||
                            impValue1.startsWith(encodeURIComponent(el)) ||
                            impValue2.startsWith(encodeURIComponent(el))
                        );
                    }) &&
                    urlMarkers.some(el => {
                        return (
                            impValue1.includes(el) ||
                            impValue2.includes(el)
                        );
                    })
                );
            }
            return true;
        }
        return false;
    });
}

function checkHeaders(har1, har2): boolean {
    return importantHeaders.some(header => {
        return har1.getHeader(header) !== har2.getHeader(header);
    });
}

function checkParamValues(
    params1: KeyValue[],
    params2: KeyValue[],
    extendedMode: boolean
): boolean {
    if (!compareKeys(params1, params2)) {
        return true;
    }
    if (extendedMode) {
        return extendedComparison(params1, params2);
    } else {
        return !defaultComparison(params1, params2);
    }
}

function defaultComparison(
    params1: KeyValue[],
    params2: KeyValue[]
): boolean {
    return params1.every(param1 => {
        const param2 = params2.find(param => param1.name === param.name);
        if (param2 === undefined) {
            return false;
        }
        if (
            undefinedValues.includes(param1.value) ||
            undefinedValues.includes(param2.value)
        ) {
            return true;
        } else {
            return (
                !Number.isNaN(Number(param1.value)) &&
                !Number.isNaN(Number(param2.value))
            );
        }
    });
}

function compareDEPs(har1: HAR, har2: HAR, extendedMode: boolean): boolean {
    const url1 = new URL(har1.url);
    const url2 = new URL(har2.url);

    if (har1.method !== har2.method) {
        return false;
    }

    if (url1.pathname !== url2.pathname) {
        return false;
    }

    if (checkHeaders(har1, har2)) {
        return false;
    }

    if (checkParamValues(har1.queryString, har2.queryString, extendedMode)) {
        return false;
    }

    const postData1 = har1.getPostData();
    const postData2 = har2.getPostData();

    if (postData1 && postData2) {
        if (postData1.params && postData2.params) {
            if (checkParamValues(
                postData1.params,
                postData2.params,
                extendedMode)
            ) {
                return false;
            }
        }
    }

    return true;
}

function updateUndefinedParams(
    params1: KeyValue[],
    params2: KeyValue[]
): KeyValue[] {
    params1.forEach(param1 => {
        if (undefinedValues.includes(param1.value)) {
            const sameParam = params2.find(param2=> {
                return param1.name === param2.name;
            });
            if (sameParam !== undefined) {
                param1.value = sameParam.value;
            }
        }
    });
    return params1;
}

function uniteDEPs(har1: HAR, har2: HAR): HAR {
    const newURL = new URL(har1.url);

    har1.queryString = updateUndefinedParams(
        har1.queryString,
        har2.queryString
    );

    const newQs = har1.queryString.map(param => {
        return param.name + '=' + param.value;
    }).join('&');

    newURL.search = newQs;
    har1.url = newURL.toString();

    const postData1 = har1.getPostData();
    const postData2 = har2.getPostData();
    if (!postData1 || !postData2) {
        return har1;
    }

    if (postData1.params && postData2.params) {
        postData1.params = updateUndefinedParams(
            postData1.params,
            postData2.params
        );

        const newPostData = postData1.params.map(param => {
            return param.name + '=' + param.value;
        }).join('&');

        har1.setPostData(newPostData, false, postData1.params);
    }

    return har1;
}

export function deduplicateDEPs(
    hars: HAR[],
    extendedMode = false
): HAR[] {
    hars.forEach((har, id, hars) => {
        for (let i = id + 1; i < hars.length; i++) {
            if (compareDEPs(har, hars[i], extendedMode)) {
                har = uniteDEPs(har, hars[i]);
                hars.splice(i--, 1);
            }
        }
    });
    return hars;
}
