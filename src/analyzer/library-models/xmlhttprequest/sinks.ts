import { HAR, hasHeader } from '../../har';
import { isUnknown } from '../../types/unknown';

import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';

interface XHRCalls {
    name: string;
    args: Value[];
}

const DEFAULT_CONTENT_TYPE = 'text/plain';

function addBody(result, body) {
    if (result === null) {
        console.error('Warning: unexpected XMLHttpRequest args without open');
        return result;
    }

    if (body !== null) {
        if (!hasHeader(result.headers, 'Content-Type')) {
            result.headers.push({
                'name': 'Content-Type',
                'value': DEFAULT_CONTENT_TYPE
            });
        }

        result.setPostData(body);
    }
    return result;
}

function isIllegalURL(url: Value): boolean {
    return isUnknown(url) || !url;
}

function makeHARXHR(name: string, args: Value[], baseURL: string): HAR | null {
    let result: HAR | null = null,
        body: string | null = null;

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
            body = String(callArgs[0]);
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

    return addBody(result, body);
}

const sinks: SinkDescr[] = [
    {
        type: 'method',
        objectName: 'XMLHttpRequest',
        sink: makeHARXHR
    }
];

export default sinks;
