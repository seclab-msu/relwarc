import { isUnknown } from '../../types/unknown';
import {
    HAR,
    replaceQuery,
    queryStringFromObject,
    headersFromMap,
} from '../../har';

import type { SinkDescr } from '../sinks';

function makeHARAxios(funcName, args, baseURL) {
    let url,
        settings: Record<string, any> = {},
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

    if (!url || isUnknown(url) || isUnknown(postData)) {
        return null;
    }

    const har = new HAR(url, baseURL);
    har.method = method.toUpperCase();

    if (settings.params) {
        har.url = replaceQuery(
            har.url,
            String(queryStringFromObject(settings.params))
        );
        har.reparseURL();
    }

    const headers = settings.headers || {};

    har.headers.push(...headersFromMap(headers));

    if (method.toUpperCase() !== 'GET') {
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
            har.headers.push({
                'name': 'Content-Type',
                'value': ct
            });
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
