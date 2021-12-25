! function() {
    var t = {
            33: function(t, e, n) {
                "use strict";
                n.r(e), n.d(e, {
                    main: function() {
                        return f
                    }
                });
                var o = n(334),
                    r = n(290),
                    u = r.getBaseURL,
                    a = r.getData;

                function i() {
                    var t = u(),
                        e = a(),
                        n = t + "?par1=" + e.p1 + "&par2=" + e.p2;
                    o.doRequest(n)
                }

                function f() {
                    window.__testImportantHook = i
                }
            },
            290: function(t, e) {
                e.getBaseURL = function() {
                    return "/api/data"
                }, e.getData = function() {
                    return {
                        p1: "foobar",
                        p2: "456"
                    }
                }
            },
            334: function(t, e) {
                e.doRequest = function(t) {
                    return fetch(t)
                }
            }
        },
        e = {};

    function n(o) {
        var r = e[o];
        if (void 0 !== r) return r.exports;
        var u = e[o] = {
            exports: {}
        };
        return t[o](u, u.exports, n), u.exports
    }
    n.d = function(t, e) {
        for (var o in e) n.o(e, o) && !n.o(t, o) && Object.defineProperty(t, o, {
            enumerable: !0,
            get: e[o]
        })
    }, n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, (0, n(33).main)()
}();