import { Unknown, isUnknown, UNKNOWN } from './types/unknown';
import { LoadType } from './load-type';
import type { StackFrame } from './browser/stack-frame';
import { log } from './logging';

import { hasattr, isNotNullObject } from './utils/common';

export interface KeyValue {
    name: string;
    value: string;
}

export interface PostData {
    text: string|null;
    params?: KeyValue[];
    mimeType?: string;
}

export interface HTMLInfo {
    outerHTML: string,
    selector: string | null,
}

export interface Initiator {
    type: LoadType;
    stack?: StackFrame[];
    url?: string;
    lineNumber?: number;
    columnNumber?: number;
    htmlInfo?: HTMLInfo;
    commented?: boolean;
}

export class HAR {
    method: string;
    url: string;
    httpVersion: string;
    headers: KeyValue[];
    queryString: KeyValue[];
    bodySize: number;
    originURL?: string;
    initiator?: Initiator;

    private postData?: PostData;

    constructor(url: string, baseURL?: string) {
        if (typeof url !== 'string' || urlHasUnknownPrefix(url)) {
            throw new BadURLError(url);
        }

        let parsedURL: URL;

        try {
            parsedURL = new URL(url, baseURL);
        } catch {
            throw new BadURLError(url);
        }

        parsedURL.hash = '';

        this.method = 'GET';
        this.url = parsedURL.href;
        this.httpVersion = 'HTTP/1.1';
        this.headers = [{
            'name': 'Host',
            'value': parsedURL.host
        }];
        this.queryString = [];
        this.parseQueryString(parsedURL);
        this.bodySize = 0;
    }
    reparseURL(): void {
        const parsedURL = new URL(this.url);
        this.queryString = [];
        this.parseQueryString(parsedURL);
    }
    private parseQueryString(parsedURL: URL): void {
        if (parsedURL.search) {
            for (const part of parsedURL.search.substring(1).split('&')) {
                const [name, value] = getQueryNameValue(part);
                this.queryString.push({
                    name,
                    value
                });
            }
        }
    }

    getHeader(name: string): string|Unknown|undefined {
        const n = name.toLowerCase();
        for (const h of this.headers) {
            if (h.name.toLowerCase() === n) {
                return h.value;
            }
        }
    }

    setPostData(postData: string, isAngular=false, rawData?: KeyValue[]): void {
        this.postData = {
            'text': postData
        };
        this.bodySize = postData.length;
        if (!hasHeader(this.headers, 'content-length')) {
            this.headers.push({
                'name': 'Content-Length',
                'value': '' + postData.length
            });
        }
        let ct, ctParts, ctType;
        if (hasHeader(this.headers, 'content-type')) {
            ct = this.getHeader('content-type');
            if (isAngular && typeof ct === 'undefined') {
                ct = 'text/plain';
                for (const h of this.headers) {
                    if (h.name.toLowerCase() === 'content-type') {
                        h.value = 'text/plain';
                        break;
                    }
                }
            }
            this.postData.mimeType = ct;
            ctParts = isUnknown(ct) ? [ct] : ct.split('; ');
            ctType = ctParts[0];
        }
        if (ctType === 'application/x-www-form-urlencoded') {
            this.postData.params = [];
            for (const part of postData.split('&')) {
                const [name, value] = getQueryNameValue(part);
                this.postData.params.push({
                    name,
                    value
                });
            }
        } else if (ctType === 'multipart/form-data') {
            this.postData.text = null;
            this.postData.params = <KeyValue[]>rawData;
        }
    }

    getPostData(): PostData | undefined {
        return this.postData;
    }

    static fromJSON(jsonHAR: ReturnType<JSON['parse']>): HAR | null {
        let har;
        try {
            har = new HAR(jsonHAR['url']);
        } catch (err) {
            if (err instanceof BadURLError) {
                log('warning: BadURLError exception at ' + jsonHAR['url']);
                return null;
            } else {
                throw err;
            }
        }
        har.httpVersion = jsonHAR['httpVersion'];
        har.method = jsonHAR['method'];
        har.bodySize = jsonHAR['bodySize'];
        har.headers = jsonHAR['headers'];
        har.queryString = jsonHAR['queryString'];
        har.originURL = jsonHAR['originURL'];
        if (jsonHAR['postData']) {
            har.postData = jsonHAR['postData'];
        }

        return har;
    }
}
function getQueryNameValue(q: string): [string, string] {
    const arr = q.split('=');
    const key: string = arr.slice(0, 1)[0];

    return [key, arr.slice(1).join('=')];
}

export function headersFromMap(headersMap: Record<string, string>): KeyValue[] {
    const result: KeyValue[] = [];

    for (const k in headersMap) {
        if (hasattr(headersMap, k)) {
            result.push({
                'name': k,
                'value': headersMap[k]
            });
        }
    }
    return result;
}

export function hasHeader(headers: KeyValue[], name: string): boolean {
    const n = name.toLowerCase();
    for (const h of headers) {
        if (h.name.toLowerCase() === n) {
            return true;
        }
    }
    return false;
}

function buildParam(
    key: string,
    value,
    resParts: string[]
): string[] {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            value = [UNKNOWN];
        }
        for (let i = 0; i < value.length; i++) {
            if (!key.endsWith('[]')) {
                resParts = buildParam(
                    key + '[' + (isNotNullObject(value[i]) && !isUnknown(value[i]) ? i : '') + ']',
                    value[i],
                    resParts
                );
            } else {
                // due to jQuery sources
                // https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/serialize.js#L25
                // if key ends with '[]', then array is not deep-processed,
                // instead of that just casting to string.
                resParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value[i]));
            }
        }
    } else if (
        typeof value === 'object' &&
        value !== null &&
        !isUnknown(value)
    ) {
        for (const internalKey in value) {
            if (hasattr(value, internalKey)) {
                resParts = buildParam(
                    key + '[' + internalKey + ']', value[internalKey], resParts
                );
            }
        }
    } else {
        resParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }

    return resParts;
}

export function queryStringFromObject(
    ob: Record<string, string | string[]> | Unknown
): string | Unknown {
    if (ob instanceof Unknown) {
        return ob;
    }

    let resParts: string[] = [];

    for (const k in ob) {
        if (hasattr(ob, k)) {
            resParts = buildParam(k, ob[k], resParts);
        }
    }

    return resParts.join('&');
}

export function replaceQuery(url: string, qs: string): string {
    if (!qs) {
        return url;
    }
    const parsed = new URL(url);

    parsed.search = parsed.search ? parsed.search + '&' + qs : qs;
    return parsed.href;
}

export class BadURLError extends Error {
    constructor(url?: string) {
        super(`Bad URL: ${url}`);
    }
}

function urlHasUnknownPrefix(url: string): boolean {
    return ['UNKNOWN', 'undefined', '&UNKNOWN'].some(p => url.startsWith(p));
}
