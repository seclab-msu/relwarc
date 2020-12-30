import { HAR, queryStringFromObject, replaceQuery, KeyValue } from '../../har';
import { isUnknown, UNKNOWN_FUNCTION } from '../../types/unknown';
import { FormDataModel } from '../../types/form-data';

import type { SinkDescr } from '../sinks';

function makeHARJQuery(funcName: string, args, baseURL: string): HAR|null {
    let settings: Record<string, any> = {},
        url,
        method,
        data;

    if (funcName === 'load' && typeof args[0] !== 'string') {
        // jQuery until 3.0 also had event-handling function .load
        // See https://api.jquery.com/load/
        // See https://github.com/jquery/jquery/blob/2.2-stable/src/ajax/load.js#L20
        return null;
    }

    if (typeof args[0] === 'object') {
        settings = args[0];
        url = settings.url;
    } else if (typeof args[0] === 'string') {
        url = args[0];
        if (funcName === 'ajax' && args.length > 1) {
            settings = args[1];
        } else if (args[1] === UNKNOWN_FUNCTION) {
            data = null;
        } else if (typeof args[1] === 'object') {
            data = args[1];
        }
    } else {
        throw new Error('Bad jQuery AJAX args: ' + funcName + ' ' + args);
    }

    if (!url || isUnknown(url)) {
        return null;
    }

    const har = new HAR(url, baseURL);

    data = data || settings.data;
    if (~['get', 'post'].indexOf(funcName)) {
        method = funcName.toUpperCase();
    } else if (funcName === 'getJSON') {
        method = 'GET';
    } else {
        method = settings.type || settings.method || 'GET';
    }

    method = method.toUpperCase();

    har.method = method;

    let isMultipart = false;

    if (data instanceof FormDataModel) {
        isMultipart = true;
    }

    let qs;

    if (!isMultipart) {
        qs = data || '';

        if (typeof qs === 'object') {
            qs = queryStringFromObject(data);
        }

        if (isUnknown(qs)) {
            return null;
        }
    } else {
        qs = '';
    }

    const explicitCt = settings.contentType;

    if (settings.dataType === 'jsonp') {
        const callbackParamName = settings.jsonp || 'callback';
        qs += (qs ? '&': '') + callbackParamName + '=jQuery111106567430573505544_1591529444128';
    }

    if (method === 'GET') {
        har.url = replaceQuery(har.url, qs);
        har.reparseURL();
    } else {
        if (explicitCt) {
            har.headers.push({
                'name': 'Content-Type',
                'value': explicitCt
            });
        } else if (isMultipart) {
            har.headers.push({
                'name': 'Content-Type',
                'value': 'multipart/form-data'
            });
        } else if (qs) {
            har.headers.push({
                'name': 'Content-Type',
                'value': 'application/x-www-form-urlencoded'
            });
        }
        if (isMultipart) {
            const forcedPostData: KeyValue[] = [];
            for (const [name, value] of Object.entries(data.getData())) {
                // TODO: dirty type conversion to string in value
                // reconsider type of value in KeyValue (change to Value?)
                // @ts-ignore
                forcedPostData.push({ name, value });
            }
            har.setPostData(qs, false, forcedPostData);
        } else {
            har.setPostData(qs);
        }
    }
    return har;
}

const sinks: SinkDescr[] = [
    {
        type: 'method',
        objectName: '$',
        sink: makeHARJQuery
    },
    {
        type: 'method',
        objectName: 'jQuery',
        sink: makeHARJQuery
    }
];

export default sinks;