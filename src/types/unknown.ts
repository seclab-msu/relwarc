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

export function isUnknown(ob: unknown): ob is Unknown {
    return ob instanceof Unknown;
}

// TODO: this is bad
export function isUnknownOrUnknownString(ob: unknown): boolean {
    return isUnknown(ob) || (
        typeof ob === 'string' && ob.includes('UNKNOWN')
    );
}
