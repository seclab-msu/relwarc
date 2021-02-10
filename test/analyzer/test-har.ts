import { KeyValue } from '../../src/analyzer/har';

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
