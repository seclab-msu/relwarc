(() => {
    var e = {
            656: (e, t) => {
                t.C = class {
                    constructor() {
                        this.baseURL = "/api/base/"
                    }
                    sendRequest() {
                        fetch(this.baseURL + "?test=123&abc=def")
                    }
                }
            },
            439: (e, t, o) => {
                "use strict";
                o.r(t), o.d(t, {
                    main: () => s
                });
                const r = o(656).C;

                function n() {
                    (new r).sendRequest()
                }

                function s() {
                    window.__hookThatMayBeCalled = n
                }
            }
        },
        t = {};

    function o(r) {
        var n = t[r];
        if (void 0 !== n) return n.exports;
        var s = t[r] = {
            exports: {}
        };
        return e[r](s, s.exports, o), s.exports
    }
    o.d = (e, t) => {
        for (var r in t) o.o(t, r) && !o.o(e, r) && Object.defineProperty(e, r, {
            enumerable: !0,
            get: t[r]
        })
    }, o.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), o.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, (() => {
        const {
            main: e
        } = o(439);
        e()
    })()
})();