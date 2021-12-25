const requester = require('./requester');
const { getBaseURL, getData } = require('./req-data');


function f() {
    const b = getBaseURL();
    const d = getData();
    var u = b + '?par1=' + d.p1 + '&par2=' + d.p2;
    requester.doRequest(u);
}

export function main() {
    window.__testImportantHook = f;
}