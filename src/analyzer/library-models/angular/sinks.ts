import { isUnknown } from '../../types/unknown';
import {
    HAR,
    replaceQuery,
    queryStringFromObject,
    headersFromMap,
    hasHeader
} from '../../har';

import type { SinkDescr } from '../sinks';

function makeHARAngular(name, args, baseURL) {
    let settings,
        postData,
        method,
        params,
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

    if (method !== 'GET' && method !== 'HEAD') {
        if (!hasHeader(har.headers, 'Content-Type') && postData) {
            har.headers.push({
                'name': 'Content-Type',
                'value': 'application/json'
            });
        }
        if (typeof postData === 'object') {
            postData = JSON.stringify(postData);
        }
        har.setPostData(postData, true);
    }

    return har;
}

const sinks: SinkDescr[] = [
    {
        type: 'freeStanding',
        name: '$http',
        sink: makeHARAngular
    },
    {
        type: 'method',
        objectName: '$http',
        sink: makeHARAngular
    }
];

export default sinks;