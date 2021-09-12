import { ResourceRequest } from './browser/headless-bot';
import { decodeLoadType } from './browser/decode-load-type';
import { BadURLError } from './har';
import { log } from './logging';

import { HAR } from './har';

export function requestToHar(req: ResourceRequest): HAR | null {
    let har;

    try {
        har = new HAR(req.url);
    } catch (err) {
        if (err instanceof BadURLError) {
            log('warning: BadURLError exception at ' + req.url);
            return null;
        } else {
            throw err;
        }
    }
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
