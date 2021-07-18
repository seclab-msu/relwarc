import { ResourceRequest } from './browser/headless-bot';

import { HAR } from './har';

export function requestToHar(req: ResourceRequest): HAR {
    const har = new HAR(req.url);
    har.headers = req.headers;
    har.method = req.method;
    if (req.postData) {
        har.setPostData(req.postData, false);
    }
    return har;
}
