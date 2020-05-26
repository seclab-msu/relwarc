export const UNKNOWN = {
    tag: 'UNKNOWN',
    toString(): string {
        return this.tag;
    },
    toJSON(): string {
        return this.tag;
    }
}

export const UNKNOWN_FUNCTION = Object.create(UNKNOWN, {tag: {value: 'UNKNOWN'}});

export const UNKNOWN_FROM_FUNCTION = Object.create(UNKNOWN, {tag: {value:'UNKNOWN'}});

export function isUnknown(ob: any): boolean {
    if (ob === UNKNOWN) {
        return true;
    }
    if (typeof ob === 'object' && ob !== null && Object.getPrototypeOf(ob) === UNKNOWN) {
        return true;
    }
    return false;
}
