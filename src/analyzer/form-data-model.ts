export class FormDataModel {
    private readonly data: {[key:string]: any};

    constructor() {
        this.data = {};
    }

    append(k, v) {
        this.data[k] = v;
    }

    getData() {
        return this.data;
    }

    toString() {return 'FORMDATA'}
}