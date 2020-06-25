import { HAR } from '../har';
import { hasattr } from '../utils/common';

import fetchSinks from './fetch/sinks';
import jQuerySinks from './jquery/sinks';
import angularSinks from './angular/sinks';
import axiosSinks from './axios/sinks';

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
    .concat(angularSinks)
    .concat(fetchSinks)
    .concat(axiosSinks);

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
