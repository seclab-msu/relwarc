export class ObjectIdenter {
    private readonly known: Map<unknown, number>;
    private counter: number;

    constructor() {
        this.known = new Map();
        this.counter = 0;
    }

    private getIndex(val: unknown): number {
        if (typeof val === 'undefined') {
            return -1;
        }
        const knownIndex = this.known.get(val);

        if (typeof knownIndex !== 'undefined') {
            return knownIndex;
        }
        const newIndex = this.counter;
        this.counter++;
        this.known.set(val, newIndex);
        return newIndex;
    }

    getIdentifier(val: unknown): string {
        const index = this.getIndex(val);

        return index.toString();
    }

    getIdentifierForArray(val: unknown[]): string {
        return '[' + val.map(el => this.getIdentifier(el)) + ']';
    }
}
