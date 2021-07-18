import { hasattr } from './utils/common';

export enum DomainFilteringMode {
    Same = 'same',
    Subdomain = 'subdomain',
    Any = 'any'
}

const reverseDomainFilteringMode: Record<string, DomainFilteringMode> = {};

for (const k of Object.keys(DomainFilteringMode)) {
    reverseDomainFilteringMode[DomainFilteringMode[k]] = DomainFilteringMode[k];
}

export function domainFilteringModeFromString(s: string): DomainFilteringMode {
    if (hasattr(reverseDomainFilteringMode, s)) {
        return reverseDomainFilteringMode[s];
    }
    throw new Error('Unexpected string value of domain filtering mode:' + s);
}

export const validDomainFilteringModeValues = Object.keys(
    reverseDomainFilteringMode
);

export function filterByDomain(
    url: string,
    baseURL: string,
    mode: DomainFilteringMode
): boolean {
    if (mode === DomainFilteringMode.Any) {
        return true;
    }

    const urlDomain = (new URL(url)).hostname;
    const baseDomain = (new URL(baseURL)).hostname;

    switch (mode) {
    case DomainFilteringMode.Same:
        return urlDomain === baseDomain;
        break;
    case DomainFilteringMode.Subdomain:
        if (!urlDomain.endsWith(baseDomain)) {
            return false;
        }
        if (urlDomain === baseDomain) {
            return true;
        }
        return urlDomain[urlDomain.length - baseDomain.length - 1] === '.';
    default:
        throw new Error('Unexpected domain filtering mode: ' + mode);
    }
}