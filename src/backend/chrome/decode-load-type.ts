import { LoadType, loadTypeFromString } from '../../load-type';

import { ResourceType } from 'puppeteer';

export function decodeLoadType(resourceType: ResourceType): LoadType {
    switch (resourceType) {
    case 'image':
        return LoadType.Img;
    case 'manifest':
        return LoadType.WebManifest;
    case 'cspviolationreport':
        return LoadType.CSP;
    case 'texttrack':
    case 'prefetch':
    case 'preflight':
    case 'signedexchange':
        return LoadType.Other;
    default:
        return loadTypeFromString(resourceType);
    }
}
