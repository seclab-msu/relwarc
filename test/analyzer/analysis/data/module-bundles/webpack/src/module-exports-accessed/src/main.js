import { reqData } from './req-data';

export function main() {
    function f() {
        const u = reqData.base + '?par1=' + reqData.p1 + '&par2=' + reqData.p2;
        fetch(u);
    }

    window.__specialHook = f;
}