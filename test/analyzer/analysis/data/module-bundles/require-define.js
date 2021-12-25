! function() {
  "use strict";
  var n, t = {
      290: function(n, t, r) {
        var e = {
          test: "abc123"
        }
        r.d(t, {
          W: function() {
            return e
          }
        });
      },
      150: function(n, t, r) {
        r.d(t, {
          f: function() {
            return u
          }
        });
        var o = r(290);

        $test = o.W.test;

        function u() {
          var n = o.W.base + "?par1=" + o.W.p1 + "&par2=" + o.W.p2;
          e.N(n)
        }
      },
    },
    r = {};

  function e(n) {
    var o = r[n];
    if (void 0 !== o) return o.exports;
    var u = r[n] = {
      exports: {}
    };
    return t[n](u, u.exports, e), u.exports
  }
  e.d = function(n, t) {
    for (var r in t) e.o(t, r) && !e.o(n, r) && Object.defineProperty(n, r, {
      enumerable: !0,
      get: t[r]
    })
  }, e.o = function(n, t) {
    return Object.prototype.hasOwnProperty.call(n, t)
  }, n = e(150), window.onload = function() {
    document.getElementById("btn").addEventListener("click", (function() {
      (0, n.f)()
    }))
  }
}();