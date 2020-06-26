import { HAR, hasHeader } from '../../har';

import type { SinkDescr } from '../sinks';

const DEFAULT_CONTENT_TYPE = 'text/plain';

function makeHARXHR(name: string, args, baseURL: string): HAR | null {
    let result: HAR | null = null,
        body: string | null = null;

    for (const { name, args: callArgs } of args) {
        switch (name) {
        case 'open':
            const [method, url] = callArgs;
            result = new HAR(url, baseURL);
            result.method = method;
            break;
        case 'send':
            if (result === null) {
                continue;
            }
            if (callArgs.length === 0 || callArgs[0] === null) {
                continue;
            }
            body = String(callArgs[0]);
            break;
        case 'setRequestHeader':
            if (result === null) {
                continue;
            }
            if (callArgs.length < 1 || typeof callArgs[0] !== 'string') {
                continue;
            }
            result.headers.push({
                name: callArgs[0],
                value: callArgs[1]
            });
        }
    }

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

const sinks: SinkDescr[] = [
    {
        type: 'method',
        objectName: 'XMLHttpRequest',
        sink: makeHARXHR
    }
];

export default sinks;