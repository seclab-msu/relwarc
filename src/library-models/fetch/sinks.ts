import { HAR, headersFromMap, KeyValue } from '../../har';
import { isUnknown } from '../../types/unknown';
import { FunctionValue } from '../../types/function';
import { FormDataModel } from '../../types/form-data';
import { hasattr } from '../../utils/common';

import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';

interface FetchSettings {
    method?: string;
    headers?: Record<string, string>;
    body?: string | FormDataModel;
}

type AcceptableOptionsObject =
    | { [key: string]: Value }
    | FunctionValue
    | FormDataModel
    | Value[];

function isAcceptableOptionsObject(ob: Value): ob is AcceptableOptionsObject {
    if (isUnknown(ob) || ob instanceof RegExp || ob instanceof URL) {
        return false;
    }

    return typeof ob === 'object' && ob !== null;
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
    if (data && har.method !== 'GET' && har.method !== 'HEAD') {
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

function processFetchSettings(opt: AcceptableOptionsObject): FetchSettings {
    const settings: FetchSettings = {};

    if ('method' in opt) {
        settings.method = String(opt.method);
    }

    settings.headers = {};

    if ('headers' in opt && typeof opt.headers === 'object' && opt.headers !== null && !isUnknown(opt.headers)) {
        for (const [n, v] of Object.entries(opt.headers)) {
            settings.headers[n] = String(v);
        }
    }

    if ('body' in opt) {
        const body = opt.body;

        if (body instanceof FormDataModel || typeof body === 'string') {
            settings.body = body;
        } else if (isUnknown(body)) {
            settings.body = String(body);
        }
    }
    return settings;
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

    if (args.length > 1 && isAcceptableOptionsObject(args[1])) {
        const settings: FetchSettings = processFetchSettings(args[1]);

        har.method = (settings.method || 'GET').toUpperCase();
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
    }
];

export default sinks;
