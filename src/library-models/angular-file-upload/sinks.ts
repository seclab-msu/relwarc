import { isUnknown } from '../../types/unknown';
import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';
import { HAR } from '../../har';

function makeHARAngularFileUpload(
    name: string,
    args: Value[],
    baseURL: string
): HAR | null {
    if (name !== 'FileUploader') {
        throw new Error('Unexpected class: ' + name);
    }
    if (args.length < 1) {
        return null;
    }
    const options = args[0];
    if (!options || isUnknown(options) || typeof options !== 'object') {
        return null;
    }
    if (!('url' in options)) {
        return null;
    }
    const url = options.url;

    if (typeof url !== 'string' || url === 'UNKNOWN') {
        return null;
    }
    const har = new HAR(url, baseURL);

    let fieldName = 'file';

    if (
        'alias' in options &&
        typeof options.alias === 'string'
    ) {
        fieldName = options.alias;
    }

    har.headers.push({
        name: 'Content-Type',
        value: 'multipart/form-data'
    });
    har.setPostData('', false, [{
        name: fieldName,
        value: '',
        type: 'file'
    }]);
    return har;
}

export const sinks: SinkDescr[] = [
    {
        type: 'method',
        objectName: 'ajax-file-upload',
        sink: makeHARAngularFileUpload
    }
];

export default sinks;
