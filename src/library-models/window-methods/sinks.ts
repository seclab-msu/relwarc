import type { Value } from '../../types/generic';
import { HAR } from '../../har';
import type { SinkDescr } from '../sinks';
import { makeHARFetch } from '../fetch/sinks';

function makeHARWindowOpen(
    name: string,
    args: Value[],
    baseURL: string
): HAR | null {
    const url = args[0];

    if (typeof url !== 'string') {
        return null;
    }

    const har = new HAR(url, baseURL);

    return har;
}

function makeHARWindowMethod(
    name: string,
    args: Value[],
    baseURL: string
): HAR | null {
    switch (name) {
    case 'fetch':
        return makeHARFetch(name, args, baseURL);
    case 'open':
        return makeHARWindowOpen(name, args, baseURL);
    default:
        throw new Error('Unexpected window method: ' + name);
    }
}

const sinks: SinkDescr[] = [
    {
        type: 'method',
        objectName: 'window',
        sink: makeHARWindowMethod
    }/* , TODO: reconsider whether it should be supported
    {
        type: 'method',
        objectName: 'this',
        sink: makeHARFetch
    }*/
];

export default sinks;
