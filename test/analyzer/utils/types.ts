import { KeyValue } from '../../../src/har';

interface PostData {
    text: string|null;
    params?: KeyValue[];
    mimeType?: string;
}

export interface TestHAR {
    method: string;
    url: string;
    httpVersion: string;
    headers: KeyValue[];
    queryString: KeyValue[];
    bodySize: number;
    postData?: PostData;
}

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
