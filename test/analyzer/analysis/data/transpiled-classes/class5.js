!(function () {
  function t(e) {
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
      t(e)
    );
  }
  function e(e, n) {
    for (var o = 0; o < n.length; o++) {
      var r = n[o];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(
          e,
          (void 0,
          (i = (function (e, n) {
            if ("object" !== t(e) || null === e) return e;
            var o = e[Symbol.toPrimitive];
            if (void 0 !== o) {
              var r = o.call(e, "string");
              if ("object" !== t(r)) return r;
              throw new TypeError(
                "@@toPrimitive must return a primitive value."
              );
            }
            return String(e);
          })(r.key)),
          "symbol" === t(i) ? i : String(i)),
          r
        );
    }
    var i;
  }
  window.onload = function () {
    document.getElementById("btn").addEventListener("click", function () {
      var t;
      ((t = new n()).field = "new"), fetch("/tst/" + t.field);
    });
  };
  var n = (function () {
    function t() {
      !(function (t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      })(this, t),
        (this.field = "abcd123");
    }
    var n, o;
    return (
      (n = t),
      (o = [
        {
          key: "method1",
          value: function () {
            this.field = this.field + "56";
          },
        },
      ]) && e(n.prototype, o),
      Object.defineProperty(n, "prototype", { writable: !1 }),
      t
    );
  })();
})();
