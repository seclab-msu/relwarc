import { ResourceRequest } from './browser/headless-bot';
import { decodeLoadType } from './browser/decode-load-type';

import { HAR } from './har';

export function requestToHar(req: ResourceRequest): HAR {
    const har = new HAR(req.url);
    har.headers = req.headers;
    har.method = req.method;
    har.initiator = {
        type: decodeLoadType(req.loadType)
    };
    if (req.postData) {
        har.setPostData(req.postData, false);
    }
    return har;
}
