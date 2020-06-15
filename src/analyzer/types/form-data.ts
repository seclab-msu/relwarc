import type { Value } from './generic';

type FromDataData = { [key: string]: Value };


export class FormDataModel {
    private readonly data: FromDataData;

    constructor() {
        this.data = {};
    }

    append(k: Value, v: Value): void {
        // @ts-ignore
        this.data[k] = v;
    }

    getData(): FromDataData {
        return this.data;
    }

    toString(): string {
        return 'FORMDATA';
    }
}
