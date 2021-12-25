const clsModule = require('./cls.js');

const C = clsModule.C;

function f() {
    var o = new C();
    o.sendRequest();
}

export function main() {
    window.__hookThatMayBeCalled = f;
}