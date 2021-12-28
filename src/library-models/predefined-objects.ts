import type { Analyzer } from '../analyzer';
import { Memory } from '../types/memory';

import yahooPredefinedObjects from './yahoo/predefined-objects';

const prefefinedObjectSources = [yahooPredefinedObjects];

const predefinedObjects = {};

for (const objects of prefefinedObjectSources) {
    for (const k of Object.keys(objects)) {
        predefinedObjects[k] = objects[k];
    }
}

export function addPredefinedObjects(analyzer: Analyzer): void {
    for (const k of Object.keys(predefinedObjects)) {
        Memory.declarePredefinedGlobalVariable(k);
        analyzer.setGlobalVariable(k, predefinedObjects[k], true);
    }
}
