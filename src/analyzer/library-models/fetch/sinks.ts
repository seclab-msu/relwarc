import { HAR, headersFromMap, KeyValue } from '../../har';
import { isUnknown } from '../../types/unknown';
import { FormDataModel } from '../../types/form-data';
import { hasattr } from '../../utils/common';

import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';
import type { Unknown } from '../../types/unknown';

interface FetchSettings {
    method?: string;
    headers?: Record<string, string>;
    body?: string | FormDataModel | Unknown;
}

function setData(har: HAR, data: FormDataModel): void {
    const forcedPostData: KeyValue[] = [];
    for (const [name, value] of Object.entries(data.getData())) {
        forcedPostData.push({ name, value: String(value) });
    }
    har.setPostData('', false, forcedPostData);
}

function setCt(har: HAR, isCtSet: boolean, isMultipart: boolean): void {
    if (!isCtSet && isMultipart) {
        har.headers.push({
            'name': 'Content-Type',
            'value': 'multipart/form-data'
        });
    }
}

function processData(data: Value, har: HAR, isCtSet: boolean): void {
    if (data && har.method.toUpperCase() !== 'GET' && har.method.toUpperCase() !== 'HEAD') {
        // Note that a fetch() request using the GET or HEAD method cannot have a body.
        if (isUnknown(data)) {
            return;
        }
        if (data instanceof FormDataModel) {
            setCt(har, isCtSet, true);
            setData(har, data);
        } else {
            setCt(har, isCtSet, false);
            har.setPostData(String(data));
        }
    }
}

export function makeHARFetch(
    name:string,
    args: Value[],
    baseURL: string
): HAR | null {
    const url = args[0];

    if (typeof url !== 'string') {
        return null;
    }

    const har = new HAR(url, baseURL);

    if (args.length > 1 || typeof args[1] === 'object') {
        const settings = args[1] as FetchSettings;
        har.method = settings.method || 'GET';
        har.headers.push(...headersFromMap(settings.headers || {}));
        let isCtSet = false;
        const data = settings.body;
        if (settings.headers && hasattr(settings.headers, 'Content-Type')) {
            isCtSet = true;
        }
        processData(data, har, isCtSet);
    }
    return har;
}

const sinks: SinkDescr[] = [
    {
        type: 'freeStanding',
        name: 'fetch',
        sink: makeHARFetch
    },
    {
        type: 'method',
        objectName: 'window',
        sink: makeHARFetch
    }/* , TODO: reconsider whether it should be supported
    {
        type: 'method',
        objectName: 'this',
        sink: makeHARFetch
    }*/
];

export default sinks;
