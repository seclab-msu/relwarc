! function() {
    var t = {
            33: function(t, r, n) {
                "use strict";
                n.d(r, {
                    D: function() {
                        return e
                    }
                });
                var o = n(290);

                function e() {
                    window.__specialHook = function() {
                        var t = o.W.base + "?par1=" + o.W.p1 + "&par2=" + o.W.p2;
                        fetch(t)
                    }
                }
            },
            290: function(t) {
                t.exports.W = {
                    base: "/api/data",
                    p1: "123",
                    p2: "abc"
                }
            }
        },
        r = {};

    function n(o) {
        var e = r[o];
        if (void 0 !== e) return e.exports;
        var i = r[o] = {
            exports: {}
        };
        return t[o](i, i.exports, n), i.exports
    }
    n.d = function(t, r) {
            for (var o in r) n.o(r, o) && !n.o(t, o) && Object.defineProperty(t, o, {
                enumerable: !0,
                get: r[o]
            })
        }, n.o = function(t, r) {
            return Object.prototype.hasOwnProperty.call(t, r)
        },
        function() {
            "use strict";
            (0, n(33).D)()
        }()
}();