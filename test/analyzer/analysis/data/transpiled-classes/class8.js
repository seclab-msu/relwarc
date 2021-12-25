!(function () {
  function t(n) {
    return (
      (t =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            }),
      t(n)
    );
  }
  function n(t, n) {
    if (!(t instanceof n))
      throw new TypeError("Cannot call a class as a function");
  }
  function e(n, e) {
    for (var o = 0; o < e.length; o++) {
      var r = e[o];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(
          n,
          (void 0,
          (i = (function (n, e) {
            if ("object" !== t(n) || null === n) return n;
            var o = n[Symbol.toPrimitive];
            if (void 0 !== o) {
              var r = o.call(n, "string");
              if ("object" !== t(r)) return r;
              throw new TypeError(
                "@@toPrimitive must return a primitive value."
              );
            }
            return String(n);
          })(r.key)),
          "symbol" === t(i) ? i : String(i)),
          r
        );
    }
    var i;
  }
  function o(t, n, o) {
    return (
      n && e(t.prototype, n),
      o && e(t, o),
      Object.defineProperty(t, "prototype", { writable: !1 }),
      t
    );
  }
  window.onload = function () {
    document.getElementById("btn").addEventListener("click", function () {
      new i();
    });
  };
  var r = (function () {
      function t() {
        n(this, t), (this.endpoint = "act.ion.aspx");
      }
      return (
        o(t, [
          {
            key: "sendReq",
            value: function (t) {
              fetch("/api/base/" + this.endpoint + "?" + t);
            },
          },
        ]),
        t
      );
    })(),
    i = (function () {
      function t() {
        n(this, t), (this.requester = new r());
      }
      return (
        o(t, [
          {
            key: "testing",
            value: function () {
              this.requester.sendReq("x=foo&y=bar");
            },
          },
        ]),
        t
      );
    })();
})();
