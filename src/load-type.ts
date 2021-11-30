import { hasattr } from './utils/common';

export enum LoadType {
    Invalid = 'invalid',
    Other = 'other',
    Script = 'script',
    Img = 'img',
    Stylesheet = 'stylesheet',
    Object = 'object',
    Document = 'document',
    Subdocument = 'subdocument',
    Ping = 'ping',
    XHR = 'xhr',
    ObjectSubdoc = 'objectSubdoc',
    DTD = 'dtd',
    Font ='font',
    Media = 'media',
    WebSocket = 'websocket',
    CSP = 'csp',
    XSLT = 'xslt',
    Beacon = 'beacon',
    Fetch = 'fetch',
    Imageset = 'imageset',
    WebManifest = 'webManifest',
    EventSource = 'eventsource',
    FromJSAnalyzer = 'analyzer'
}

const reverseLoadType: Record<string, LoadType> = {};

for (const k of Object.keys(LoadType)) {
    reverseLoadType[LoadType[k]] = LoadType[k];
}

export function loadTypeFromString(s: string): LoadType {
    if (hasattr(reverseLoadType, s)) {
        return reverseLoadType[s];
    }
    throw new Error('Unexpected string value of domain filtering mode:' + s);
}

export const validLoadTypeValues = Object.keys(reverseLoadType);
