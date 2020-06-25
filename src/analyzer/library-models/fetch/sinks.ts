import { HAR, headersFromMap } from '../../har';
import { isUnknown } from '../../types/unknown';

import type { SinkDescr } from '../sinks';

export function makeHARFetch(name:string , args, baseURL: string): HAR | null {
    const url = args[0];

    if (!url || isUnknown(url)) {
        return null;
    }

    const har = new HAR(url, baseURL);

    if (args.length > 1 || typeof args[1] === 'object') {
        const settings = args[1];
        har.method = settings.method || "GET";
        har.headers.push(...headersFromMap(settings.headers || {}));
        if (settings.body) {
            if (isUnknown(settings.body)) {
                return null;
            }
            har.setPostData(settings.body);
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
    }/*, TODO: reconsider whether it should be supported
    {
        type: 'method',
        objectName: 'this',
        sink: makeHARFetch
    }*/
];

export default sinks;