import { isUnknown } from '../../types/unknown';
import {
    HAR,
    replaceQuery,
    queryStringFromObject,
    headersFromMap,
    hasHeader
} from '../../har';

import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';

function parseArgsOld(name, args) {
    let settings,
        postData,
        method,
        url;
    if (name === '$http') {
        settings = args[0];
        url = settings.url;
        method = settings.method || 'GET';
        postData = settings.data || '';
    } else {
        url = args[0];
        if (~['post', 'put'].indexOf(name)) {
            postData = args[1] || '';
            settings = args[2] || {};
        } else {
            settings = args[1] || {};
        }
        if (name === 'jsonp') {
            method = 'GET';
        } else {
            method = name;
        }
    }
    return [settings, postData, method, url];
}

/* eslint-disable complexity */
function parseArgsNew(name, args) {
    let settings,
        postData,
        method,
        url;

    if (name === 'request') {
        if (typeof args[0] === 'object') {
            settings = args[0];
            url = settings.url;
            method = settings.method || 'GET';
            postData = settings.body || '';
        } else {
            method = args[0];
            url = args[1];
            settings = args[2] || {};
            postData = settings.body || '';
        }
        if (method.toUpperCase() === 'JSONP') {
            method = 'GET';
        }
    } else {
        url = args[0];
        if (~['post', 'put', 'patch'].indexOf(name)) {
            postData = args[1] || '';
            settings = args[2] || {};
        } else {
            settings = args[1] || {};
            postData = settings.body || '';
        }

        if (name === 'jsonp') {
            method = 'GET';
            settings = {};
        } else {
            method = name;
        }
    }

    return [settings, postData, method, url];
}

/* eslint-disable complexity */
function makeHARAngular(
    name: string,
    args: Value[],
    baseURL: string,
    parseArgs
): HAR | null {
    let [settings, postData, method, url] = parseArgs(name, args);
    if (!url || isUnknown(url) || isUnknown(postData)) {
        return null;
    }

    const har = new HAR(url, baseURL);
    if (settings.params) {
        har.url = replaceQuery(
            har.url,
            String(queryStringFromObject(settings.params))
        );
        har.reparseURL();
    }

    method = method.toString().toUpperCase();
    har.method = method;
    const headers = settings.headers || {};

    har.headers.push(...headersFromMap(headers));

    if (
        ['POST', 'PUT', 'PATCH', 'UNKNOWN'].includes(method) ||
        (method === 'DELETE' && postData)
    ) {
        if (
            !hasHeader(har.headers, 'Content-Type') &&
            postData
        ) {
            if (typeof postData === 'object' || parseArgs === parseArgsOld) {
                har.headers.push({
                    'name': 'Content-Type',
                    'value': 'application/json'
                });
            } else {
                har.headers.push({
                    'name': 'Content-Type',
                    'value': 'text/plain'
                });
            }
        }
        if (typeof postData === 'object') {
            postData = JSON.stringify(postData);
        }

        har.setPostData(postData, true);
    }

    return har;
}

function makeHAROldAngular(
    name: string,
    args: Value[],
    baseURL: string
): HAR | null {
    return makeHARAngular(name, args, baseURL, parseArgsOld);
}

function makeHARNewAngular(
    name: string,
    args: Value[],
    baseURL: string
): HAR | null {
    return makeHARAngular(name, args, baseURL, parseArgsNew);
}

const sinks: SinkDescr[] = [
    {
        type: 'freeStanding',
        name: '$http',
        sink: makeHAROldAngular
    },
    {
        type: 'method',
        objectName: '$http',
        sink: makeHAROldAngular
    },
    {
        type: 'method',
        objectName: 'http',
        sink: makeHARNewAngular
    }
];

export default sinks;
