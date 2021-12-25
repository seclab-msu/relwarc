class C {
    constructor() {
        this.baseURL = '/api/base/';
    }
    sendRequest() {
        fetch(this.baseURL + '?test=123&abc=def');
    }
}

exports.C = C;