import { KeyValue } from '../../src/analyzer/har';

interface UnorderedPostData {
    text: string|null;
    params?: Set<KeyValue>;
    mimeType?: string;
}

export interface UnorderedHAR {
    method: string;
    url: string;
    httpVersion: string;
    headers: Set<KeyValue>;
    queryString: Set<KeyValue>;
    bodySize: number;
    postData?: UnorderedPostData;
}
