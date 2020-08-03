import { HAR, headersFromMap } from '../../har';
import { isUnknown } from '../../types/unknown';

import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';
import type { Unknown } from '../../types/unknown';

interface FetchSettings {
    method?: string;
    headers?: Record<string, string>;
    body?: string | Unknown;
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
        if (settings.body) {
            if (isUnknown(settings.body)) {
                return null;
            }
            har.setPostData(String(settings.body));
        }
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
