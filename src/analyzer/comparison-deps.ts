import { HAR, KeyValue } from './har';

const undefinedValues = ['UNKNOWN', ''];
const importantParams = ['route', 'action', 'type'];
const importantHeaders = ['Content-Type', 'Host'];

function compareKeys(a: KeyValue[], b: KeyValue[]): boolean {
    const aKeys = a.map(param => param.name).sort();
    const bKeys = b.map(param => param.name).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

function checkImportantParams(
    params1: KeyValue[],
    params2: KeyValue[]
): boolean {
    return importantParams.some(value => {
        const impParam1 = params1.find(param => param.name === value);
        const impParam2 = params2.find(param => param.name === value);
        return (
            impParam1 &&
            impParam2 &&
            !undefinedValues.includes(impParam1.value) &&
            !undefinedValues.includes(impParam2.value) &&
            impParam1.value !== impParam2.value
        );
    });
}

function checkHeaders(har1, har2): boolean {
    return importantHeaders.some(header => {
        return har1.getHeader(header) !== har2.getHeader(header);
    });
}

function compareDEPs(har1: HAR, har2: HAR): boolean {
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

    if (
        !compareKeys(har1.queryString, har2.queryString) ||
        checkImportantParams(har1.queryString, har2.queryString)
    ) {
        return false;
    }

    const postData1 = har1.getPostData();
    const postData2 = har2.getPostData();

    if (postData1 && postData2) {
        if (postData1.params && postData2.params) {
            if (
                !compareKeys(postData1.params, postData2.params) ||
                checkImportantParams(postData1.params, postData2.params)
            ) {
                return false;
            }
        }
    }

    return true;
}

function uniteDEPs(har1: HAR, har2: HAR): HAR {
    const newURL = new URL(har1.url);
    const searchParams = newURL.searchParams;

    har1.queryString.forEach(qsParam => {
        if (undefinedValues.includes(qsParam.value)) {
            const sameParam = har2.queryString.find(param => {
                return param.name === qsParam.name;
            });
            if (sameParam !== undefined) {
                qsParam.value = sameParam.value;
                searchParams.set(qsParam.name, qsParam.value);
            }
        }
    });
    newURL.search = searchParams.toString();
    har1.url = newURL.toString();

    const postData1 = har1.getPostData();
    const postData2 = har2.getPostData();
    if (!postData1 || !postData2) {
        return har1;
    }

    const params1 = postData1.params;
    const params2 = postData2.params;

    if (params1 && params2) {
        params1.forEach(dataParam => {
            if (undefinedValues.includes(dataParam.value)) {
                const sameParam = params2.find(param => {
                    return param.name === dataParam.name;
                });
                if (sameParam !== undefined) {
                    dataParam.value = sameParam.value;
                }
            }
        });
        const newPostData = params1.map(param => {
            return param.name + '=' + param.value;
        }).join('&');
        har1.setPostData(newPostData, false, params1);
    }

    return har1;
}

export function deduplicateDEPs(hars: HAR[]): HAR[] {
    hars.forEach((har, id, hars) => {
        for (let i = id + 1; i < hars.length; i++) {
            if (compareDEPs(har, hars[i])) {
                har = uniteDEPs(har, hars[i]);
                hars.splice(i--, 1);
            }
        }
    });
    return hars;
}