import {
    HAR,
    queryStringFromObject,
    replaceQuery,
    KeyValue,
    headersFromMap
} from '../../har';
import { isUnknown, UNKNOWN_FUNCTION } from '../../types/unknown';
import { FormDataModel } from '../../types/form-data';
import { FunctionValue } from '../../types/function';
import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';

function parseArgs(funcName, args) {
    let settings: Record<string, Value> = {},
        url,
        data;

    if (typeof args[0] === 'object') {
        settings = args[0];
        url = settings.url;
    } else if (typeof args[0] === 'string') {
        url = args[0];
        if (funcName === 'ajax' && args.length > 1) {
            settings = args[1];
        } else if (args[1] === UNKNOWN_FUNCTION ||
            funcName === 'getJSON' &&
            args[1] instanceof FunctionValue
        ) {
            data = null;
        } else if (
            typeof args[1] === 'object' ||
            funcName === 'post' && typeof args[1] === 'string'
        ) {
            data = args[1];
        }
    } else {
        throw new Error('Bad jQuery AJAX args: ' + funcName + ' ' + args);
    }
    return [url, settings, data];
}

function getMethod(funcName, settings) {
    let method;
    if (~['get', 'post'].indexOf(funcName)) {
        method = funcName.toUpperCase();
    } else if (funcName === 'getJSON') {
        method = 'GET';
    } else {
        method = settings.type || settings.method || 'GET';
    }

    method = method.toString().toUpperCase();
    return method;
}

function setCt(har: HAR, explicitCt, isMultipart, qs) {
    if (
        har.headers.find(header => {
            return header.name.toLowerCase() === 'content-type';
        })
    ) {
        return;
    } else if (explicitCt) {
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
}

function getQs(isMultipart, data) {
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
    return qs;
}

function setData(har, isMultipart, data, qs) {
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

function setHeaders(har: HAR, settings: Record<string, string>) {
    const headers = settings.headers || {};
    har.headers.push(...headersFromMap(headers));
}

function isIllegal(funcName: string, args: Value[]) {
    if (args[0] === undefined || args[0] === null) {
        return true;
    }
    if (funcName === 'load' && typeof args[0] !== 'string') {
        // jQuery until 3.0 also had event-handling function .load
        // See https://api.jquery.com/load/
        // See https://github.com/jquery/jquery/blob/2.2-stable/src/ajax/load.js#L20
        return true;
    }
    return false;
}

function makeHARJQuery(
    funcName: string,
    args: Value[],
    baseURL: string
): HAR|null {
    if (isIllegal(funcName, args)) {
        return null;
    }

    let [url, settings, data] = parseArgs(funcName, args);

    if (!url || isUnknown(url)) {
        return null;
    }

    const har = new HAR(url, baseURL);
    data = data || settings.data;
    setHeaders(har, settings);

    const method = getMethod(funcName, settings);
    har.method = method;

    let isMultipart = false;
    if (data instanceof FormDataModel) {
        isMultipart = true;
    }

    let qs = getQs(isMultipart, data);
    if (qs === null) {
        return null;
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
        setCt(har, explicitCt, isMultipart, qs);
        setData(har, isMultipart, data, qs);
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
