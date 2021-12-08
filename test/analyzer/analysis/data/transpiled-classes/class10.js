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
  function e(t, n) {
    return (
      (e = Object.setPrototypeOf
        ? Object.setPrototypeOf.bind()
        : function (t, e) {
            return (t.__proto__ = e), t;
          }),
      e(t, n)
    );
  }
  function n(t) {
    return (
      (n = Object.setPrototypeOf
        ? Object.getPrototypeOf.bind()
        : function (t) {
            return t.__proto__ || Object.getPrototypeOf(t);
          }),
      n(t)
    );
  }
  function r(e, n) {
    for (var r = 0; r < n.length; r++) {
      var o = n[r];
      (o.enumerable = o.enumerable || !1),
        (o.configurable = !0),
        "value" in o && (o.writable = !0),
        Object.defineProperty(
          e,
          (void 0,
          (i = (function (e, n) {
            if ("object" !== t(e) || null === e) return e;
            var r = e[Symbol.toPrimitive];
            if (void 0 !== r) {
              var o = r.call(e, "string");
              if ("object" !== t(o)) return o;
              throw new TypeError(
                "@@toPrimitive must return a primitive value."
              );
            }
            return String(e);
          })(o.key)),
          "symbol" === t(i) ? i : String(i)),
          o
        );
    }
    var i;
  }
  function o(t, e, n) {
    return (
      e && r(t.prototype, e),
      n && r(t, n),
      Object.defineProperty(t, "prototype", { writable: !1 }),
      t
    );
  }
  function i(t, e) {
    if (!(t instanceof e))
      throw new TypeError("Cannot call a class as a function");
  }
  var u = (function (r) {
    !(function (t, n) {
      if ("function" != typeof n && null !== n)
        throw new TypeError(
          "Super expression must either be null or a function"
        );
      (t.prototype = Object.create(n && n.prototype, {
        constructor: { value: t, writable: !0, configurable: !0 },
      })),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        n && e(t, n);
    })(l, r);
    var u,
      c,
      f =
        ((u = l),
        (c = (function () {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return (
              Boolean.prototype.valueOf.call(
                Reflect.construct(Boolean, [], function () {})
              ),
              !0
            );
          } catch (t) {
            return !1;
          }
        })()),
        function () {
          var e,
            r = n(u);
          if (c) {
            var o = n(this).constructor;
            e = Reflect.construct(r, arguments, o);
          } else e = r.apply(this, arguments);
          return (function (e, n) {
            if (n && ("object" === t(n) || "function" == typeof n)) return n;
            if (void 0 !== n)
              throw new TypeError(
                "Derived constructors may only return object or undefined"
              );
            return (function (t) {
              if (void 0 === t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return t;
            })(e);
          })(this, e);
        });
    function l(t) {
      var e;
      return i(this, l), ((e = f.call(this, t)).path = null), e;
    }
    return (
      o(l, [
        {
          key: "setTo",
          value: function () {
            this.path = "/tst";
          },
        },
        {
          key: "sendReq",
          value: function () {
            fetch(this.path);
          },
        },
      ]),
      l
    );
  })(
    o(function t(e) {
      i(this, t), (this.someField = e);
    })
  );
  window.onload = function () {
    document.getElementById("btn").addEventListener("click", function () {
      new u();
    });
  };
})();
