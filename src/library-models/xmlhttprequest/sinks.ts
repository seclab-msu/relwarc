import { HAR, hasHeader, KeyValue } from '../../har';
import { isUnknown } from '../../types/unknown';
import { FormDataModel } from '../../types/form-data';

import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';

interface XHRCalls {
    name: string;
    args: Value[];
}

const DEFAULT_CONTENT_TYPE = 'text/plain';

function setData(har: HAR, isMultipart, data) {
    if (isMultipart) {
        const forcedPostData: KeyValue[] = [];
        for (const [name, value] of Object.entries(data.getData())) {
            // TODO: dirty type conversion to string in value
            // reconsider type of value in KeyValue (change to Value?)
            // @ts-ignore
            forcedPostData.push({ name, value: String(value) });
        }
        har.setPostData('', false, forcedPostData);
    } else {
        har.setPostData(data);
    }
}

function getBody(data): [boolean, string | FormDataModel] {
    let body: string | FormDataModel,
        isMultipart = false;
    if (data instanceof FormDataModel) {
        isMultipart = true;
        body = data;
    } else {
        body = String(data);
    }
    return [isMultipart, body];
}

function addBody(result: HAR | null, body, isMultipart) {
    if (result === null) {
        console.error('Warning: unexpected XMLHttpRequest args without open');
        return result;
    }

    if (result.method === 'GET' || result.method === 'HEAD') {
        return result;
    }

    if (body !== null) {
        if (!hasHeader(result.headers, 'Content-Type')) {
            if (isMultipart) {
                result.headers.push({
                    'name': 'Content-Type',
                    'value': 'multipart/form-data'
                });
            } else {
                result.headers.push({
                    'name': 'Content-Type',
                    'value': DEFAULT_CONTENT_TYPE
                });
            }
        }
        setData(result, isMultipart, body);
    }
    return result;
}

function isIllegalURL(url: Value): boolean {
    return isUnknown(url) || !url;
}

function makeHARXHR(name: string, args: Value[], baseURL: string): HAR | null {
    let result: HAR | null = null,
        body: string | FormDataModel | null = null,
        isMultipart = false;

    const xhrCallSequence = (args as unknown) as XHRCalls[];

    for (const { name, args: callArgs } of xhrCallSequence) {
        switch (name) {
        case 'open': {
            const [method, url] = callArgs;
            if (isIllegalURL(url)) {
                return null;
            }
            result = new HAR(String(url), baseURL);
            result.method = String(method).toUpperCase();
            break;
        }
        case 'send': {
            if (result === null) {
                continue;
            }
            if (callArgs.length === 0 || callArgs[0] === null) {
                continue;
            }
            const data = callArgs[0];
            [isMultipart, body] = getBody(data);
            break;
        }
        case 'setRequestHeader': {
            if (result === null) {
                continue;
            }
            if (callArgs.length < 1 || typeof callArgs[0] !== 'string') {
                continue;
            }
            result.headers.push({
                name: callArgs[0],
                value: String(callArgs[1])
            });
        }
        }
    }

    return addBody(result, body, isMultipart);
}

const sinks: SinkDescr[] = [
    {
        type: 'method',
        objectName: 'XMLHttpRequest',
        sink: makeHARXHR
    }
];

export default sinks;
