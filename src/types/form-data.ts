import type { Value } from './generic';

type FormDataData = { [key: string]: Value };


export class FormDataModel {
    private readonly data: FormDataData;

    constructor(data?: FormDataData) {
        this.data = data || {};
    }

    append(k: Value, v: Value): void {
        // @ts-ignore
        this.data[k] = v;
    }

    getData(): FormDataData {
        return this.data;
    }

    toString(): string {
        return 'FORMDATA';
    }

    copy(): FormDataModel {
        return new FormDataModel(Object.assign({}, this.data));
    }
}
