import { HAR } from '../har';
import { hasattr } from '../utils/common';

import { default as fetchSinks } from './fetch/sinks';
import { default as jQuerySinks } from './jquery/sinks';

type Sink = (name: string, args, baseURL: string) => (HAR | null);

interface BaseSinkDescr {
    type: string;
    sink: Sink;
}

interface MethodSinkDescr extends BaseSinkDescr {
    type: 'method';
    objectName: string;
}

interface FreeStandingSinkDescr extends BaseSinkDescr {
    type: 'freeStanding';
    name: string;
}

export type SinkDescr = MethodSinkDescr | FreeStandingSinkDescr;

const freeStandingSinks: Record<string, Sink> = {};
const methodSinks: Record<string, Sink> = {};

const sinkList: SinkDescr[] = ([] as SinkDescr[])
    .concat(jQuerySinks)
    .concat(fetchSinks);

for (const sinkDescr of sinkList) {
    if (sinkDescr.type === 'freeStanding') {
        freeStandingSinks[sinkDescr.name] = sinkDescr.sink;
    } else if (sinkDescr.type === 'method') {
        methodSinks[sinkDescr.objectName] = sinkDescr.sink;
    }
}

export function makeHAR(name: string, args, baseURL: string): HAR | null {
    if (hasattr(freeStandingSinks, name)) {
        return freeStandingSinks[name](name, args, baseURL);
    }

    const [objectName, funcName] = name.split('.');

    if (hasattr(methodSinks, objectName)) {
        return methodSinks[objectName](funcName, args, baseURL);
    }

    throw Error('Function not supported: ' + name);
}
