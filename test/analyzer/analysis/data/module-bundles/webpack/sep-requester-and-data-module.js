! function() {
    var n = {
            33: function(n, e, t) {
                "use strict";
                t.r(e), t.d(e, {
                    main: function() {
                        return a
                    }
                });
                var o = t(334),
                    r = t(290);

                function i() {
                    var n = r.W.base + "?par1=" + r.W.p1 + "&par2=" + r.W.p2;
                    o.N(n)
                }

                function a() {
                    window.__specialHook = i
                }
            },
            290: function(n, e) {
                e.W = {
                    base: "/api/data",
                    p1: "123",
                    p2: "abc"
                }
            },
            334: function(n, e) {
                e.N = function(n) {
                    return fetch(n)
                }
            }
        },
        e = {};

    function t(o) {
        var r = e[o];
        if (void 0 !== r) return r.exports;
        var i = e[o] = {
            exports: {}
        };
        return n[o](i, i.exports, t), i.exports
    }
    t.d = function(n, e) {
        for (var o in e) t.o(e, o) && !t.o(n, o) && Object.defineProperty(n, o, {
            enumerable: !0,
            get: e[o]
        })
    }, t.o = function(n, e) {
        return Object.prototype.hasOwnProperty.call(n, e)
    }, t.r = function(n) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(n, "__esModule", {
            value: !0
        })
    }, (0, t(33).main)()
}();