import { isUnknown } from '../../types/unknown';
import {
    HAR,
    replaceQuery,
    queryStringFromObject,
    headersFromMap,
} from '../../har';

import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';

function isAbsoluteURL(url: string): boolean {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

function combineURLs(baseURL: string, relativeURL: string) {
    return relativeURL ?
        baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') :
        baseURL;
}

function buildFullPath(baseURL: string, requestedURL: string) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
}

function parseArgs(funcName: string, args) {
    let url,
        settings: Record<string, Value> = {},
        method,
        postData;
    if (funcName === 'axios') {
        if (typeof args[0] === 'object') {
            settings = args[0];
            url = settings.url;
        } else {
            url = args[0];
            settings = args[1] || {};
        }
        method = settings.method || 'GET';
        postData = settings.data;
    } else {
        url = args[0];
        method = funcName.toUpperCase();
        if (~['post', 'put'].indexOf(funcName)) {
            postData = args[1];
            settings = args[2] || {};
        } else {
            settings = args[1] || {};
        }
    }
    if (settings.baseURL && typeof settings.baseURL === 'string') {
        url = buildFullPath(settings.baseURL, url);
    }

    return [settings, postData, method, url];
}

function checkHeaders(headers, postData) {
    let ct,
        ctSet = false;
    if (headers['content-type']) {
        ct = headers['content-type'];
        ctSet = true;
    } else if (headers['Content-Type']) {
        ct = headers['Content-Type'];
        ctSet = true;
    }
    if (postData === null) {
        postData = '';
    }
    if (typeof postData === 'string') {
        ct = 'application/x-www-form-urlencoded';
    } else if (typeof postData === 'object') {
        ct = 'application/json';
    }
    if (ct === 'application/json' && typeof postData === 'object') {
        postData = JSON.stringify(postData);
    }
    if (ct && !ctSet) {
        return [{
            'name': 'Content-Type',
            'value': ct
        }, postData];
    }
    return [null, postData];
}

function makeHARAxios(
    funcName: string,
    args: Value[],
    baseURL: string
): HAR | null {
    let [settings, postData, method, url] = parseArgs(funcName, args),
        cType;

    if (!url || isUnknown(url) || isUnknown(postData)) {
        return null;
    }

    const har = new HAR(url, baseURL);
    har.method = method.toString().toUpperCase();
    if (settings.params) {
        har.url = replaceQuery(
            har.url,
            String(queryStringFromObject(settings.params))
        );
        har.reparseURL();
    }

    const headers = settings.headers || {};
    har.headers.push(...headersFromMap(headers));

    if (har.method !== 'GET') {
        [cType, postData] = checkHeaders(headers, postData);
        if (cType) {
            har.headers.push(cType);
        }
        har.setPostData(postData || '');
    }

    return har;
}

const sinks: SinkDescr[] = [
    {
        type: 'freeStanding',
        name: 'axios',
        sink: makeHARAxios
    },
    {
        type: 'method',
        objectName: 'axios',
        sink: makeHARAxios
    }
];

export default sinks;
