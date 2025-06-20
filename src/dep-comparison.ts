import * as stableStringify from 'json-stable-stringify';

import { HAR, KeyValue } from './har';
import { hasattr } from './utils/common';

const undefinedValues = ['UNKNOWN', ''];
const importantParams = ['route', 'action', 'type', 'r', 'mode'];
const importantHeaders = ['content-type', 'host'];
const urlMarkers = ['/', '%2F', '%2f'];
const urlStarts = ['//', 'https://', 'http://'];
const uuidRegex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

export enum DeduplicationMode {
    Default = 'default',
    Extended = 'extended',
    None = 'none',
    FastDefault = 'fast-default',
    FastExtended = 'fast-extended'
}

const reverseDeduplicationMode: Record<string, DeduplicationMode> = {};

for (const k of Object.keys(DeduplicationMode)) {
    reverseDeduplicationMode[DeduplicationMode[k]] = DeduplicationMode[k];
}

export function deduplicationModeFromString(s: string): DeduplicationMode {
    if (hasattr(reverseDeduplicationMode, s)) {
        return reverseDeduplicationMode[s];
    }
    throw new Error('Unexpected string value of deduplication mode: ' + s);
}

export const validDeduplicationModeValues = Object.keys(
    reverseDeduplicationMode
);

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
            !impParam1 ||
            !impParam2 ||
            undefinedValues.includes(impParam1.value) ||
            undefinedValues.includes(impParam2.value) ||
            impParam1.value === impParam2.value
        ) {
            return false;
        }
        if (value !== 'r') {
            return true;
        }
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
            if (
                !Number.isNaN(Number(param1.value)) &&
                !Number.isNaN(Number(param2.value))
            ) {
                return true;
            } else return param1.value === param2.value;
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
            if (
                checkParamValues(
                    postData1.params,
                    postData2.params,
                    extendedMode
                )
            ) {
                return false;
            }
        } else {
            if (!bodiesEqual(postData1.text, postData2.text, extendedMode)) {
                return false;
            }
        }
    }

    return true;
}

function getType(v): string {
    if (typeof v !== 'object') {
        return typeof v;
    }

    if (v === null) {
        return 'null';
    }

    if (Array.isArray(v)) {
        return 'array';
    }

    return 'object';
}

function arrayValuesEqual(v1, v2, extendedMode: boolean): boolean {
    if (v1.length !== v2.length) {
        return false;
    }

    for (let i = 0; i < v1.length; i++) {
        if (!valuesEqual(v1[i], v2[i], extendedMode)) {
            return false;
        }
    }
    return true;
}

function objectValuesEqual(v1, v2, extendedMode: boolean): boolean {
    if (Object.keys(v1).length !== Object.keys(v2).length) {
        return false;
    }

    for (const [key, value1] of Object.entries(v1)) {
        if (!hasattr(v2, key)) {
            return false;
        }

        const value2 = v2[key];

        if (!valuesEqual(value1, value2, extendedMode)) {
            return false;
        }
    }
    return true;
}

function valuesEqual(v1, v2, extendedMode: boolean): boolean {
    const t1 = getType(v1);
    const t2 = getType(v2);
    if (t1 !== t2) {
        return false;
    }

    switch (t1) {
    case 'array':
        return arrayValuesEqual(v1, v2, extendedMode);

    case 'object':
        return objectValuesEqual(v1, v2, extendedMode);

    case 'number':
        return true;

    default:
        return extendedMode || v1 === v2;
    }

    return true;
}

function bodiesEqual(
    body1: string|null,
    body2: string|null,
    extendedMode: boolean
): boolean {
    if (body1 === null && body2 === null) {
        return true;
    }

    if (body1 === null || body2 === null) {
        return false;
    }

    let jsonBody1, jsonBody2;

    try {
        jsonBody1 = JSON.parse(body1);
        jsonBody2 = JSON.parse(body2);
    } catch {
        return body1 == body2;
    }

    return valuesEqual(jsonBody1, jsonBody2, extendedMode);
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

    har2.headers.forEach(header2 => {
        const h = har1.headers.find(header1 => {
            return header2.name === header1.name;
        });
        if (h === undefined) {
            har1.headers.push(header2);
        }
    });

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

function deduplicateStrictlyEqual(hars: HAR[]): HAR[] {
    const already: Set<string> = new Set();
    const result: HAR[] = [];
    for (const h of hars) {
        const s = stableStringify(h);
        if (already.has(s)) {
            continue;
        }
        already.add(s);
        result.push(h);
    }
    return result;
}

function removeNumbers(a, mode: DeduplicationMode) {
    switch (getType(a)) {
    case 'array':
        for (let i = 0; i < a.length; i++) {
            a[i] = removeNumbers(a[i], mode);
        }
        return a;

    case 'object':
        for (const [key, value] of Object.entries(a)) {
            a[key] = removeNumbers(value, mode);
        }
        return a;

    case 'null':
        if (mode === DeduplicationMode.FastExtended) {
            return '';
        }
        return a;

    case 'boolean':
        if (mode === DeduplicationMode.FastExtended) {
            return '';
        }
        return a;

    default:
        if (isUselessValue(a)) {
            return '';
        }

        if (mode === DeduplicationMode.FastExtended) {
            return '';
        }
        return a.slice(0, 100);
    }
}

function isUselessValue(value: string) {
    if (
        !Number.isNaN(Number(value)) ||
        value === 'UNKNOWN' ||
        uuidRegex.test(value)
    ) {
        return true;
    }

    return false;
}

function isUselessParam(param: KeyValue, mode: DeduplicationMode) {
    if (isUselessValue(param.value)) {
        return true;
    }

    if (mode === DeduplicationMode.FastExtended) {
        if (!importantParams.includes(param.name)) {
            return true;
        }

        return param.name == 'r' && !urlMarkers.some(marker => {
            return param.value.includes(marker);
        });
    }

    return false;
}

function compareKeyValue(a: KeyValue, b: KeyValue) {
    if (a.name === b.name) {
        return 0;
    }
    if (a.name > b.name) {
        return 1;
    }

    return -1;
}

function convertToGeneralFrom(har: HAR, mode: DeduplicationMode): HAR {
    har.url = har.url.split('?')[0];

    har.headers = har.headers.filter(header => {
        header.name = header.name.toLowerCase();
        return importantHeaders.includes(header.name);
    });

    har.headers.sort(compareKeyValue);

    har.queryString.forEach(param => {
        if (isUselessParam(param, mode)) {
            param.value = '';
        }
    });

    har.queryString.sort(compareKeyValue);

    const postData = har.getPostData();

    if (postData) {
        if (postData.params) {
            postData.params.forEach(param => {
                if (isUselessParam(param, mode)) {
                    param.value = '';
                }
            });

            postData.params.sort(compareKeyValue);

            const newPostData = postData.params.map(param => {
                return param.name + '=' + param.value;
            }).join('&');

            har.setPostData(newPostData);
        } else {
            if (postData.text !== null) {
                try {
                    const jsonBody = JSON.parse(postData.text);
                    const genericJSON = removeNumbers(jsonBody, mode);
                    har.setPostData(JSON.stringify(genericJSON));
                } catch {
                    har.setPostData(postData.text.slice(0, 100));
                }
            }
        }
    }

    har.httpVersion = '';
    har.bodySize = 0;
    har.originURL = undefined;
    har.initiator = undefined;

    return har;
}

function fastDeduplicate(
    hars: HAR[],
    workMode: DeduplicationMode
): HAR[] {
    const hashMap = hars.reduce(
        (map, har) => {
            const copyHar = JSON.parse(JSON.stringify(har));
            Object.setPrototypeOf(copyHar, HAR.prototype);

            const genericHar = convertToGeneralFrom(copyHar, workMode);

            const key = JSON.stringify(genericHar);

            const similarHARs = map.get(key);
            if (similarHARs === undefined) {
                map.set(key, new Array<HAR>(har));
            } else {
                similarHARs.push(har);
            }
            return map;
        },
        new Map<string, Array<HAR>>()
    );

    const result: HAR[] = [];

    for (const hars of hashMap.values()) {
        result.push(
            hars.reduce((prev, curr) => uniteDEPs(prev, curr))
        );
    }

    return result;
}

export function deduplicateDEPs(
    hars: HAR[],
    workMode: DeduplicationMode
): HAR[] {
    if (workMode === DeduplicationMode.None) {
        return deduplicateStrictlyEqual(hars);
    }

    if (
        workMode === DeduplicationMode.Default ||
        workMode === DeduplicationMode.Extended
    ) {
        hars.forEach((har, id, hars) => {
            for (let i = id + 1; i < hars.length; i++) {
                if (
                    compareDEPs(
                        har,
                        hars[i],
                        workMode === DeduplicationMode.Extended
                    )
                ) {
                    har = uniteDEPs(har, hars[i]);
                    hars.splice(i--, 1);
                }
            }
        });

        return hars;
    }

    return fastDeduplicate(hars, workMode);
}
