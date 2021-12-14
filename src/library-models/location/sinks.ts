import { HAR } from '../../har';

import type { Value } from '../../types/generic';
import type { SinkDescr } from '../sinks';

export function makeHARLocation(
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

const sinks: SinkDescr[] = [
    {
        type: 'freeStanding',
        name: 'replace_location',
        sink: makeHARLocation
    }
];

export default sinks;
