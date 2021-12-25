! function() {
    var t = {
            439: function(t, r, n) {
                "use strict";
                n.d(r, {
                    D: function() {
                        return o
                    }
                });
                var e = n(726);

                function a() {
                    var t = e.reqData.base + "?param1=" + e.reqData.p1 + "&param2=" + e.reqData.p2;
                    fetch(t)
                }

                function o() {
                    window.__reallyImportantFunctionCallback = a
                }
            },
            726: function(t) {
                t.exports = {
                    reqData: {
                        base: "/api/data",
                        p1: "123",
                        p2: "abc"
                    }
                }
            }
        },
        r = {};

    function n(e) {
        var a = r[e];
        if (void 0 !== a) return a.exports;
        var o = r[e] = {
            exports: {}
        };
        return t[e](o, o.exports, n), o.exports
    }
    n.n = function(t) {
            var r = t && t.__esModule ? function() {
                return t.default
            } : function() {
                return t
            };
            return n.d(r, {
                a: r
            }), r
        }, n.d = function(t, r) {
            for (var e in r) n.o(r, e) && !n.o(t, e) && Object.defineProperty(t, e, {
                enumerable: !0,
                get: r[e]
            })
        }, n.o = function(t, r) {
            return Object.prototype.hasOwnProperty.call(t, r)
        },
        function() {
            "use strict";
            (0, n(439).D)()
        }()
}();