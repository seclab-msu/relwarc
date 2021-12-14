export class Unknown {
    readonly tag: string = 'UNKNOWN';
    toString(): string {
        return this.tag;
    }
    toJSON(): string {
        return this.tag;
    }
}

export const UNKNOWN = new Unknown();
export const UNKNOWN_FUNCTION = new Unknown();
export const UNKNOWN_FROM_FUNCTION = new Unknown();

export function isUnknown<T>(ob: T): boolean {
    return ob instanceof Unknown;
}

// TODO: this is bad
export function isUnknownOrUnknownString<T>(ob: T): boolean {
    return isUnknown<T>(ob) || (
        typeof ob === 'string' && ob.includes('UNKNOWN')
    );
}
