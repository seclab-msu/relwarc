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
      var i = e[o];
      (i.enumerable = i.enumerable || !1),
        (i.configurable = !0),
        "value" in i && (i.writable = !0),
        Object.defineProperty(
          n,
          (void 0,
          (r = (function (n, e) {
            if ("object" !== t(n) || null === n) return n;
            var o = n[Symbol.toPrimitive];
            if (void 0 !== o) {
              var i = o.call(n, "string");
              if ("object" !== t(i)) return i;
              throw new TypeError(
                "@@toPrimitive must return a primitive value."
              );
            }
            return String(n);
          })(i.key)),
          "symbol" === t(r) ? r : String(r)),
          i
        );
    }
    var r;
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
      new i(), new r();
    });
  };
  var i = (function () {
      function t() {
        n(this, t), (this.field = "path1");
      }
      return (
        o(t, [
          {
            key: "method1",
            value: function () {
              fetch("/tst1/" + this.field);
            },
          },
        ]),
        t
      );
    })(),
    r = (function () {
      function t() {
        n(this, t), (this.field = "path2");
      }
      return (
        o(t, [
          {
            key: "method1",
            value: function () {
              fetch("/tst2/" + this.field);
            },
          },
        ]),
        t
      );
    })();
})();
