import * as requester from './requester';
import { reqData } from './req-data';

function f() {
    const u = reqData.base + '?par1=' + reqData.p1 + '&par2=' + reqData.p2;
    requester.doRequest(u);
}

export function main() {
    window.__specialHook = f;
}