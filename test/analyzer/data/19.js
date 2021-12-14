/*! jQuery v3.4.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(C, e) {
    "use strict";
    var t = [],
        E = C.document,
        r = Object.getPrototypeOf,
        s = t.slice,
        g = t.concat,
        u = t.push,
        i = t.indexOf,
        n = {},
        o = n.toString,
        v = n.hasOwnProperty,
        a = v.toString,
        l = a.call(Object),
        y = {},
        m = function(e) {
            return "function" == typeof e && "number" != typeof e.nodeType
        },
        x = function(e) {
            return null != e && e === e.window
        },
        c = {
            type: !0,
            src: !0,
            nonce: !0,
            noModule: !0
        };
    function b(e, t, n) {
        var r,
            i,
            o = (n = n || E).createElement("script");
        if (o.text = e, t)
            for (r in c)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
        n.head.appendChild(o).parentNode.removeChild(o)
    }
    function w(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? n[o.call(e)] || "object" : typeof e
    }
    var f = "3.4.1",
        k = function(e, t) {
            return new k.fn.init(e, t)
        },
        p = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    function d(e) {
        var t = !!e && "length" in e && e.length,
            n = w(e);
        return !m(e) && !x(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    k.fn = k.prototype = {
        jquery: f,
        constructor: k,
        length: 0,
        toArray: function() {
            return s.call(this)
        },
        get: function(e) {
            return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = k.merge(this.constructor(), e);
            return t.prevObject = this, t
        },
        each: function(e) {
            return k.each(this, e)
        },
        map: function(n) {
            return this.pushStack(k.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(s.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: u,
        sort: t.sort,
        splice: t.splice
    }, k.extend = k.fn.extend = function() {
        var e,
            t,
            n,
            r,
            i,
            o,
            a = arguments[0] || {},
            s = 1,
            u = arguments.length,
            l = !1;
        for ("boolean" == typeof a && (l = a, a = arguments[s] || {}, s++), "object" == typeof a || m(a) || (a = {}), s === u && (a = this, s--); s < u; s++)
            if (null != (e = arguments[s]))
                for (t in e)
                    r = e[t], "__proto__" !== t && a !== r && (l && r && (k.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t], o = i && !Array.isArray(n) ? [] : i || k.isPlainObject(n) ? n : {}, i = !1, a[t] = k.extend(l, o, r)) : void 0 !== r && (a[t] = r));
        return a
    }, k.extend({
        expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t,
                n;
            return !(!e || "[object Object]" !== o.call(e)) && (!(t = r(e)) || "function" == typeof (n = v.call(t, "constructor") && t.constructor) && a.call(n) === l)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        globalEval: function(e, t) {
            b(e, {
                nonce: t && t.nonce
            })
        },
        each: function(e, t) {
            var n,
                r = 0;
            if (d(e)) {
                for (n = e.length; r < n; r++)
                    if (!1 === t.call(e[r], r, e[r]))
                        break
            } else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r]))
                        break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(p, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (d(Object(e)) ? k.merge(n, "string" == typeof e ? [e] : e) : u.call(n, e)), n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : i.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                !t(e[i], i) !== a && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r,
                i,
                o = 0,
                a = [];
            if (d(e))
                for (r = e.length; o < r; o++)
                    null != (i = t(e[o], o, n)) && a.push(i);
            else
                for (o in e)
                    null != (i = t(e[o], o, n)) && a.push(i);
            return g.apply([], a)
        },
        guid: 1,
        support: y
    }), "function" == typeof Symbol && (k.fn[Symbol.iterator] = t[Symbol.iterator]), k.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        n["[object " + t + "]"] = t.toLowerCase()
    });
    var h = function(n) {
        var e,
            d,
            b,
            o,
            i,
            h,
            f,
            g,
            w,
            u,
            l,
            T,
            C,
            a,
            E,
            v,
            s,
            c,
            y,
            k = "sizzle" + 1 * new Date,
            m = n.document,
            S = 0,
            r = 0,
            p = ue(),
            x = ue(),
            N = ue(),
            A = ue(),
            D = function(e, t) {
                return e === t && (l = !0), 0
            },
            j = {}.hasOwnProperty,
            t = [],
            q = t.pop,
            L = t.push,
            H = t.push,
            O = t.slice,
            P = function(e, t) {
                for (var n = 0, r = e.length; n < r; n++)
                    if (e[n] === t)
                        return n;
                return -1
            },
            R = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            M = "[\\x20\\t\\r\\n\\f]",
            I = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            W = "\\[" + M + "*(" + I + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + I + "))|)" + M + "*\\]",
            $ = ":(" + I + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + W + ")*)|.*)\\)|)",
            F = new RegExp(M + "+", "g"),
            B = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"),
            _ = new RegExp("^" + M + "*," + M + "*"),
            z = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
            U = new RegExp(M + "|>"),
            X = new RegExp($),
            V = new RegExp("^" + I + "$"),
            G = {
                ID: new RegExp("^#(" + I + ")"),
                CLASS: new RegExp("^\\.(" + I + ")"),
                TAG: new RegExp("^(" + I + "|[*])"),
                ATTR: new RegExp("^" + W),
                PSEUDO: new RegExp("^" + $),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + R + ")$", "i"),
                needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i")
            },
            Y = /HTML$/i,
            Q = /^(?:input|select|textarea|button)$/i,
            J = /^h\d$/i,
            K = /^[^{]+\{\s*\[native \w/,
            Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ee = /[+~]/,
            te = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"),
            ne = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            },
            re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            ie = function(e, t) {
                return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
            },
            oe = function() {
                T()
            },
            ae = be(function(e) {
                return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            H.apply(t = O.call(m.childNodes), m.childNodes), t[m.childNodes.length].nodeType
        } catch (e) {
            H = {
                apply: t.length ? function(e, t) {
                    L.apply(e, O.call(t))
                } : function(e, t) {
                    var n = e.length,
                        r = 0;
                    while (e[n++] = t[r++])
                        ;
                    e.length = n - 1
                }
            }
        }
        function se(t, e, n, r) {
            var i,
                o,
                a,
                s,
                u,
                l,
                c,
                f = e && e.ownerDocument,
                p = e ? e.nodeType : 9;
            if (n = n || [], "string" != typeof t || !t || 1 !== p && 9 !== p && 11 !== p)
                return n;
            if (!r && ((e ? e.ownerDocument || e : m) !== C && T(e), e = e || C, E)) {
                if (11 !== p && (u = Z.exec(t)))
                    if (i = u[1]) {
                        if (9 === p) {
                            if (!(a = e.getElementById(i)))
                                return n;
                            if (a.id === i)
                                return n.push(a), n
                        } else if (f && (a = f.getElementById(i)) && y(e, a) && a.id === i)
                            return n.push(a), n
                    } else {
                        if (u[2])
                            return H.apply(n, e.getElementsByTagName(t)), n;
                        if ((i = u[3]) && d.getElementsByClassName && e.getElementsByClassName)
                            return H.apply(n, e.getElementsByClassName(i)), n
                    }
                if (d.qsa && !A[t + " "] && (!v || !v.test(t)) && (1 !== p || "object" !== e.nodeName.toLowerCase())) {
                    if (c = t, f = e, 1 === p && U.test(t)) {
                        (s = e.getAttribute("id")) ? s = s.replace(re, ie) : e.setAttribute("id", s = k), o = (l = h(t)).length;
                        while (o--)
                            l[o] = "#" + s + " " + xe(l[o]);
                        c = l.join(","), f = ee.test(t) && ye(e.parentNode) || e
                    }
                    try {
                        return H.apply(n, f.querySelectorAll(c)), n
                    } catch (e) {
                        A(t, !0)
                    } finally {
                        s === k && e.removeAttribute("id")
                    }
                }
            }
            return g(t.replace(B, "$1"), e, n, r)
        }
        function ue() {
            var r = [];
            return function e(t, n) {
                return r.push(t + " ") > b.cacheLength && delete e[r.shift()], e[t + " "] = n
            }
        }
        function le(e) {
            return e[k] = !0, e
        }
        function ce(e) {
            var t = C.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }
        function fe(e, t) {
            var n = e.split("|"),
                r = n.length;
            while (r--)
                b.attrHandle[n[r]] = t
        }
        function pe(e, t) {
            var n = t && e,
                r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r)
                return r;
            if (n)
                while (n = n.nextSibling)
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function de(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }
        function he(n) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }
        function ge(t) {
            return function(e) {
                return "form" in e ? e.parentNode && !1 === e.disabled ? "label" in e ? "label" in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && ae(e) === t : e.disabled === t : "label" in e && e.disabled === t
            }
        }
        function ve(a) {
            return le(function(o) {
                return o = +o, le(function(e, t) {
                    var n,
                        r = a([], e.length, o),
                        i = r.length;
                    while (i--)
                        e[n = r[i]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }
        function ye(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }
        for (e in d = se.support = {}, i = se.isXML = function(e) {
            var t = e.namespaceURI,
                n = (e.ownerDocument || e).documentElement;
            return !Y.test(t || n && n.nodeName || "HTML")
        }, T = se.setDocument = function(e) {
            var t,
                n,
                r = e ? e.ownerDocument || e : m;
            return r !== C && 9 === r.nodeType && r.documentElement && (a = (C = r).documentElement, E = !i(C), m !== C && (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", oe, !1) : n.attachEvent && n.attachEvent("onunload", oe)), d.attributes = ce(function(e) {
                return e.className = "i", !e.getAttribute("className")
            }), d.getElementsByTagName = ce(function(e) {
                return e.appendChild(C.createComment("")), !e.getElementsByTagName("*").length
            }), d.getElementsByClassName = K.test(C.getElementsByClassName), d.getById = ce(function(e) {
                return a.appendChild(e).id = k, !C.getElementsByName || !C.getElementsByName(k).length
            }), d.getById ? (b.filter.ID = function(e) {
                var t = e.replace(te, ne);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }, b.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && E) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }) : (b.filter.ID = function(e) {
                var n = e.replace(te, ne);
                return function(e) {
                    var t = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return t && t.value === n
                }
            }, b.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && E) {
                    var n,
                        r,
                        i,
                        o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                        i = t.getElementsByName(e), r = 0;
                        while (o = i[r++])
                            if ((n = o.getAttributeNode("id")) && n.value === e)
                                return [o]
                    }
                    return []
                }
            }), b.find.TAG = d.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : d.qsa ? t.querySelectorAll(e) : void 0
            } : function(e, t) {
                var n,
                    r = [],
                    i = 0,
                    o = t.getElementsByTagName(e);
                if ("*" === e) {
                    while (n = o[i++])
                        1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }, b.find.CLASS = d.getElementsByClassName && function(e, t) {
                if ("undefined" != typeof t.getElementsByClassName && E)
                    return t.getElementsByClassName(e)
            }, s = [], v = [], (d.qsa = K.test(C.querySelectorAll)) && (ce(function(e) {
                a.appendChild(e).innerHTML = "<a id='" + k + "'></a><select id='" + k + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + M + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || v.push("\\[" + M + "*(?:value|" + R + ")"), e.querySelectorAll("[id~=" + k + "-]").length || v.push("~="), e.querySelectorAll(":checked").length || v.push(":checked"), e.querySelectorAll("a#" + k + "+*").length || v.push(".#.+[+~]")
            }), ce(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = C.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && v.push("name" + M + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"), a.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), v.push(",.*:")
            })), (d.matchesSelector = K.test(c = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) && ce(function(e) {
                d.disconnectedMatch = c.call(e, "*"), c.call(e, "[s!='']:x"), s.push("!=", $)
            }), v = v.length && new RegExp(v.join("|")), s = s.length && new RegExp(s.join("|")), t = K.test(a.compareDocumentPosition), y = t || K.test(a.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            } : function(e, t) {
                if (t)
                    while (t = t.parentNode)
                        if (t === e)
                            return !0;
                return !1
            }, D = t ? function(e, t) {
                if (e === t)
                    return l = !0, 0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !d.sortDetached && t.compareDocumentPosition(e) === n ? e === C || e.ownerDocument === m && y(m, e) ? -1 : t === C || t.ownerDocument === m && y(m, t) ? 1 : u ? P(u, e) - P(u, t) : 0 : 4 & n ? -1 : 1)
            } : function(e, t) {
                if (e === t)
                    return l = !0, 0;
                var n,
                    r = 0,
                    i = e.parentNode,
                    o = t.parentNode,
                    a = [e],
                    s = [t];
                if (!i || !o)
                    return e === C ? -1 : t === C ? 1 : i ? -1 : o ? 1 : u ? P(u, e) - P(u, t) : 0;
                if (i === o)
                    return pe(e, t);
                n = e;
                while (n = n.parentNode)
                    a.unshift(n);
                n = t;
                while (n = n.parentNode)
                    s.unshift(n);
                while (a[r] === s[r])
                    r++;
                return r ? pe(a[r], s[r]) : a[r] === m ? -1 : s[r] === m ? 1 : 0
            }), C
        }, se.matches = function(e, t) {
            return se(e, null, null, t)
        }, se.matchesSelector = function(e, t) {
            if ((e.ownerDocument || e) !== C && T(e), d.matchesSelector && E && !A[t + " "] && (!s || !s.test(t)) && (!v || !v.test(t)))
                try {
                    var n = c.call(e, t);
                    if (n || d.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (e) {
                    A(t, !0)
                }
            return 0 < se(t, C, null, [e]).length
        }, se.contains = function(e, t) {
            return (e.ownerDocument || e) !== C && T(e), y(e, t)
        }, se.attr = function(e, t) {
            (e.ownerDocument || e) !== C && T(e);
            var n = b.attrHandle[t.toLowerCase()],
                r = n && j.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
            return void 0 !== r ? r : d.attributes || !E ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }, se.escape = function(e) {
            return (e + "").replace(re, ie)
        }, se.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, se.uniqueSort = function(e) {
            var t,
                n = [],
                r = 0,
                i = 0;
            if (l = !d.detectDuplicates, u = !d.sortStable && e.slice(0), e.sort(D), l) {
                while (t = e[i++])
                    t === e[i] && (r = n.push(i));
                while (r--)
                    e.splice(n[r], 1)
            }
            return u = null, e
        }, o = se.getText = function(e) {
            var t,
                n = "",
                r = 0,
                i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += o(e)
                } else if (3 === i || 4 === i)
                    return e.nodeValue
            } else
                while (t = e[r++])
                    n += o(t);
            return n
        }, (b = se.selectors = {
            cacheLength: 50,
            createPseudo: le,
            match: G,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(te, ne), e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || se.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && se.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t,
                        n = !e[6] && e[2];
                    return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && X.test(n) && (t = h(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(te, ne).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = p[e + " "];
                    return t || (t = new RegExp("(^|" + M + ")" + e + "(" + M + "|$)")) && p(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                        })
                },
                ATTR: function(n, r, i) {
                    return function(e) {
                        var t = se.attr(e, n);
                        return null == t ? "!=" === r : !r || (t += "", "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t.replace(F, " ") + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"))
                    }
                },
                CHILD: function(h, e, t, g, v) {
                    var y = "nth" !== h.slice(0, 3),
                        m = "last" !== h.slice(-4),
                        x = "of-type" === e;
                    return 1 === g && 0 === v ? function(e) {
                        return !!e.parentNode
                    } : function(e, t, n) {
                        var r,
                            i,
                            o,
                            a,
                            s,
                            u,
                            l = y !== m ? "nextSibling" : "previousSibling",
                            c = e.parentNode,
                            f = x && e.nodeName.toLowerCase(),
                            p = !n && !x,
                            d = !1;
                        if (c) {
                            if (y) {
                                while (l) {
                                    a = e;
                                    while (a = a[l])
                                        if (x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType)
                                            return !1;
                                    u = l = "only" === h && !u && "nextSibling"
                                }
                                return !0
                            }
                            if (u = [m ? c.firstChild : c.lastChild], m && p) {
                                d = (s = (r = (i = (o = (a = c)[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]) && r[2], a = s && c.childNodes[s];
                                while (a = ++s && a && a[l] || (d = s = 0) || u.pop())
                                    if (1 === a.nodeType && ++d && a === e) {
                                        i[h] = [S, s, d];
                                        break
                                    }
                            } else if (p && (d = s = (r = (i = (o = (a = e)[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]), !1 === d)
                                while (a = ++s && a && a[l] || (d = s = 0) || u.pop())
                                    if ((x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType) && ++d && (p && ((i = (o = a[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [S, d]), a === e))
                                        break;
                            return (d -= v) === g || d % g == 0 && 0 <= d / g
                        }
                    }
                },
                PSEUDO: function(e, o) {
                    var t,
                        a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
                    return a[k] ? a(o) : 1 < a.length ? (t = [e, e, "", o], b.setFilters.hasOwnProperty(e.toLowerCase()) ? le(function(e, t) {
                        var n,
                            r = a(e, o),
                            i = r.length;
                        while (i--)
                            e[n = P(e, r[i])] = !(t[n] = r[i])
                    }) : function(e) {
                        return a(e, 0, t)
                    }) : a
                }
            },
            pseudos: {
                not: le(function(e) {
                    var r = [],
                        i = [],
                        s = f(e.replace(B, "$1"));
                    return s[k] ? le(function(e, t, n, r) {
                        var i,
                            o = s(e, null, r, []),
                            a = e.length;
                        while (a--)
                            (i = o[a]) && (e[a] = !(t[a] = i))
                    }) : function(e, t, n) {
                        return r[0] = e, s(r, null, n, i), r[0] = null, !i.pop()
                    }
                }),
                has: le(function(t) {
                    return function(e) {
                        return 0 < se(t, e).length
                    }
                }),
                contains: le(function(t) {
                    return t = t.replace(te, ne), function(e) {
                        return -1 < (e.textContent || o(e)).indexOf(t)
                    }
                }),
                lang: le(function(n) {
                    return V.test(n || "") || se.error("unsupported lang: " + n), n = n.replace(te, ne).toLowerCase(), function(e) {
                        var t;
                        do {
                            if (t = E ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                        } while ((e = e.parentNode) && 1 === e.nodeType);
                        return !1
                    }
                }),
                target: function(e) {
                    var t = n.location && n.location.hash;
                    return t && t.slice(1) === e.id
                },
                root: function(e) {
                    return e === a
                },
                focus: function(e) {
                    return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: ge(!1),
                disabled: ge(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !b.pseudos.empty(e)
                },
                header: function(e) {
                    return J.test(e.nodeName)
                },
                input: function(e) {
                    return Q.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: ve(function() {
                    return [0]
                }),
                last: ve(function(e, t) {
                    return [t - 1]
                }),
                eq: ve(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: ve(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: ve(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: ve(function(e, t, n) {
                    for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r;)
                        e.push(r);
                    return e
                }),
                gt: ve(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t;)
                        e.push(r);
                    return e
                })
            }
        }).pseudos.nth = b.pseudos.eq, {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            b.pseudos[e] = de(e);
        for (e in {
            submit: !0,
            reset: !0
        })
            b.pseudos[e] = he(e);
        function me() {}
        function xe(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function be(s, e, t) {
            var u = e.dir,
                l = e.next,
                c = l || u,
                f = t && "parentNode" === c,
                p = r++;
            return e.first ? function(e, t, n) {
                while (e = e[u])
                    if (1 === e.nodeType || f)
                        return s(e, t, n);
                return !1
            } : function(e, t, n) {
                var r,
                    i,
                    o,
                    a = [S, p];
                if (n) {
                    while (e = e[u])
                        if ((1 === e.nodeType || f) && s(e, t, n))
                            return !0
                } else
                    while (e = e[u])
                        if (1 === e.nodeType || f)
                            if (i = (o = e[k] || (e[k] = {}))[e.uniqueID] || (o[e.uniqueID] = {}), l && l === e.nodeName.toLowerCase())
                                e = e[u] || e;
                            else {
                                if ((r = i[c]) && r[0] === S && r[1] === p)
                                    return a[2] = r[2];
                                if ((i[c] = a)[2] = s(e, t, n))
                                    return !0
                            }
                return !1
            }
        }
        function we(i) {
            return 1 < i.length ? function(e, t, n) {
                var r = i.length;
                while (r--)
                    if (!i[r](e, t, n))
                        return !1;
                return !0
            } : i[0]
        }
        function Te(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o), l && t.push(s)));
            return a
        }
        function Ce(d, h, g, v, y, e) {
            return v && !v[k] && (v = Ce(v)), y && !y[k] && (y = Ce(y, e)), le(function(e, t, n, r) {
                var i,
                    o,
                    a,
                    s = [],
                    u = [],
                    l = t.length,
                    c = e || function(e, t, n) {
                        for (var r = 0, i = t.length; r < i; r++)
                            se(e, t[r], n);
                        return n
                    }(h || "*", n.nodeType ? [n] : n, []),
                    f = !d || !e && h ? c : Te(c, s, d, n, r),
                    p = g ? y || (e ? d : l || v) ? [] : t : f;
                if (g && g(f, p, n, r), v) {
                    i = Te(p, u), v(i, [], n, r), o = i.length;
                    while (o--)
                        (a = i[o]) && (p[u[o]] = !(f[u[o]] = a))
                }
                if (e) {
                    if (y || d) {
                        if (y) {
                            i = [], o = p.length;
                            while (o--)
                                (a = p[o]) && i.push(f[o] = a);
                            y(null, p = [], i, r)
                        }
                        o = p.length;
                        while (o--)
                            (a = p[o]) && -1 < (i = y ? P(e, a) : s[o]) && (e[i] = !(t[i] = a))
                    }
                } else
                    p = Te(p === t ? p.splice(l, p.length) : p), y ? y(null, t, p, r) : H.apply(t, p)
            })
        }
        function Ee(e) {
            for (var i, t, n, r = e.length, o = b.relative[e[0].type], a = o || b.relative[" "], s = o ? 1 : 0, u = be(function(e) {
                    return e === i
                }, a, !0), l = be(function(e) {
                    return -1 < P(i, e)
                }, a, !0), c = [function(e, t, n) {
                    var r = !o && (n || t !== w) || ((i = t).nodeType ? u(e, t, n) : l(e, t, n));
                    return i = null, r
                }]; s < r; s++)
                if (t = b.relative[e[s].type])
                    c = [be(we(c), t)];
                else {
                    if ((t = b.filter[e[s].type].apply(null, e[s].matches))[k]) {
                        for (n = ++s; n < r; n++)
                            if (b.relative[e[n].type])
                                break;
                        return Ce(1 < s && we(c), 1 < s && xe(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(B, "$1"), t, s < n && Ee(e.slice(s, n)), n < r && Ee(e = e.slice(n)), n < r && xe(e))
                    }
                    c.push(t)
                }
            return we(c)
        }
        return me.prototype = b.filters = b.pseudos, b.setFilters = new me, h = se.tokenize = function(e, t) {
            var n,
                r,
                i,
                o,
                a,
                s,
                u,
                l = x[e + " "];
            if (l)
                return t ? 0 : l.slice(0);
            a = e, s = [], u = b.preFilter;
            while (a) {
                for (o in n && !(r = _.exec(a)) || (r && (a = a.slice(r[0].length) || a), s.push(i = [])), n = !1, (r = z.exec(a)) && (n = r.shift(), i.push({
                    value: n,
                    type: r[0].replace(B, " ")
                }), a = a.slice(n.length)), b.filter)
                    !(r = G[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(), i.push({
                        value: n,
                        type: o,
                        matches: r
                    }), a = a.slice(n.length));
                if (!n)
                    break
            }
            return t ? a.length : a ? se.error(e) : x(e, s).slice(0)
        }, f = se.compile = function(e, t) {
            var n,
                v,
                y,
                m,
                x,
                r,
                i = [],
                o = [],
                a = N[e + " "];
            if (!a) {
                t || (t = h(e)), n = t.length;
                while (n--)
                    (a = Ee(t[n]))[k] ? i.push(a) : o.push(a);
                (a = N(e, (v = o, m = 0 < (y = i).length, x = 0 < v.length, r = function(e, t, n, r, i) {
                    var o,
                        a,
                        s,
                        u = 0,
                        l = "0",
                        c = e && [],
                        f = [],
                        p = w,
                        d = e || x && b.find.TAG("*", i),
                        h = S += null == p ? 1 : Math.random() || .1,
                        g = d.length;
                    for (i && (w = t === C || t || i); l !== g && null != (o = d[l]); l++) {
                        if (x && o) {
                            a = 0, t || o.ownerDocument === C || (T(o), n = !E);
                            while (s = v[a++])
                                if (s(o, t || C, n)) {
                                    r.push(o);
                                    break
                                }
                            i && (S = h)
                        }
                        m && ((o = !s && o) && u--, e && c.push(o))
                    }
                    if (u += l, m && l !== u) {
                        a = 0;
                        while (s = y[a++])
                            s(c, f, t, n);
                        if (e) {
                            if (0 < u)
                                while (l--)
                                    c[l] || f[l] || (f[l] = q.call(r));
                            f = Te(f)
                        }
                        H.apply(r, f), i && !e && 0 < f.length && 1 < u + y.length && se.uniqueSort(r)
                    }
                    return i && (S = h, w = p), c
                }, m ? le(r) : r))).selector = e
            }
            return a
        }, g = se.select = function(e, t, n, r) {
            var i,
                o,
                a,
                s,
                u,
                l = "function" == typeof e && e,
                c = !r && h(e = l.selector || e);
            if (n = n || [], 1 === c.length) {
                if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && E && b.relative[o[1].type]) {
                    if (!(t = (b.find.ID(a.matches[0].replace(te, ne), t) || [])[0]))
                        return n;
                    l && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                i = G.needsContext.test(e) ? 0 : o.length;
                while (i--) {
                    if (a = o[i], b.relative[s = a.type])
                        break;
                    if ((u = b.find[s]) && (r = u(a.matches[0].replace(te, ne), ee.test(o[0].type) && ye(t.parentNode) || t))) {
                        if (o.splice(i, 1), !(e = r.length && xe(o)))
                            return H.apply(n, r), n;
                        break
                    }
                }
            }
            return (l || f(e, c))(r, t, !E, n, !t || ee.test(e) && ye(t.parentNode) || t), n
        }, d.sortStable = k.split("").sort(D).join("") === k, d.detectDuplicates = !!l, T(), d.sortDetached = ce(function(e) {
            return 1 & e.compareDocumentPosition(C.createElement("fieldset"))
        }), ce(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || fe("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), d.attributes && ce(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || fe("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }), ce(function(e) {
            return null == e.getAttribute("disabled")
        }) || fe(R, function(e, t, n) {
            var r;
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }), se
    }(C);
    k.find = h, k.expr = h.selectors, k.expr[":"] = k.expr.pseudos, k.uniqueSort = k.unique = h.uniqueSort, k.text = h.getText, k.isXMLDoc = h.isXML, k.contains = h.contains, k.escapeSelector = h.escape;
    var T = function(e, t, n) {
            var r = [],
                i = void 0 !== n;
            while ((e = e[t]) && 9 !== e.nodeType)
                if (1 === e.nodeType) {
                    if (i && k(e).is(n))
                        break;
                    r.push(e)
                }
            return r
        },
        S = function(e, t) {
            for (var n = []; e; e = e.nextSibling)
                1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        N = k.expr.match.needsContext;
    function A(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    var D = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function j(e, n, r) {
        return m(n) ? k.grep(e, function(e, t) {
            return !!n.call(e, t, e) !== r
        }) : n.nodeType ? k.grep(e, function(e) {
            return e === n !== r
        }) : "string" != typeof n ? k.grep(e, function(e) {
            return -1 < i.call(n, e) !== r
        }) : k.filter(n, e, r)
    }
    k.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? k.find.matchesSelector(r, e) ? [r] : [] : k.find.matches(e, k.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, k.fn.extend({
        find: function(e) {
            var t,
                n,
                r = this.length,
                i = this;
            if ("string" != typeof e)
                return this.pushStack(k(e).filter(function() {
                    for (t = 0; t < r; t++)
                        if (k.contains(i[t], this))
                            return !0
                }));
            for (n = this.pushStack([]), t = 0; t < r; t++)
                k.find(e, i[t], n);
            return 1 < r ? k.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(j(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(j(this, e || [], !0))
        },
        is: function(e) {
            return !!j(this, "string" == typeof e && N.test(e) ? k(e) : e || [], !1).length
        }
    });
    var q,
        L = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (k.fn.init = function(e, t, n) {
        var r,
            i;
        if (!e)
            return this;
        if (n = n || q, "string" == typeof e) {
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : L.exec(e)) || !r[1] && t)
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof k ? t[0] : t, k.merge(this, k.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, !0)), D.test(r[1]) && k.isPlainObject(t))
                    for (r in t)
                        m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return (i = E.getElementById(r[2])) && (this[0] = i, this.length = 1), this
        }
        return e.nodeType ? (this[0] = e, this.length = 1, this) : m(e) ? void 0 !== n.ready ? n.ready(e) : e(k) : k.makeArray(e, this)
    }).prototype = k.fn, q = k(E);
    var H = /^(?:parents|prev(?:Until|All))/,
        O = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    function P(e, t) {
        while ((e = e[t]) && 1 !== e.nodeType)
            ;
        return e
    }
    k.fn.extend({
        has: function(e) {
            var t = k(e, this),
                n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (k.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var n,
                r = 0,
                i = this.length,
                o = [],
                a = "string" != typeof e && k(e);
            if (!N.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && k.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
            return this.pushStack(1 < o.length ? k.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? i.call(k(e), this[0]) : i.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(k.uniqueSort(k.merge(this.get(), k(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), k.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return T(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return T(e, "parentNode", n)
        },
        next: function(e) {
            return P(e, "nextSibling")
        },
        prev: function(e) {
            return P(e, "previousSibling")
        },
        nextAll: function(e) {
            return T(e, "nextSibling")
        },
        prevAll: function(e) {
            return T(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return T(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return T(e, "previousSibling", n)
        },
        siblings: function(e) {
            return S((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return S(e.firstChild)
        },
        contents: function(e) {
            return "undefined" != typeof e.contentDocument ? e.contentDocument : (A(e, "template") && (e = e.content || e), k.merge([], e.childNodes))
        }
    }, function(r, i) {
        k.fn[r] = function(e, t) {
            var n = k.map(this, i, e);
            return "Until" !== r.slice(-5) && (t = e), t && "string" == typeof t && (n = k.filter(t, n)), 1 < this.length && (O[r] || k.uniqueSort(n), H.test(r) && n.reverse()), this.pushStack(n)
        }
    });
    var R = /[^\x20\t\r\n\f]+/g;
    function M(e) {
        return e
    }
    function I(e) {
        throw e
    }
    function W(e, t, n, r) {
        var i;
        try {
            e && m(i = e.promise) ? i.call(e).done(t).fail(n) : e && m(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    k.Callbacks = function(r) {
        var e,
            n;
        r = "string" == typeof r ? (e = r, n = {}, k.each(e.match(R) || [], function(e, t) {
            n[t] = !0
        }), n) : k.extend({}, r);
        var i,
            t,
            o,
            a,
            s = [],
            u = [],
            l = -1,
            c = function() {
                for (a = a || r.once, o = i = !0; u.length; l = -1) {
                    t = u.shift();
                    while (++l < s.length)
                        !1 === s[l].apply(t[0], t[1]) && r.stopOnFalse && (l = s.length, t = !1)
                }
                r.memory || (t = !1), i = !1, a && (s = t ? [] : "")
            },
            f = {
                add: function() {
                    return s && (t && !i && (l = s.length - 1, u.push(t)), function n(e) {
                        k.each(e, function(e, t) {
                            m(t) ? r.unique && f.has(t) || s.push(t) : t && t.length && "string" !== w(t) && n(t)
                        })
                    }(arguments), t && !i && c()), this
                },
                remove: function() {
                    return k.each(arguments, function(e, t) {
                        var n;
                        while (-1 < (n = k.inArray(t, s, n)))
                            s.splice(n, 1), n <= l && l--
                    }), this
                },
                has: function(e) {
                    return e ? -1 < k.inArray(e, s) : 0 < s.length
                },
                empty: function() {
                    return s && (s = []), this
                },
                disable: function() {
                    return a = u = [], s = t = "", this
                },
                disabled: function() {
                    return !s
                },
                lock: function() {
                    return a = u = [], t || i || (s = t = ""), this
                },
                locked: function() {
                    return !!a
                },
                fireWith: function(e, t) {
                    return a || (t = [e, (t = t || []).slice ? t.slice() : t], u.push(t), i || c()), this
                },
                fire: function() {
                    return f.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!o
                }
            };
        return f
    }, k.extend({
        Deferred: function(e) {
            var o = [["notify", "progress", k.Callbacks("memory"), k.Callbacks("memory"), 2], ["resolve", "done", k.Callbacks("once memory"), k.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", k.Callbacks("once memory"), k.Callbacks("once memory"), 1, "rejected"]],
                i = "pending",
                a = {
                    state: function() {
                        return i
                    },
                    always: function() {
                        return s.done(arguments).fail(arguments), this
                    },
                    "catch": function(e) {
                        return a.then(null, e)
                    },
                    pipe: function() {
                        var i = arguments;
                        return k.Deferred(function(r) {
                            k.each(o, function(e, t) {
                                var n = m(i[t[4]]) && i[t[4]];
                                s[t[1]](function() {
                                    var e = n && n.apply(this, arguments);
                                    e && m(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this, n ? [e] : arguments)
                                })
                            }), i = null
                        }).promise()
                    },
                    then: function(t, n, r) {
                        var u = 0;
                        function l(i, o, a, s) {
                            return function() {
                                var n = this,
                                    r = arguments,
                                    e = function() {
                                        var e,
                                            t;
                                        if (!(i < u)) {
                                            if ((e = a.apply(n, r)) === o.promise())
                                                throw new TypeError("Thenable self-resolution");
                                            t = e && ("object" == typeof e || "function" == typeof e) && e.then, m(t) ? s ? t.call(e, l(u, o, M, s), l(u, o, I, s)) : (u++, t.call(e, l(u, o, M, s), l(u, o, I, s), l(u, o, M, o.notifyWith))) : (a !== M && (n = void 0, r = [e]), (s || o.resolveWith)(n, r))
                                        }
                                    },
                                    t = s ? e : function() {
                                        try {
                                            e()
                                        } catch (e) {
                                            k.Deferred.exceptionHook && k.Deferred.exceptionHook(e, t.stackTrace), u <= i + 1 && (a !== I && (n = void 0, r = [e]), o.rejectWith(n, r))
                                        }
                                    };
                                i ? t() : (k.Deferred.getStackHook && (t.stackTrace = k.Deferred.getStackHook()), C.setTimeout(t))
                            }
                        }
                        return k.Deferred(function(e) {
                            o[0][3].add(l(0, e, m(r) ? r : M, e.notifyWith)), o[1][3].add(l(0, e, m(t) ? t : M)), o[2][3].add(l(0, e, m(n) ? n : I))
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? k.extend(e, a) : a
                    }
                },
                s = {};
            return k.each(o, function(e, t) {
                var n = t[2],
                    r = t[5];
                a[t[1]] = n.add, r && n.add(function() {
                    i = r
                }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock), n.add(t[3].fire), s[t[0]] = function() {
                    return s[t[0] + "With"](this === s ? void 0 : this, arguments), this
                }, s[t[0] + "With"] = n.fireWith
            }), a.promise(s), e && e.call(s, s), s
        },
        when: function(e) {
            var n = arguments.length,
                t = n,
                r = Array(t),
                i = s.call(arguments),
                o = k.Deferred(),
                a = function(t) {
                    return function(e) {
                        r[t] = this, i[t] = 1 < arguments.length ? s.call(arguments) : e, --n || o.resolveWith(r, i)
                    }
                };
            if (n <= 1 && (W(e, o.done(a(t)).resolve, o.reject, !n), "pending" === o.state() || m(i[t] && i[t].then)))
                return o.then();
            while (t--)
                W(i[t], a(t), o.reject);
            return o.promise()
        }
    });
    var $ = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    k.Deferred.exceptionHook = function(e, t) {
        C.console && C.console.warn && e && $.test(e.name) && C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
    }, k.readyException = function(e) {
        C.setTimeout(function() {
            throw e
        })
    };
    var F = k.Deferred();
    function B() {
        E.removeEventListener("DOMContentLoaded", B), C.removeEventListener("load", B), k.ready()
    }
    k.fn.ready = function(e) {
        return F.then(e)["catch"](function(e) {
            k.readyException(e)
        }), this
    }, k.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --k.readyWait : k.isReady) || (k.isReady = !0) !== e && 0 < --k.readyWait || F.resolveWith(E, [k])
        }
    }), k.ready.then = F.then, "complete" === E.readyState || "loading" !== E.readyState && !E.documentElement.doScroll ? C.setTimeout(k.ready) : (E.addEventListener("DOMContentLoaded", B), C.addEventListener("load", B));
    var _ = function(e, t, n, r, i, o, a) {
            var s = 0,
                u = e.length,
                l = null == n;
            if ("object" === w(n))
                for (s in i = !0, n)
                    _(e, t, s, n[s], !0, o, a);
            else if (void 0 !== r && (i = !0, m(r) || (a = !0), l && (a ? (t.call(e, r), t = null) : (l = t, t = function(e, t, n) {
                return l.call(k(e), n)
            })), t))
                for (; s < u; s++)
                    t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
            return i ? e : l ? t.call(e) : u ? t(e[0], n) : o
        },
        z = /^-ms-/,
        U = /-([a-z])/g;
    function X(e, t) {
        return t.toUpperCase()
    }
    function V(e) {
        return e.replace(z, "ms-").replace(U, X)
    }
    var G = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    function Y() {
        this.expando = k.expando + Y.uid++
    }
    Y.uid = 1, Y.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {}, G(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))), t
        },
        set: function(e, t, n) {
            var r,
                i = this.cache(e);
            if ("string" == typeof t)
                i[V(t)] = n;
            else
                for (r in t)
                    i[V(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][V(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n,
                r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(V) : (t = V(t)) in r ? [t] : t.match(R) || []).length;
                    while (n--)
                        delete r[t[n]]
                }
                (void 0 === t || k.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !k.isEmptyObject(t)
        }
    };
    var Q = new Y,
        J = new Y,
        K = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Z = /[A-Z]/g;
    function ee(e, t, n) {
        var r,
            i;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(Z, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = "true" === (i = n) || "false" !== i && ("null" === i ? null : i === +i + "" ? +i : K.test(i) ? JSON.parse(i) : i)
                } catch (e) {}
                J.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    k.extend({
        hasData: function(e) {
            return J.hasData(e) || Q.hasData(e)
        },
        data: function(e, t, n) {
            return J.access(e, t, n)
        },
        removeData: function(e, t) {
            J.remove(e, t)
        },
        _data: function(e, t, n) {
            return Q.access(e, t, n)
        },
        _removeData: function(e, t) {
            Q.remove(e, t)
        }
    }), k.fn.extend({
        data: function(n, e) {
            var t,
                r,
                i,
                o = this[0],
                a = o && o.attributes;
            if (void 0 === n) {
                if (this.length && (i = J.get(o), 1 === o.nodeType && !Q.get(o, "hasDataAttrs"))) {
                    t = a.length;
                    while (t--)
                        a[t] && 0 === (r = a[t].name).indexOf("data-") && (r = V(r.slice(5)), ee(o, r, i[r]));
                    Q.set(o, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof n ? this.each(function() {
                J.set(this, n)
            }) : _(this, function(e) {
                var t;
                if (o && void 0 === e)
                    return void 0 !== (t = J.get(o, n)) ? t : void 0 !== (t = ee(o, n)) ? t : void 0;
                this.each(function() {
                    J.set(this, n, e)
                })
            }, null, e, 1 < arguments.length, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                J.remove(this, e)
            })
        }
    }), k.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return t = (t || "fx") + "queue", r = Q.get(e, t), n && (!r || Array.isArray(n) ? r = Q.access(e, t, k.makeArray(n)) : r.push(n)), r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = k.queue(e, t),
                r = n.length,
                i = n.shift(),
                o = k._queueHooks(e, t);
            "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, function() {
                k.dequeue(e, t)
            }, o)), !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return Q.get(e, n) || Q.access(e, n, {
                    empty: k.Callbacks("once memory").add(function() {
                        Q.remove(e, [t + "queue", n])
                    })
                })
        }
    }), k.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t, t = "fx", e--), arguments.length < e ? k.queue(this[0], t) : void 0 === n ? this : this.each(function() {
                var e = k.queue(this, t, n);
                k._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && k.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                k.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n,
                r = 1,
                i = k.Deferred(),
                o = this,
                a = this.length,
                s = function() {
                    --r || i.resolveWith(o, [o])
                };
            "string" != typeof e && (t = e, e = void 0), e = e || "fx";
            while (a--)
                (n = Q.get(o[a], e + "queueHooks")) && n.empty && (r++, n.empty.add(s));
            return s(), i.promise(t)
        }
    });
    var te = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        ne = new RegExp("^(?:([+-])=|)(" + te + ")([a-z%]*)$", "i"),
        re = ["Top", "Right", "Bottom", "Left"],
        ie = E.documentElement,
        oe = function(e) {
            return k.contains(e.ownerDocument, e)
        },
        ae = {
            composed: !0
        };
    ie.getRootNode && (oe = function(e) {
        return k.contains(e.ownerDocument, e) || e.getRootNode(ae) === e.ownerDocument
    });
    var se = function(e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && oe(e) && "none" === k.css(e, "display")
        },
        ue = function(e, t, n, r) {
            var i,
                o,
                a = {};
            for (o in t)
                a[o] = e.style[o], e.style[o] = t[o];
            for (o in i = n.apply(e, r || []), t)
                e.style[o] = a[o];
            return i
        };
    function le(e, t, n, r) {
        var i,
            o,
            a = 20,
            s = r ? function() {
                return r.cur()
            } : function() {
                return k.css(e, t, "")
            },
            u = s(),
            l = n && n[3] || (k.cssNumber[t] ? "" : "px"),
            c = e.nodeType && (k.cssNumber[t] || "px" !== l && +u) && ne.exec(k.css(e, t));
        if (c && c[3] !== l) {
            u /= 2, l = l || c[3], c = +u || 1;
            while (a--)
                k.style(e, t, c + l), (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0), c /= o;
            c *= 2, k.style(e, t, c + l), n = n || []
        }
        return n && (c = +c || +u || 0, i = n[1] ? c + (n[1] + 1) * n[2] : +n[2], r && (r.unit = l, r.start = c, r.end = i)), i
    }
    var ce = {};
    function fe(e, t) {
        for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++)
            (r = e[c]).style && (n = r.style.display, t ? ("none" === n && (l[c] = Q.get(r, "display") || null, l[c] || (r.style.display = "")), "" === r.style.display && se(r) && (l[c] = (u = a = o = void 0, a = (i = r).ownerDocument, s = i.nodeName, (u = ce[s]) || (o = a.body.appendChild(a.createElement(s)), u = k.css(o, "display"), o.parentNode.removeChild(o), "none" === u && (u = "block"), ce[s] = u)))) : "none" !== n && (l[c] = "none", Q.set(r, "display", n)));
        for (c = 0; c < f; c++)
            null != l[c] && (e[c].style.display = l[c]);
        return e
    }
    k.fn.extend({
        show: function() {
            return fe(this, !0)
        },
        hide: function() {
            return fe(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                se(this) ? k(this).show() : k(this).hide()
            })
        }
    });
    var pe = /^(?:checkbox|radio)$/i,
        de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
        he = /^$|^module$|\/(?:java|ecma)script/i,
        ge = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    function ve(e, t) {
        var n;
        return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && A(e, t) ? k.merge([e], n) : n
    }
    function ye(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            Q.set(e[n], "globalEval", !t || Q.get(t[n], "globalEval"))
    }
    ge.optgroup = ge.option, ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead, ge.th = ge.td;
    var me,
        xe,
        be = /<|&#?\w+;/;
    function we(e, t, n, r, i) {
        for (var o, a, s, u, l, c, f = t.createDocumentFragment(), p = [], d = 0, h = e.length; d < h; d++)
            if ((o = e[d]) || 0 === o)
                if ("object" === w(o))
                    k.merge(p, o.nodeType ? [o] : o);
                else if (be.test(o)) {
                    a = a || f.appendChild(t.createElement("div")), s = (de.exec(o) || ["", ""])[1].toLowerCase(), u = ge[s] || ge._default, a.innerHTML = u[1] + k.htmlPrefilter(o) + u[2], c = u[0];
                    while (c--)
                        a = a.lastChild;
                    k.merge(p, a.childNodes), (a = f.firstChild).textContent = ""
                } else
                    p.push(t.createTextNode(o));
        f.textContent = "", d = 0;
        while (o = p[d++])
            if (r && -1 < k.inArray(o, r))
                i && i.push(o);
            else if (l = oe(o), a = ve(f.appendChild(o), "script"), l && ye(a), n) {
                c = 0;
                while (o = a[c++])
                    he.test(o.type || "") && n.push(o)
            }
        return f
    }
    me = E.createDocumentFragment().appendChild(E.createElement("div")), (xe = E.createElement("input")).setAttribute("type", "radio"), xe.setAttribute("checked", "checked"), xe.setAttribute("name", "t"), me.appendChild(xe), y.checkClone = me.cloneNode(!0).cloneNode(!0).lastChild.checked, me.innerHTML = "<textarea>x</textarea>", y.noCloneChecked = !!me.cloneNode(!0).lastChild.defaultValue;
    var Te = /^key/,
        Ce = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        Ee = /^([^.]*)(?:\.(.+)|)/;
    function ke() {
        return !0
    }
    function Se() {
        return !1
    }
    function Ne(e, t) {
        return e === function() {
            try {
                return E.activeElement
            } catch (e) {}
        }() == ("focus" === t)
    }
    function Ae(e, t, n, r, i, o) {
        var a,
            s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (r = r || n, n = void 0), t)
                Ae(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), !1 === i)
            i = Se;
        else if (!i)
            return e;
        return 1 === o && (a = i, (i = function(e) {
            return k().off(e), a.apply(this, arguments)
        }).guid = a.guid || (a.guid = k.guid++)), e.each(function() {
            k.event.add(this, t, i, r, n)
        })
    }
    function De(e, i, o) {
        o ? (Q.set(e, i, !1), k.event.add(e, i, {
            namespace: !1,
            handler: function(e) {
                var t,
                    n,
                    r = Q.get(this, i);
                if (1 & e.isTrigger && this[i]) {
                    if (r.length)
                        (k.event.special[i] || {}).delegateType && e.stopPropagation();
                    else if (r = s.call(arguments), Q.set(this, i, r), t = o(this, i), this[i](), r !== (n = Q.get(this, i)) || t ? Q.set(this, i, !1) : n = {}, r !== n)
                        return e.stopImmediatePropagation(), e.preventDefault(), n.value
                } else
                    r.length && (Q.set(this, i, {
                        value: k.event.trigger(k.extend(r[0], k.Event.prototype), r.slice(1), this)
                    }), e.stopImmediatePropagation())
            }
        })) : void 0 === Q.get(e, i) && k.event.add(e, i, ke)
    }
    k.event = {
        global: {},
        add: function(t, e, n, r, i) {
            var o,
                a,
                s,
                u,
                l,
                c,
                f,
                p,
                d,
                h,
                g,
                v = Q.get(t);
            if (v) {
                n.handler && (n = (o = n).handler, i = o.selector), i && k.find.matchesSelector(ie, i), n.guid || (n.guid = k.guid++), (u = v.events) || (u = v.events = {}), (a = v.handle) || (a = v.handle = function(e) {
                    return "undefined" != typeof k && k.event.triggered !== e.type ? k.event.dispatch.apply(t, arguments) : void 0
                }), l = (e = (e || "").match(R) || [""]).length;
                while (l--)
                    d = g = (s = Ee.exec(e[l]) || [])[1], h = (s[2] || "").split(".").sort(), d && (f = k.event.special[d] || {}, d = (i ? f.delegateType : f.bindType) || d, f = k.event.special[d] || {}, c = k.extend({
                        type: d,
                        origType: g,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && k.expr.match.needsContext.test(i),
                        namespace: h.join(".")
                    }, o), (p = u[d]) || ((p = u[d] = []).delegateCount = 0, f.setup && !1 !== f.setup.call(t, r, h, a) || t.addEventListener && t.addEventListener(d, a)), f.add && (f.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)), i ? p.splice(p.delegateCount++, 0, c) : p.push(c), k.event.global[d] = !0)
            }
        },
        remove: function(e, t, n, r, i) {
            var o,
                a,
                s,
                u,
                l,
                c,
                f,
                p,
                d,
                h,
                g,
                v = Q.hasData(e) && Q.get(e);
            if (v && (u = v.events)) {
                l = (t = (t || "").match(R) || [""]).length;
                while (l--)
                    if (d = g = (s = Ee.exec(t[l]) || [])[1], h = (s[2] || "").split(".").sort(), d) {
                        f = k.event.special[d] || {}, p = u[d = (r ? f.delegateType : f.bindType) || d] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = p.length;
                        while (o--)
                            c = p[o], !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1), c.selector && p.delegateCount--, f.remove && f.remove.call(e, c));
                        a && !p.length && (f.teardown && !1 !== f.teardown.call(e, h, v.handle) || k.removeEvent(e, d, v.handle), delete u[d])
                    } else
                        for (d in u)
                            k.event.remove(e, d + t[l], n, r, !0);
                k.isEmptyObject(u) && Q.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t,
                n,
                r,
                i,
                o,
                a,
                s = k.event.fix(e),
                u = new Array(arguments.length),
                l = (Q.get(this, "events") || {})[s.type] || [],
                c = k.event.special[s.type] || {};
            for (u[0] = s, t = 1; t < arguments.length; t++)
                u[t] = arguments[t];
            if (s.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, s)) {
                a = k.event.handlers.call(this, s, l), t = 0;
                while ((i = a[t++]) && !s.isPropagationStopped()) {
                    s.currentTarget = i.elem, n = 0;
                    while ((o = i.handlers[n++]) && !s.isImmediatePropagationStopped())
                        s.rnamespace && !1 !== o.namespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o, s.data = o.data, void 0 !== (r = ((k.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, u)) && !1 === (s.result = r) && (s.preventDefault(), s.stopPropagation()))
                }
                return c.postDispatch && c.postDispatch.call(this, s), s.result
            }
        },
        handlers: function(e, t) {
            var n,
                r,
                i,
                o,
                a,
                s = [],
                u = t.delegateCount,
                l = e.target;
            if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
                for (; l !== this; l = l.parentNode || this)
                    if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
                        for (o = [], a = {}, n = 0; n < u; n++)
                            void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? -1 < k(i, this).index(l) : k.find(i, this, null, [l]).length), a[i] && o.push(r);
                        o.length && s.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return l = this, u < t.length && s.push({
                elem: l,
                handlers: t.slice(u)
            }), s
        },
        addProp: function(t, e) {
            Object.defineProperty(k.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: m(e) ? function() {
                    if (this.originalEvent)
                        return e(this.originalEvent)
                } : function() {
                    if (this.originalEvent)
                        return this.originalEvent[t]
                },
                set: function(e) {
                    Object.defineProperty(this, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            })
        },
        fix: function(e) {
            return e[k.expando] ? e : new k.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return pe.test(t.type) && t.click && A(t, "input") && De(t, "click", ke), !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return pe.test(t.type) && t.click && A(t, "input") && De(t, "click"), !0
                },
                _default: function(e) {
                    var t = e.target;
                    return pe.test(t.type) && t.click && A(t, "input") && Q.get(t, "click") || A(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    }, k.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }, k.Event = function(e, t) {
        if (!(this instanceof k.Event))
            return new k.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? ke : Se, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && k.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[k.expando] = !0
    }, k.Event.prototype = {
        constructor: k.Event,
        isDefaultPrevented: Se,
        isPropagationStopped: Se,
        isImmediatePropagationStopped: Se,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = ke, e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = ke, e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = ke, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, k.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        "char": !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
            var t = e.button;
            return null == e.which && Te.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Ce.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, k.event.addProp), k.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        k.event.special[e] = {
            setup: function() {
                return De(this, e, Ne), !1
            },
            trigger: function() {
                return De(this, e), !0
            },
            delegateType: t
        }
    }), k.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, i) {
        k.event.special[e] = {
            delegateType: i,
            bindType: i,
            handle: function(e) {
                var t,
                    n = e.relatedTarget,
                    r = e.handleObj;
                return n && (n === this || k.contains(this, n)) || (e.type = r.origType, t = r.handler.apply(this, arguments), e.type = i), t
            }
        }
    }), k.fn.extend({
        on: function(e, t, n, r) {
            return Ae(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return Ae(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r,
                i;
            if (e && e.preventDefault && e.handleObj)
                return r = e.handleObj, k(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
            if ("object" == typeof e) {
                for (i in e)
                    this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = Se), this.each(function() {
                k.event.remove(this, e, n, t)
            })
        }
    });
    var je = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        qe = /<script|<style|<link/i,
        Le = /checked\s*(?:[^=]|=\s*.checked.)/i,
        He = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function Oe(e, t) {
        return A(e, "table") && A(11 !== t.nodeType ? t : t.firstChild, "tr") && k(e).children("tbody")[0] || e
    }
    function Pe(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }
    function Re(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
    }
    function Me(e, t) {
        var n,
            r,
            i,
            o,
            a,
            s,
            u,
            l;
        if (1 === t.nodeType) {
            if (Q.hasData(e) && (o = Q.access(e), a = Q.set(t, o), l = o.events))
                for (i in delete a.handle, a.events = {}, l)
                    for (n = 0, r = l[i].length; n < r; n++)
                        k.event.add(t, i, l[i][n]);
            J.hasData(e) && (s = J.access(e), u = k.extend({}, s), J.set(t, u))
        }
    }
    function Ie(n, r, i, o) {
        r = g.apply([], r);
        var e,
            t,
            a,
            s,
            u,
            l,
            c = 0,
            f = n.length,
            p = f - 1,
            d = r[0],
            h = m(d);
        if (h || 1 < f && "string" == typeof d && !y.checkClone && Le.test(d))
            return n.each(function(e) {
                var t = n.eq(e);
                h && (r[0] = d.call(this, e, t.html())), Ie(t, r, i, o)
            });
        if (f && (t = (e = we(r, n[0].ownerDocument, !1, n, o)).firstChild, 1 === e.childNodes.length && (e = t), t || o)) {
            for (s = (a = k.map(ve(e, "script"), Pe)).length; c < f; c++)
                u = e, c !== p && (u = k.clone(u, !0, !0), s && k.merge(a, ve(u, "script"))), i.call(n[c], u, c);
            if (s)
                for (l = a[a.length - 1].ownerDocument, k.map(a, Re), c = 0; c < s; c++)
                    u = a[c], he.test(u.type || "") && !Q.access(u, "globalEval") && k.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? k._evalUrl && !u.noModule && k._evalUrl(u.src, {
                        nonce: u.nonce || u.getAttribute("nonce")
                    }) : b(u.textContent.replace(He, ""), u, l))
        }
        return n
    }
    function We(e, t, n) {
        for (var r, i = t ? k.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
            n || 1 !== r.nodeType || k.cleanData(ve(r)), r.parentNode && (n && oe(r) && ye(ve(r, "script")), r.parentNode.removeChild(r));
        return e
    }
    k.extend({
        htmlPrefilter: function(e) {
            return e.replace(je, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var r,
                i,
                o,
                a,
                s,
                u,
                l,
                c = e.cloneNode(!0),
                f = oe(e);
            if (!(y.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || k.isXMLDoc(e)))
                for (a = ve(c), r = 0, i = (o = ve(e)).length; r < i; r++)
                    s = o[r], u = a[r], void 0, "input" === (l = u.nodeName.toLowerCase()) && pe.test(s.type) ? u.checked = s.checked : "input" !== l && "textarea" !== l || (u.defaultValue = s.defaultValue);
            if (t)
                if (n)
                    for (o = o || ve(e), a = a || ve(c), r = 0, i = o.length; r < i; r++)
                        Me(o[r], a[r]);
                else
                    Me(e, c);
            return 0 < (a = ve(c, "script")).length && ye(a, !f && ve(e, "script")), c
        },
        cleanData: function(e) {
            for (var t, n, r, i = k.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (G(n)) {
                    if (t = n[Q.expando]) {
                        if (t.events)
                            for (r in t.events)
                                i[r] ? k.event.remove(n, r) : k.removeEvent(n, r, t.handle);
                        n[Q.expando] = void 0
                    }
                    n[J.expando] && (n[J.expando] = void 0)
                }
        }
    }), k.fn.extend({
        detach: function(e) {
            return We(this, e, !0)
        },
        remove: function(e) {
            return We(this, e)
        },
        text: function(e) {
            return _(this, function(e) {
                return void 0 === e ? k.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return Ie(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || Oe(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return Ie(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = Oe(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return Ie(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return Ie(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (k.cleanData(ve(e, !1)), e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function() {
                return k.clone(this, e, t)
            })
        },
        html: function(e) {
            return _(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    r = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !qe.test(e) && !ge[(de.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = k.htmlPrefilter(e);
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (k.cleanData(ve(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var n = [];
            return Ie(this, arguments, function(e) {
                var t = this.parentNode;
                k.inArray(this, n) < 0 && (k.cleanData(ve(this)), t && t.replaceChild(e, this))
            }, n)
        }
    }), k.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, a) {
        k.fn[e] = function(e) {
            for (var t, n = [], r = k(e), i = r.length - 1, o = 0; o <= i; o++)
                t = o === i ? this : this.clone(!0), k(r[o])[a](t), u.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    var $e = new RegExp("^(" + te + ")(?!px)[a-z%]+$", "i"),
        Fe = function(e) {
            var t = e.ownerDocument.defaultView;
            return t && t.opener || (t = C), t.getComputedStyle(e)
        },
        Be = new RegExp(re.join("|"), "i");
    function _e(e, t, n) {
        var r,
            i,
            o,
            a,
            s = e.style;
        return (n = n || Fe(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || oe(e) || (a = k.style(e, t)), !y.pixelBoxStyles() && $e.test(a) && Be.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + "" : a
    }
    function ze(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    !function() {
        function e() {
            if (u) {
                s.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", ie.appendChild(s).appendChild(u);
                var e = C.getComputedStyle(u);
                n = "1%" !== e.top, a = 12 === t(e.marginLeft), u.style.right = "60%", o = 36 === t(e.right), r = 36 === t(e.width), u.style.position = "absolute", i = 12 === t(u.offsetWidth / 3), ie.removeChild(s), u = null
            }
        }
        function t(e) {
            return Math.round(parseFloat(e))
        }
        var n,
            r,
            i,
            o,
            a,
            s = E.createElement("div"),
            u = E.createElement("div");
        u.style && (u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", y.clearCloneStyle = "content-box" === u.style.backgroundClip, k.extend(y, {
            boxSizingReliable: function() {
                return e(), r
            },
            pixelBoxStyles: function() {
                return e(), o
            },
            pixelPosition: function() {
                return e(), n
            },
            reliableMarginLeft: function() {
                return e(), a
            },
            scrollboxSize: function() {
                return e(), i
            }
        }))
    }();
    var Ue = ["Webkit", "Moz", "ms"],
        Xe = E.createElement("div").style,
        Ve = {};
    function Ge(e) {
        var t = k.cssProps[e] || Ve[e];
        return t || (e in Xe ? e : Ve[e] = function(e) {
                var t = e[0].toUpperCase() + e.slice(1),
                    n = Ue.length;
                while (n--)
                    if ((e = Ue[n] + t) in Xe)
                        return e
            }(e) || e)
    }
    var Ye = /^(none|table(?!-c[ea]).+)/,
        Qe = /^--/,
        Je = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Ke = {
            letterSpacing: "0",
            fontWeight: "400"
        };
    function Ze(e, t, n) {
        var r = ne.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function et(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0,
            s = 0,
            u = 0;
        if (n === (r ? "border" : "content"))
            return 0;
        for (; a < 4; a += 2)
            "margin" === n && (u += k.css(e, n + re[a], !0, i)), r ? ("content" === n && (u -= k.css(e, "padding" + re[a], !0, i)), "margin" !== n && (u -= k.css(e, "border" + re[a] + "Width", !0, i))) : (u += k.css(e, "padding" + re[a], !0, i), "padding" !== n ? u += k.css(e, "border" + re[a] + "Width", !0, i) : s += k.css(e, "border" + re[a] + "Width", !0, i));
        return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0), u
    }
    function tt(e, t, n) {
        var r = Fe(e),
            i = (!y.boxSizingReliable() || n) && "border-box" === k.css(e, "boxSizing", !1, r),
            o = i,
            a = _e(e, t, r),
            s = "offset" + t[0].toUpperCase() + t.slice(1);
        if ($e.test(a)) {
            if (!n)
                return a;
            a = "auto"
        }
        return (!y.boxSizingReliable() && i || "auto" === a || !parseFloat(a) && "inline" === k.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === k.css(e, "boxSizing", !1, r), (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + et(e, t, n || (i ? "border" : "content"), o, r, a) + "px"
    }
    function nt(e, t, n, r, i) {
        return new nt.prototype.init(e, t, n, r, i)
    }
    k.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = _e(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i,
                    o,
                    a,
                    s = V(t),
                    u = Qe.test(t),
                    l = e.style;
                if (u || (t = Ge(s)), a = k.cssHooks[t] || k.cssHooks[s], void 0 === n)
                    return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                "string" === (o = typeof n) && (i = ne.exec(n)) && i[1] && (n = le(e, t, i), o = "number"), null != n && n == n && ("number" !== o || u || (n += i && i[3] || (k.cssNumber[s] ? "" : "px")), y.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i,
                o,
                a,
                s = V(t);
            return Qe.test(t) || (t = Ge(s)), (a = k.cssHooks[t] || k.cssHooks[s]) && "get" in a && (i = a.get(e, !0, n)), void 0 === i && (i = _e(e, t, r)), "normal" === i && t in Ke && (i = Ke[t]), "" === n || n ? (o = parseFloat(i), !0 === n || isFinite(o) ? o || 0 : i) : i
        }
    }), k.each(["height", "width"], function(e, u) {
        k.cssHooks[u] = {
            get: function(e, t, n) {
                if (t)
                    return !Ye.test(k.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? tt(e, u, n) : ue(e, Je, function() {
                        return tt(e, u, n)
                    })
            },
            set: function(e, t, n) {
                var r,
                    i = Fe(e),
                    o = !y.scrollboxSize() && "absolute" === i.position,
                    a = (o || n) && "border-box" === k.css(e, "boxSizing", !1, i),
                    s = n ? et(e, u, n, a, i) : 0;
                return a && o && (s -= Math.ceil(e["offset" + u[0].toUpperCase() + u.slice(1)] - parseFloat(i[u]) - et(e, u, "border", !1, i) - .5)), s && (r = ne.exec(t)) && "px" !== (r[3] || "px") && (e.style[u] = t, t = k.css(e, u)), Ze(0, t, s)
            }
        }
    }), k.cssHooks.marginLeft = ze(y.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(_e(e, "marginLeft")) || e.getBoundingClientRect().left - ue(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }), k.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(i, o) {
        k.cssHooks[i + o] = {
            expand: function(e) {
                for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                    n[i + re[t] + o] = r[t] || r[t - 2] || r[0];
                return n
            }
        }, "margin" !== i && (k.cssHooks[i + o].set = Ze)
    }), k.fn.extend({
        css: function(e, t) {
            return _(this, function(e, t, n) {
                var r,
                    i,
                    o = {},
                    a = 0;
                if (Array.isArray(t)) {
                    for (r = Fe(e), i = t.length; a < i; a++)
                        o[t[a]] = k.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? k.style(e, t, n) : k.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }), ((k.Tween = nt).prototype = {
        constructor: nt,
        init: function(e, t, n, r, i, o) {
            this.elem = e, this.prop = n, this.easing = i || k.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (k.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = nt.propHooks[this.prop];
            return e && e.get ? e.get(this) : nt.propHooks._default.get(this)
        },
        run: function(e) {
            var t,
                n = nt.propHooks[this.prop];
            return this.options.duration ? this.pos = t = k.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : nt.propHooks._default.set(this), this
        }
    }).init.prototype = nt.prototype, (nt.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = k.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                k.fx.step[e.prop] ? k.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !k.cssHooks[e.prop] && null == e.elem.style[Ge(e.prop)] ? e.elem[e.prop] = e.now : k.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = nt.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, k.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, k.fx = nt.prototype.init, k.fx.step = {};
    var rt,
        it,
        ot,
        at,
        st = /^(?:toggle|show|hide)$/,
        ut = /queueHooks$/;
    function lt() {
        it && (!1 === E.hidden && C.requestAnimationFrame ? C.requestAnimationFrame(lt) : C.setTimeout(lt, k.fx.interval), k.fx.tick())
    }
    function ct() {
        return C.setTimeout(function() {
            rt = void 0
        }), rt = Date.now()
    }
    function ft(e, t) {
        var n,
            r = 0,
            i = {
                height: e
            };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = re[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i
    }
    function pt(e, t, n) {
        for (var r, i = (dt.tweeners[t] || []).concat(dt.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function dt(o, e, t) {
        var n,
            a,
            r = 0,
            i = dt.prefilters.length,
            s = k.Deferred().always(function() {
                delete u.elem
            }),
            u = function() {
                if (a)
                    return !1;
                for (var e = rt || ct(), t = Math.max(0, l.startTime + l.duration - e), n = 1 - (t / l.duration || 0), r = 0, i = l.tweens.length; r < i; r++)
                    l.tweens[r].run(n);
                return s.notifyWith(o, [l, n, t]), n < 1 && i ? t : (i || s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l]), !1)
            },
            l = s.promise({
                elem: o,
                props: k.extend({}, e),
                opts: k.extend(!0, {
                    specialEasing: {},
                    easing: k.easing._default
                }, t),
                originalProperties: e,
                originalOptions: t,
                startTime: rt || ct(),
                duration: t.duration,
                tweens: [],
                createTween: function(e, t) {
                    var n = k.Tween(o, l.opts, e, t, l.opts.specialEasing[e] || l.opts.easing);
                    return l.tweens.push(n), n
                },
                stop: function(e) {
                    var t = 0,
                        n = e ? l.tweens.length : 0;
                    if (a)
                        return this;
                    for (a = !0; t < n; t++)
                        l.tweens[t].run(1);
                    return e ? (s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l, e])) : s.rejectWith(o, [l, e]), this
                }
            }),
            c = l.props;
        for (!function(e, t) {
            var n,
                r,
                i,
                o,
                a;
            for (n in e)
                if (i = t[r = V(n)], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = k.cssHooks[r]) && "expand" in a)
                    for (n in o = a.expand(o), delete e[r], o)
                        n in e || (e[n] = o[n], t[n] = i);
                else
                    t[r] = i
        }(c, l.opts.specialEasing); r < i; r++)
            if (n = dt.prefilters[r].call(l, o, c, l.opts))
                return m(n.stop) && (k._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)), n;
        return k.map(c, pt, l), m(l.opts.start) && l.opts.start.call(o, l), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always), k.fx.timer(k.extend(u, {
            elem: o,
            anim: l,
            queue: l.opts.queue
        })), l
    }
    k.Animation = k.extend(dt, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return le(n.elem, e, ne.exec(t), n), n
            }]
        },
        tweener: function(e, t) {
            m(e) ? (t = e, e = ["*"]) : e = e.match(R);
            for (var n, r = 0, i = e.length; r < i; r++)
                n = e[r], dt.tweeners[n] = dt.tweeners[n] || [], dt.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var r,
                i,
                o,
                a,
                s,
                u,
                l,
                c,
                f = "width" in t || "height" in t,
                p = this,
                d = {},
                h = e.style,
                g = e.nodeType && se(e),
                v = Q.get(e, "fxshow");
            for (r in n.queue || (null == (a = k._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function() {
                a.unqueued || s()
            }), a.unqueued++, p.always(function() {
                p.always(function() {
                    a.unqueued--, k.queue(e, "fx").length || a.empty.fire()
                })
            })), t)
                if (i = t[r], st.test(i)) {
                    if (delete t[r], o = o || "toggle" === i, i === (g ? "hide" : "show")) {
                        if ("show" !== i || !v || void 0 === v[r])
                            continue;
                        g = !0
                    }
                    d[r] = v && v[r] || k.style(e, r)
                }
            if ((u = !k.isEmptyObject(t)) || !k.isEmptyObject(d))
                for (r in f && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (l = v && v.display) && (l = Q.get(e, "display")), "none" === (c = k.css(e, "display")) && (l ? c = l : (fe([e], !0), l = e.style.display || l, c = k.css(e, "display"), fe([e]))), ("inline" === c || "inline-block" === c && null != l) && "none" === k.css(e, "float") && (u || (p.done(function() {
                    h.display = l
                }), null == l && (c = h.display, l = "none" === c ? "" : c)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", p.always(function() {
                    h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
                })), u = !1, d)
                    u || (v ? "hidden" in v && (g = v.hidden) : v = Q.access(e, "fxshow", {
                        display: l
                    }), o && (v.hidden = !g), g && fe([e], !0), p.done(function() {
                        for (r in g || fe([e]), Q.remove(e, "fxshow"), d)
                            k.style(e, r, d[r])
                    })), u = pt(g ? v[r] : 0, r, p), r in v || (v[r] = u.start, g && (u.end = u.start, u.start = 0))
        }],
        prefilter: function(e, t) {
            t ? dt.prefilters.unshift(e) : dt.prefilters.push(e)
        }
    }), k.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? k.extend({}, e) : {
            complete: n || !n && t || m(e) && e,
            duration: e,
            easing: n && t || t && !m(t) && t
        };
        return k.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in k.fx.speeds ? r.duration = k.fx.speeds[r.duration] : r.duration = k.fx.speeds._default), null != r.queue && !0 !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function() {
            m(r.old) && r.old.call(this), r.queue && k.dequeue(this, r.queue)
        }, r
    }, k.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(se).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(t, e, n, r) {
            var i = k.isEmptyObject(t),
                o = k.speed(e, n, r),
                a = function() {
                    var e = dt(this, k.extend({}, t), o);
                    (i || Q.get(this, "finish")) && e.stop(!0)
                };
            return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(i, e, o) {
            var a = function(e) {
                var t = e.stop;
                delete e.stop, t(o)
            };
            return "string" != typeof i && (o = e, e = i, i = void 0), e && !1 !== i && this.queue(i || "fx", []), this.each(function() {
                var e = !0,
                    t = null != i && i + "queueHooks",
                    n = k.timers,
                    r = Q.get(this);
                if (t)
                    r[t] && r[t].stop && a(r[t]);
                else
                    for (t in r)
                        r[t] && r[t].stop && ut.test(t) && a(r[t]);
                for (t = n.length; t--;)
                    n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o), e = !1, n.splice(t, 1));
                !e && o || k.dequeue(this, i)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"), this.each(function() {
                var e,
                    t = Q.get(this),
                    n = t[a + "queue"],
                    r = t[a + "queueHooks"],
                    i = k.timers,
                    o = n ? n.length : 0;
                for (t.finish = !0, k.queue(this, a, []), r && r.stop && r.stop.call(this, !0), e = i.length; e--;)
                    i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0), i.splice(e, 1));
                for (e = 0; e < o; e++)
                    n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }), k.each(["toggle", "show", "hide"], function(e, r) {
        var i = k.fn[r];
        k.fn[r] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(ft(r, !0), e, t, n)
        }
    }), k.each({
        slideDown: ft("show"),
        slideUp: ft("hide"),
        slideToggle: ft("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, r) {
        k.fn[e] = function(e, t, n) {
            return this.animate(r, e, t, n)
        }
    }), k.timers = [], k.fx.tick = function() {
        var e,
            t = 0,
            n = k.timers;
        for (rt = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || k.fx.stop(), rt = void 0
    }, k.fx.timer = function(e) {
        k.timers.push(e), k.fx.start()
    }, k.fx.interval = 13, k.fx.start = function() {
        it || (it = !0, lt())
    }, k.fx.stop = function() {
        it = null
    }, k.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, k.fn.delay = function(r, e) {
        return r = k.fx && k.fx.speeds[r] || r, e = e || "fx", this.queue(e, function(e, t) {
            var n = C.setTimeout(e, r);
            t.stop = function() {
                C.clearTimeout(n)
            }
        })
    }, ot = E.createElement("input"), at = E.createElement("select").appendChild(E.createElement("option")), ot.type = "checkbox", y.checkOn = "" !== ot.value, y.optSelected = at.selected, (ot = E.createElement("input")).value = "t", ot.type = "radio", y.radioValue = "t" === ot.value;
    var ht,
        gt = k.expr.attrHandle;
    k.fn.extend({
        attr: function(e, t) {
            return _(this, k.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                k.removeAttr(this, e)
            })
        }
    }), k.extend({
        attr: function(e, t, n) {
            var r,
                i,
                o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return "undefined" == typeof e.getAttribute ? k.prop(e, t, n) : (1 === o && k.isXMLDoc(e) || (i = k.attrHooks[t.toLowerCase()] || (k.expr.match.bool.test(t) ? ht : void 0)), void 0 !== n ? null === n ? void k.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (r = i.get(e, t)) ? r : null == (r = k.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!y.radioValue && "radio" === t && A(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n,
                r = 0,
                i = t && t.match(R);
            if (i && 1 === e.nodeType)
                while (n = i[r++])
                    e.removeAttribute(n)
        }
    }), ht = {
        set: function(e, t, n) {
            return !1 === t ? k.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, k.each(k.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var a = gt[t] || k.find.attr;
        gt[t] = function(e, t, n) {
            var r,
                i,
                o = t.toLowerCase();
            return n || (i = gt[o], gt[o] = r, r = null != a(e, t, n) ? o : null, gt[o] = i), r
        }
    });
    var vt = /^(?:input|select|textarea|button)$/i,
        yt = /^(?:a|area)$/i;
    function mt(e) {
        return (e.match(R) || []).join(" ")
    }
    function xt(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function bt(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(R) || []
    }
    k.fn.extend({
        prop: function(e, t) {
            return _(this, k.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[k.propFix[e] || e]
            })
        }
    }), k.extend({
        prop: function(e, t, n) {
            var r,
                i,
                o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return 1 === o && k.isXMLDoc(e) || (t = k.propFix[t] || t, i = k.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = k.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : vt.test(e.nodeName) || yt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), y.optSelected || (k.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), k.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        k.propFix[this.toLowerCase()] = this
    }), k.fn.extend({
        addClass: function(t) {
            var e,
                n,
                r,
                i,
                o,
                a,
                s,
                u = 0;
            if (m(t))
                return this.each(function(e) {
                    k(this).addClass(t.call(this, e, xt(this)))
                });
            if ((e = bt(t)).length)
                while (n = this[u++])
                    if (i = xt(n), r = 1 === n.nodeType && " " + mt(i) + " ") {
                        a = 0;
                        while (o = e[a++])
                            r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (s = mt(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        removeClass: function(t) {
            var e,
                n,
                r,
                i,
                o,
                a,
                s,
                u = 0;
            if (m(t))
                return this.each(function(e) {
                    k(this).removeClass(t.call(this, e, xt(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ((e = bt(t)).length)
                while (n = this[u++])
                    if (i = xt(n), r = 1 === n.nodeType && " " + mt(i) + " ") {
                        a = 0;
                        while (o = e[a++])
                            while (-1 < r.indexOf(" " + o + " "))
                                r = r.replace(" " + o + " ", " ");
                        i !== (s = mt(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        toggleClass: function(i, t) {
            var o = typeof i,
                a = "string" === o || Array.isArray(i);
            return "boolean" == typeof t && a ? t ? this.addClass(i) : this.removeClass(i) : m(i) ? this.each(function(e) {
                k(this).toggleClass(i.call(this, e, xt(this), t), t)
            }) : this.each(function() {
                var e,
                    t,
                    n,
                    r;
                if (a) {
                    t = 0, n = k(this), r = bt(i);
                    while (e = r[t++])
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e)
                } else
                    void 0 !== i && "boolean" !== o || ((e = xt(this)) && Q.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", e || !1 === i ? "" : Q.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t,
                n,
                r = 0;
            t = " " + e + " ";
            while (n = this[r++])
                if (1 === n.nodeType && -1 < (" " + mt(xt(n)) + " ").indexOf(t))
                    return !0;
            return !1
        }
    });
    var wt = /\r/g;
    k.fn.extend({
        val: function(n) {
            var r,
                e,
                i,
                t = this[0];
            return arguments.length ? (i = m(n), this.each(function(e) {
                var t;
                1 === this.nodeType && (null == (t = i ? n.call(this, e, k(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : Array.isArray(t) && (t = k.map(t, function(e) {
                    return null == e ? "" : e + ""
                })), (r = k.valHooks[this.type] || k.valHooks[this.nodeName.toLowerCase()]) && "set" in r && void 0 !== r.set(this, t, "value") || (this.value = t))
            })) : t ? (r = k.valHooks[t.type] || k.valHooks[t.nodeName.toLowerCase()]) && "get" in r && void 0 !== (e = r.get(t, "value")) ? e : "string" == typeof (e = t.value) ? e.replace(wt, "") : null == e ? "" : e : void 0
        }
    }), k.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = k.find.attr(e, "value");
                    return null != t ? t : mt(k.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t,
                        n,
                        r,
                        i = e.options,
                        o = e.selectedIndex,
                        a = "select-one" === e.type,
                        s = a ? null : [],
                        u = a ? o + 1 : i.length;
                    for (r = o < 0 ? u : a ? o : 0; r < u; r++)
                        if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))) {
                            if (t = k(n).val(), a)
                                return t;
                            s.push(t)
                        }
                    return s
                },
                set: function(e, t) {
                    var n,
                        r,
                        i = e.options,
                        o = k.makeArray(t),
                        a = i.length;
                    while (a--)
                        ((r = i[a]).selected = -1 < k.inArray(k.valHooks.option.get(r), o)) && (n = !0);
                    return n || (e.selectedIndex = -1), o
                }
            }
        }
    }), k.each(["radio", "checkbox"], function() {
        k.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = -1 < k.inArray(k(e).val(), t)
            }
        }, y.checkOn || (k.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }), y.focusin = "onfocusin" in C;
    var Tt = /^(?:focusinfocus|focusoutblur)$/,
        Ct = function(e) {
            e.stopPropagation()
        };
    k.extend(k.event, {
        trigger: function(e, t, n, r) {
            var i,
                o,
                a,
                s,
                u,
                l,
                c,
                f,
                p = [n || E],
                d = v.call(e, "type") ? e.type : e,
                h = v.call(e, "namespace") ? e.namespace.split(".") : [];
            if (o = f = a = n = n || E, 3 !== n.nodeType && 8 !== n.nodeType && !Tt.test(d + k.event.triggered) && (-1 < d.indexOf(".") && (d = (h = d.split(".")).shift(), h.sort()), u = d.indexOf(":") < 0 && "on" + d, (e = e[k.expando] ? e : new k.Event(d, "object" == typeof e && e)).isTrigger = r ? 2 : 3, e.namespace = h.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), t = null == t ? [e] : k.makeArray(t, [e]), c = k.event.special[d] || {}, r || !c.trigger || !1 !== c.trigger.apply(n, t))) {
                if (!r && !c.noBubble && !x(n)) {
                    for (s = c.delegateType || d, Tt.test(s + d) || (o = o.parentNode); o; o = o.parentNode)
                        p.push(o), a = o;
                    a === (n.ownerDocument || E) && p.push(a.defaultView || a.parentWindow || C)
                }
                i = 0;
                while ((o = p[i++]) && !e.isPropagationStopped())
                    f = o, e.type = 1 < i ? s : c.bindType || d, (l = (Q.get(o, "events") || {})[e.type] && Q.get(o, "handle")) && l.apply(o, t), (l = u && o[u]) && l.apply && G(o) && (e.result = l.apply(o, t), !1 === e.result && e.preventDefault());
                return e.type = d, r || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(p.pop(), t) || !G(n) || u && m(n[d]) && !x(n) && ((a = n[u]) && (n[u] = null), k.event.triggered = d, e.isPropagationStopped() && f.addEventListener(d, Ct), n[d](), e.isPropagationStopped() && f.removeEventListener(d, Ct), k.event.triggered = void 0, a && (n[u] = a)), e.result
            }
        },
        simulate: function(e, t, n) {
            var r = k.extend(new k.Event, n, {
                type: e,
                isSimulated: !0
            });
            k.event.trigger(r, null, t)
        }
    }), k.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                k.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return k.event.trigger(e, t, n, !0)
        }
    }), y.focusin || k.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, r) {
        var i = function(e) {
            k.event.simulate(r, e.target, k.event.fix(e))
        };
        k.event.special[r] = {
            setup: function() {
                var e = this.ownerDocument || this,
                    t = Q.access(e, r);
                t || e.addEventListener(n, i, !0), Q.access(e, r, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this,
                    t = Q.access(e, r) - 1;
                t ? Q.access(e, r, t) : (e.removeEventListener(n, i, !0), Q.remove(e, r))
            }
        }
    });
    var Et = C.location,
        kt = Date.now(),
        St = /\?/;
    k.parseXML = function(e) {
        var t;
        if (!e || "string" != typeof e)
            return null;
        try {
            t = (new C.DOMParser).parseFromString(e, "text/xml")
        } catch (e) {
            t = void 0
        }
        return t && !t.getElementsByTagName("parsererror").length || k.error("Invalid XML: " + e), t
    };
    var Nt = /\[\]$/,
        At = /\r?\n/g,
        Dt = /^(?:submit|button|image|reset|file)$/i,
        jt = /^(?:input|select|textarea|keygen)/i;
    function qt(n, e, r, i) {
        var t;
        if (Array.isArray(e))
            k.each(e, function(e, t) {
                r || Nt.test(n) ? i(n, t) : qt(n + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, r, i)
            });
        else if (r || "object" !== w(e))
            i(n, e);
        else
            for (t in e)
                qt(n + "[" + t + "]", e[t], r, i)
    }
    k.param = function(e, t) {
        var n,
            r = [],
            i = function(e, t) {
                var n = m(t) ? t() : t;
                r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
            };
        if (null == e)
            return "";
        if (Array.isArray(e) || e.jquery && !k.isPlainObject(e))
            k.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (n in e)
                qt(n, e[n], t, i);
        return r.join("&")
    }, k.fn.extend({
        serialize: function() {
            return k.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = k.prop(this, "elements");
                return e ? k.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !k(this).is(":disabled") && jt.test(this.nodeName) && !Dt.test(e) && (this.checked || !pe.test(e))
            }).map(function(e, t) {
                var n = k(this).val();
                return null == n ? null : Array.isArray(n) ? k.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(At, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(At, "\r\n")
                }
            }).get()
        }
    });
    var Lt = /%20/g,
        Ht = /#.*$/,
        Ot = /([?&])_=[^&]*/,
        Pt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Rt = /^(?:GET|HEAD)$/,
        Mt = /^\/\//,
        It = {},
        Wt = {},
        $t = "*/".concat("*"),
        Ft = E.createElement("a");
    function Bt(o) {
        return function(e, t) {
            "string" != typeof e && (t = e, e = "*");
            var n,
                r = 0,
                i = e.toLowerCase().match(R) || [];
            if (m(t))
                while (n = i[r++])
                    "+" === n[0] ? (n = n.slice(1) || "*", (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t)
        }
    }
    function _t(t, i, o, a) {
        var s = {},
            u = t === Wt;
        function l(e) {
            var r;
            return s[e] = !0, k.each(t[e] || [], function(e, t) {
                var n = t(i, o, a);
                return "string" != typeof n || u || s[n] ? u ? !(r = n) : void 0 : (i.dataTypes.unshift(n), l(n), !1)
            }), r
        }
        return l(i.dataTypes[0]) || !s["*"] && l("*")
    }
    function zt(e, t) {
        var n,
            r,
            i = k.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && k.extend(!0, e, r), e
    }
    Ft.href = Et.href, k.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Et.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Et.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": $t,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": k.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? zt(zt(e, k.ajaxSettings), t) : zt(k.ajaxSettings, e)
        },
        ajaxPrefilter: Bt(It),
        ajaxTransport: Bt(Wt),
        ajax: function(e, t) {
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var c,
                f,
                p,
                n,
                d,
                r,
                h,
                g,
                i,
                o,
                v = k.ajaxSetup({}, t),
                y = v.context || v,
                m = v.context && (y.nodeType || y.jquery) ? k(y) : k.event,
                x = k.Deferred(),
                b = k.Callbacks("once memory"),
                w = v.statusCode || {},
                a = {},
                s = {},
                u = "canceled",
                T = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (h) {
                            if (!n) {
                                n = {};
                                while (t = Pt.exec(p))
                                    n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2])
                            }
                            t = n[e.toLowerCase() + " "]
                        }
                        return null == t ? null : t.join(", ")
                    },
                    getAllResponseHeaders: function() {
                        return h ? p : null
                    },
                    setRequestHeader: function(e, t) {
                        return null == h && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e, a[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return null == h && (v.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (h)
                                T.always(e[T.status]);
                            else
                                for (t in e)
                                    w[t] = [w[t], e[t]];
                        return this
                    },
                    abort: function(e) {
                        var t = e || u;
                        return c && c.abort(t), l(0, t), this
                    }
                };
            if (x.promise(T), v.url = ((e || v.url || Et.href) + "").replace(Mt, Et.protocol + "//"), v.type = t.method || t.type || v.method || v.type, v.dataTypes = (v.dataType || "*").toLowerCase().match(R) || [""], null == v.crossDomain) {
                r = E.createElement("a");
                try {
                    r.href = v.url, r.href = r.href, v.crossDomain = Ft.protocol + "//" + Ft.host != r.protocol + "//" + r.host
                } catch (e) {
                    v.crossDomain = !0
                }
            }
            if (v.data && v.processData && "string" != typeof v.data && (v.data = k.param(v.data, v.traditional)), _t(It, v, t, T), h)
                return T;
            for (i in (g = k.event && v.global) && 0 == k.active++ && k.event.trigger("ajaxStart"), v.type = v.type.toUpperCase(), v.hasContent = !Rt.test(v.type), f = v.url.replace(Ht, ""), v.hasContent ? v.data && v.processData && 0 === (v.contentType || "").indexOf("application/x-www-form-urlencoded") && (v.data = v.data.replace(Lt, "+")) : (o = v.url.slice(f.length), v.data && (v.processData || "string" == typeof v.data) && (f += (St.test(f) ? "&" : "?") + v.data, delete v.data), !1 === v.cache && (f = f.replace(Ot, "$1"), o = (St.test(f) ? "&" : "?") + "_=" + kt++ + o), v.url = f + o), v.ifModified && (k.lastModified[f] && T.setRequestHeader("If-Modified-Since", k.lastModified[f]), k.etag[f] && T.setRequestHeader("If-None-Match", k.etag[f])), (v.data && v.hasContent && !1 !== v.contentType || t.contentType) && T.setRequestHeader("Content-Type", v.contentType), T.setRequestHeader("Accept", v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + ("*" !== v.dataTypes[0] ? ", " + $t + "; q=0.01" : "") : v.accepts["*"]), v.headers)
                T.setRequestHeader(i, v.headers[i]);
            if (v.beforeSend && (!1 === v.beforeSend.call(y, T, v) || h))
                return T.abort();
            if (u = "abort", b.add(v.complete), T.done(v.success), T.fail(v.error), c = _t(Wt, v, t, T)) {
                if (T.readyState = 1, g && m.trigger("ajaxSend", [T, v]), h)
                    return T;
                v.async && 0 < v.timeout && (d = C.setTimeout(function() {
                    T.abort("timeout")
                }, v.timeout));
                try {
                    h = !1, c.send(a, l)
                } catch (e) {
                    if (h)
                        throw e;
                    l(-1, e)
                }
            } else
                l(-1, "No Transport");
            function l(e, t, n, r) {
                var i,
                    o,
                    a,
                    s,
                    u,
                    l = t;
                h || (h = !0, d && C.clearTimeout(d), c = void 0, p = r || "", T.readyState = 0 < e ? 4 : 0, i = 200 <= e && e < 300 || 304 === e, n && (s = function(e, t, n) {
                    var r,
                        i,
                        o,
                        a,
                        s = e.contents,
                        u = e.dataTypes;
                    while ("*" === u[0])
                        u.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (i in s)
                            if (s[i] && s[i].test(r)) {
                                u.unshift(i);
                                break
                            }
                    if (u[0] in n)
                        o = u[0];
                    else {
                        for (i in n) {
                            if (!u[0] || e.converters[i + " " + u[0]]) {
                                o = i;
                                break
                            }
                            a || (a = i)
                        }
                        o = o || a
                    }
                    if (o)
                        return o !== u[0] && u.unshift(o), n[o]
                }(v, T, n)), s = function(e, t, n, r) {
                    var i,
                        o,
                        a,
                        s,
                        u,
                        l = {},
                        c = e.dataTypes.slice();
                    if (c[1])
                        for (a in e.converters)
                            l[a.toLowerCase()] = e.converters[a];
                    o = c.shift();
                    while (o)
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = c.shift())
                            if ("*" === o)
                                o = u;
                            else if ("*" !== u && u !== o) {
                                if (!(a = l[u + " " + o] || l["* " + o]))
                                    for (i in l)
                                        if ((s = i.split(" "))[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
                                            !0 === a ? a = l[i] : !0 !== l[i] && (o = s[0], c.unshift(s[1]));
                                            break
                                        }
                                if (!0 !== a)
                                    if (a && e["throws"])
                                        t = a(t);
                                    else
                                        try {
                                            t = a(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: a ? e : "No conversion from " + u + " to " + o
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }(v, s, T, i), i ? (v.ifModified && ((u = T.getResponseHeader("Last-Modified")) && (k.lastModified[f] = u), (u = T.getResponseHeader("etag")) && (k.etag[f] = u)), 204 === e || "HEAD" === v.type ? l = "nocontent" : 304 === e ? l = "notmodified" : (l = s.state, o = s.data, i = !(a = s.error))) : (a = l, !e && l || (l = "error", e < 0 && (e = 0))), T.status = e, T.statusText = (t || l) + "", i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]), T.statusCode(w), w = void 0, g && m.trigger(i ? "ajaxSuccess" : "ajaxError", [T, v, i ? o : a]), b.fireWith(y, [T, l]), g && (m.trigger("ajaxComplete", [T, v]), --k.active || k.event.trigger("ajaxStop")))
            }
            return T
        },
        getJSON: function(e, t, n) {
            return k.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return k.get(e, void 0, t, "script")
        }
    }), k.each(["get", "post"], function(e, i) {
        k[i] = function(e, t, n, r) {
            return m(t) && (r = r || n, n = t, t = void 0), k.ajax(k.extend({
                url: e,
                type: i,
                dataType: r,
                data: t,
                success: n
            }, k.isPlainObject(e) && e))
        }
    }), k._evalUrl = function(e, t) {
        return k.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                k.globalEval(e, t)
            }
        })
    }, k.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (m(e) && (e = e.call(this[0])), t = k(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                var e = this;
                while (e.firstElementChild)
                    e = e.firstElementChild;
                return e
            }).append(this)), this
        },
        wrapInner: function(n) {
            return m(n) ? this.each(function(e) {
                k(this).wrapInner(n.call(this, e))
            }) : this.each(function() {
                var e = k(this),
                    t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = m(t);
            return this.each(function(e) {
                k(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                k(this).replaceWith(this.childNodes)
            }), this
        }
    }), k.expr.pseudos.hidden = function(e) {
        return !k.expr.pseudos.visible(e)
    }, k.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }, k.ajaxSettings.xhr = function() {
        try {
            return new C.XMLHttpRequest
        } catch (e) {}
    };
    var Ut = {
            0: 200,
            1223: 204
        },
        Xt = k.ajaxSettings.xhr();
    y.cors = !!Xt && "withCredentials" in Xt, y.ajax = Xt = !!Xt, k.ajaxTransport(function(i) {
        var o,
            a;
        if (y.cors || Xt && !i.crossDomain)
            return {
                send: function(e, t) {
                    var n,
                        r = i.xhr();
                    if (r.open(i.type, i.url, i.async, i.username, i.password), i.xhrFields)
                        for (n in i.xhrFields)
                            r[n] = i.xhrFields[n];
                    for (n in i.mimeType && r.overrideMimeType && r.overrideMimeType(i.mimeType), i.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"), e)
                        r.setRequestHeader(n, e[n]);
                    o = function(e) {
                        return function() {
                            o && (o = a = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null, "abort" === e ? r.abort() : "error" === e ? "number" != typeof r.status ? t(0, "error") : t(r.status, r.statusText) : t(Ut[r.status] || r.status, r.statusText, "text" !== (r.responseType || "text") || "string" != typeof r.responseText ? {
                                binary: r.response
                            } : {
                                text: r.responseText
                            }, r.getAllResponseHeaders()))
                        }
                    }, r.onload = o(), a = r.onerror = r.ontimeout = o("error"), void 0 !== r.onabort ? r.onabort = a : r.onreadystatechange = function() {
                        4 === r.readyState && C.setTimeout(function() {
                            o && a()
                        })
                    }, o = o("abort");
                    try {
                        r.send(i.hasContent && i.data || null)
                    } catch (e) {
                        if (o)
                            throw e
                    }
                },
                abort: function() {
                    o && o()
                }
            }
    }), k.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }), k.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return k.globalEval(e), e
            }
        }
    }), k.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), k.ajaxTransport("script", function(n) {
        var r,
            i;
        if (n.crossDomain || n.scriptAttrs)
            return {
                send: function(e, t) {
                    r = k("<script>").attr(n.scriptAttrs || {}).prop({
                        charset: n.scriptCharset,
                        src: n.url
                    }).on("load error", i = function(e) {
                        r.remove(), i = null, e && t("error" === e.type ? 404 : 200, e.type)
                    }), E.head.appendChild(r[0])
                },
                abort: function() {
                    i && i()
                }
            }
    });
    var Vt,
        Gt = [],
        Yt = /(=)\?(?=&|$)|\?\?/;
    k.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Gt.pop() || k.expando + "_" + kt++;
            return this[e] = !0, e
        }
    }), k.ajaxPrefilter("json jsonp", function(e, t, n) {
        var r,
            i,
            o,
            a = !1 !== e.jsonp && (Yt.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Yt.test(e.data) && "data");
        if (a || "jsonp" === e.dataTypes[0])
            return r = e.jsonpCallback = m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(Yt, "$1" + r) : !1 !== e.jsonp && (e.url += (St.test(e.url) ? "&" : "?") + e.jsonp + "=" + r), e.converters["script json"] = function() {
                return o || k.error(r + " was not called"), o[0]
            }, e.dataTypes[0] = "json", i = C[r], C[r] = function() {
                o = arguments
            }, n.always(function() {
                void 0 === i ? k(C).removeProp(r) : C[r] = i, e[r] && (e.jsonpCallback = t.jsonpCallback, Gt.push(r)), o && m(i) && i(o[0]), o = i = void 0
            }), "script"
    }), y.createHTMLDocument = ((Vt = E.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === Vt.childNodes.length), k.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (y.createHTMLDocument ? ((r = (t = E.implementation.createHTMLDocument("")).createElement("base")).href = E.location.href, t.head.appendChild(r)) : t = E), o = !n && [], (i = D.exec(e)) ? [t.createElement(i[1])] : (i = we([e], t, o), o && o.length && k(o).remove(), k.merge([], i.childNodes)));
        var r,
            i,
            o
    }, k.fn.load = function(e, t, n) {
        var r,
            i,
            o,
            a = this,
            s = e.indexOf(" ");
        return -1 < s && (r = mt(e.slice(s)), e = e.slice(0, s)), m(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), 0 < a.length && k.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments, a.html(r ? k("<div>").append(k.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }), this
    }, k.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        k.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), k.expr.pseudos.animated = function(t) {
        return k.grep(k.timers, function(e) {
            return t === e.elem
        }).length
    }, k.offset = {
        setOffset: function(e, t, n) {
            var r,
                i,
                o,
                a,
                s,
                u,
                l = k.css(e, "position"),
                c = k(e),
                f = {};
            "static" === l && (e.style.position = "relative"), s = c.offset(), o = k.css(e, "top"), u = k.css(e, "left"), ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto") ? (a = (r = c.position()).top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(u) || 0), m(t) && (t = t.call(e, n, k.extend({}, s))), null != t.top && (f.top = t.top - s.top + a), null != t.left && (f.left = t.left - s.left + i), "using" in t ? t.using.call(e, f) : c.css(f)
        }
    }, k.fn.extend({
        offset: function(t) {
            if (arguments.length)
                return void 0 === t ? this : this.each(function(e) {
                    k.offset.setOffset(this, t, e)
                });
            var e,
                n,
                r = this[0];
            return r ? r.getClientRects().length ? (e = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, {
                top: e.top + n.pageYOffset,
                left: e.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e,
                    t,
                    n,
                    r = this[0],
                    i = {
                        top: 0,
                        left: 0
                    };
                if ("fixed" === k.css(r, "position"))
                    t = r.getBoundingClientRect();
                else {
                    t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement;
                    while (e && (e === n.body || e === n.documentElement) && "static" === k.css(e, "position"))
                        e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = k(e).offset()).top += k.css(e, "borderTopWidth", !0), i.left += k.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - k.css(r, "marginTop", !0),
                    left: t.left - i.left - k.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent;
                while (e && "static" === k.css(e, "position"))
                    e = e.offsetParent;
                return e || ie
            })
        }
    }), k.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, i) {
        var o = "pageYOffset" === i;
        k.fn[t] = function(e) {
            return _(this, function(e, t, n) {
                var r;
                if (x(e) ? r = e : 9 === e.nodeType && (r = e.defaultView), void 0 === n)
                    return r ? r[i] : e[t];
                r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n
            }, t, e, arguments.length)
        }
    }), k.each(["top", "left"], function(e, n) {
        k.cssHooks[n] = ze(y.pixelPosition, function(e, t) {
            if (t)
                return t = _e(e, n), $e.test(t) ? k(e).position()[n] + "px" : t
        })
    }), k.each({
        Height: "height",
        Width: "width"
    }, function(a, s) {
        k.each({
            padding: "inner" + a,
            content: s,
            "": "outer" + a
        }, function(r, o) {
            k.fn[o] = function(e, t) {
                var n = arguments.length && (r || "boolean" != typeof e),
                    i = r || (!0 === e || !0 === t ? "margin" : "border");
                return _(this, function(e, t, n) {
                    var r;
                    return x(e) ? 0 === o.indexOf("outer") ? e["inner" + a] : e.document.documentElement["client" + a] : 9 === e.nodeType ? (r = e.documentElement, Math.max(e.body["scroll" + a], r["scroll" + a], e.body["offset" + a], r["offset" + a], r["client" + a])) : void 0 === n ? k.css(e, t, i) : k.style(e, t, n, i)
                }, s, n ? e : void 0, n)
            }
        })
    }), k.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, n) {
        k.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    }), k.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }), k.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), k.proxy = function(e, t) {
        var n,
            r,
            i;
        if ("string" == typeof t && (n = e[t], t = e, e = n), m(e))
            return r = s.call(arguments, 2), (i = function() {
                return e.apply(t || this, r.concat(s.call(arguments)))
            }).guid = e.guid = e.guid || k.guid++, i
    }, k.holdReady = function(e) {
        e ? k.readyWait++ : k.ready(!0)
    }, k.isArray = Array.isArray, k.parseJSON = JSON.parse, k.nodeName = A, k.isFunction = m, k.isWindow = x, k.camelCase = V, k.type = w, k.now = Date.now, k.isNumeric = function(e) {
        var t = k.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }, "function" == typeof define && define.amd && define("jquery", [], function() {
        return k
    });
    var Qt = C.jQuery,
        Jt = C.$;
    return k.noConflict = function(e) {
        return C.$ === k && (C.$ = Jt), e && C.jQuery === k && (C.jQuery = Qt), k
    }, e || (C.jQuery = C.$ = k), k
});

var smzdm_domain = ".smzdm.com";
var smzdm_www = "http://www.smzdm.com";
var smzdm_haitao = "http://haitao.smzdm.com";
var smzdm_faxian = "http://faxian.smzdm.com";
var smzdm_jingyan = "http://jingyan.smzdm.com";
var smzdm_news = "http://news.smzdm.com";
var smzdm_show = "http://shaiwu.smzdm.com";
var smzdm_test = "http://test.smzdm.com";
var integral_plan = "http://www.smzdm.com/p/420";
var open_captcha = false;
var apply_can_click = true;
var youhui_collection = smzdm_www + "/user/collection";
var faxian_collection = smzdm_www + "/user/love";
var show_collection = smzdm_www + "/user/show_love";
var jingyan_collection = smzdm_www + "/user/jy_love";
var haitao_collection = smzdm_www + "/user/haitao_love";
var news_collection = smzdm_www + "/user/news_love";
var test_collection = smzdm_www + "/user/test_love";
var cookie_length_limit = 20;
var default_data = "为维护良好的讨论环境，请勿在留言中发布政治话题、买卖返券、加价转让、人身攻击等内容。";
var comment_report_cookiename = "comment_report";
window.comment_report_cookie_list;
var comment_rating_cookiename = "comment_rating";
window.comment_rating_cookie_list;
var no_avatar = "http://res.smzdm.com/images/header/default_small.png";
var StringBuilder = function(b) {
    this.s = new Array(b);
    this.onMultiAppendBeforeHandle = null;
    this.onMultiAppendBefore = function(c) {
        this.onMultiAppendBeforeHandle = c;
        return this;
    };
    this.append = function(c) {
        this.s.push(c);
        return this;
    };
    this.toString = function() {
        return this.s.join("");
    };
    this.clear = function() {
        this.s = new Array();
    };
    this.appendMultiFormat = function(d, e) {
        if (typeof (e) == "object") {
            for (var c in e) {
                if (this.onMultiAppendBeforeHandle != null) {
                    this.onMultiAppendBeforeHandle(e[c]);
                }
                this.appendFormat(d, e[c]);
            }
        }
        return this;
    };
    this.appendFormat = function() {
        var p = arguments.length;
        if (p == 0) {
            return this;
        }
        var l = arguments[0];
        if (p == 1) {
            return this.append(l);
        }
        var d = arguments[1];
        if (d == null) {
            d = "";
        }
        var h,
            m,
            o,
            g,
            j;
        if (typeof (d) == "object") {
            j = function(c, e) {
                return c[1][e];
            };
        } else {
            j = function(c, e) {
                return c[e - 0 + 1];
            };
        }
        for (h = 0; h < l.length;) {
            o = l.charAt(h);
            if (o == "{") {
                m = l.indexOf("}", h);
                g = l.substring(h + 1, m);
                this.s.push(j(arguments, g));
                h = m + 1;
                continue;
            }
            this.s.push(o);
            h++;
        }
        return this;
    };
};
function showHidenNotice(c, b) {
    if (!$(b).is(":hidden")) {
        $(c).hover(function() {
            $(b).hide();
        }, function() {
            $(b).show();
        });
    }
}
function CloseTipsWindow() {
    if (document.all) {
        window.detachEvent("onscroll", zdmTipsDivCenter);
    } else {
        window.removeEventListener("scroll", zdmTipsDivCenter, false);
    }
    $("#zdm_tips_mask").fadeOut(300, function() {
        $(this).remove();
    });
}
var zdmTipsDivWidth = 400;
var zdmTipsDivHeight = 200;
function zdmTipsDivCenter() {
    var b = document.getElementById("zdm_tips");
    b.style.top = (document.body.scrollTop + document.body.clientHeight / 2 - zdmTipsDivHeight / 2) + "px";
    b.style.left = (document.body.scrollLeft + document.body.clientWidth / 2 - zdmTipsDivWidth / 2) + "px";
}
function ZTips(c) {
    var i = arguments[1] ? arguments[1] : {};
    var r = i.extra_msg ? i.extra_msg : "";
    var h = i.delay ? i.delay : 0;
    var j = i.fadeOut ? i.fadeOut : 300;
    var q = document.body.scrollWidth;
    var b = document.body.scrollHeight;
    var m = i.icon ? i.icon : "layerIconSuc";
    var p = i.yes ? i.yes : "";
    var d = i.no ? i.no : "";
    var k = i.func_yes ? i.func_yes : function() {
        return true;
    };
    var g = i.func_no ? i.func_no : function() {
        return true;
    };
    var l = i.func_init ? i.func_init : function() {};
    var f = "";
    if (p || d) {
        f += '<div class="layerBtn">';
        if ("" != d) {
            f += '<a href="javascript:void(0);" id="layerBtnNo" class="layerBtnR">' + d + "</a>";
        }
        if ("" != p) {
            f += '<a href="javascript:void(0);" id="layerBtnYes" class="layerBtnL">' + p + "</a>";
        }
        f += '<div class="clear"></div></div>';
    }
    $("body").append('<div id="zdm_tips_mask" class="layerFixed" style="width:' + q + "px;height:" + b + 'px;"><div class="layerAbs"></div><div class="layer_content"></div></div>');
    $("#zdm_tips_mask .layer_content").html('<div id="zdm_tips" class="layerBg ' + m + '"><div class="layerWrap" onclick="return false;"><a class="layerClose" href="javascript:void(0);">关闭</a><div id="ztips_content" class="layerContent"><div class="layerSubInfo">' + c + '</div><div id="tips_error_msg"></div>' + r + f + "</div></div></div></div>");
    $("#layerBtnYes").on("click", function() {
        if (k()) {
            o();
        }
    });
    $("#layerBtnNo").on("click", function() {
        if (g()) {
            o();
        }
    }).focus();
    l();
    function o() {
        if (document.all) {
            window.detachEvent("onscroll", zdmTipsDivCenter);
        } else {
            window.removeEventListener("scroll", zdmTipsDivCenter, false);
        }
        $("#zdm_tips_mask").fadeOut(j, function() {
            $(this).remove();
        });
    }
    function e() {
        alert("yes_do");
    }
    if (document.all) {
        window.attachEvent("onscroll", zdmTipsDivCenter);
    } else {
        window.addEventListener("scroll", zdmTipsDivCenter, false);
    }
    $(".layerClose").on("click", function() {
        $("#zdm_tips_mask").fadeOut(j, function() {
            $(this).remove();
        });
    });
    if (h > 0) {
        setTimeout("$('#zdm_tips_mask').fadeOut(" + j + ",function(){CloseTipsWindow()});", h);
    }
}
function WidthCheck(e, g) {
    var b = 0;
    for (var d = 0; d < e.length; d++) {
        var f = e.charCodeAt(d);
        if ((f >= 1 && f <= 126) || (65376 <= f && f <= 65439)) {
            b++;
        } else {
            b += 2;
        }
    }
    if (b > g) {
        return false;
    }
    return true;
}
function strlen(d) {
    var b = 0,
        e = "utf-8";
    for (var c = 0; c < d.length; c++) {
        b += d.charCodeAt(c) < 0 || d.charCodeAt(c) > 255 ? (e == "utf-8" ? 3 : 2) : 1;
    }
    return b;
}
function GetRTime() {
    $(".have_end_time").each(function() {
        var f = $(this);
        var l = $(this).attr("end_time");
        var g = new Date(Date.parse(l.replace(/-/g, "/")));
        var c = new Date(g);
        var h = $("#server-time").val();
        var j = new Date(Date.parse(h.replace(/-/g, "/")));
        var d = new Date(j);
        var m = c.getTime();
        var b = d.getTime();
        var e = m - b;
        var i = e;
        function k(p, t) {
            var s = Math.floor(p / (1000 * 60 * 60 * 24));
            var r = Math.floor(p / (1000 * 60 * 60)) % 24;
            var v = Math.floor(p / (1000 * 60)) % 60;
            var q = Math.floor(p / 1000) % 60;
            var u = r + s * 24;
            s = s < 10 ? "0" + s : s;
            r = r < 10 ? "0" + r : r;
            v = v < 10 ? "0" + v : v;
            q = q < 10 ? "0" + q : q;
            u = u < 10 ? "0" + u : u;
            var o = t.find(".days").length;
            if (o == 0) {
                if (q >= 0) {
                    t.find(".hours").html(u);
                    t.find(".minutes").html(v);
                    t.find(".seconds").html(q);
                } else {
                    t.find(".hours").html(0);
                    t.find(".minutes").html(0);
                    t.find(".seconds").html(0);
                }
            } else {
                if (q >= 0) {
                    t.find(".days").html(s);
                    t.find(".hours").html(r);
                    t.find(".minutes").html(v);
                    t.find(".seconds").html(q);
                } else {
                    if (t.parents("#to-begin-time")) {
                        t.parents("#to-begin-time").css("display", "none");
                        $("#application-time").css("display", "block");
                    }
                    if (t.parents("#application-time")) {
                        t.parents("#application-time").css("display", "none");
                        $("#end-time").css("display", "block");
                    }
                }
            }
            setTimeout(function() {
                k(p - 1000, t);
            }, 1000);
        }
        k(i, f);
    });
}
function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function(d) {
        var b = "";
        var l,
            j,
            g,
            k,
            h,
            f,
            e;
        var c = 0;
        d = _utf8_encode(d);
        while (c < d.length) {
            l = d.charCodeAt(c++);
            j = d.charCodeAt(c++);
            g = d.charCodeAt(c++);
            k = l >> 2;
            h = ((l & 3) << 4) | (j >> 4);
            f = ((j & 15) << 2) | (g >> 6);
            e = g & 63;
            if (isNaN(j)) {
                f = e = 64;
            } else {
                if (isNaN(g)) {
                    e = 64;
                }
            }
            b = b + _keyStr.charAt(k) + _keyStr.charAt(h) + _keyStr.charAt(f) + _keyStr.charAt(e);
        }
        return b;
    };
    this.decode = function(d) {
        var b = "";
        var l,
            j,
            g;
        var k,
            h,
            f,
            e;
        var c = 0;
        d = d.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (c < d.length) {
            k = _keyStr.indexOf(d.charAt(c++));
            h = _keyStr.indexOf(d.charAt(c++));
            f = _keyStr.indexOf(d.charAt(c++));
            e = _keyStr.indexOf(d.charAt(c++));
            l = (k << 2) | (h >> 4);
            j = ((h & 15) << 4) | (f >> 2);
            g = ((f & 3) << 6) | e;
            b = b + String.fromCharCode(l);
            if (f != 64) {
                b = b + String.fromCharCode(j);
            }
            if (e != 64) {
                b = b + String.fromCharCode(g);
            }
        }
        b = _utf8_decode(b);
        return b;
    };
    _utf8_encode = function(d) {
        d = d.replace(/\r\n/g, "\n");
        var b = "";
        for (var f = 0; f < d.length; f++) {
            var e = d.charCodeAt(f);
            if (e < 128) {
                b += String.fromCharCode(e);
            } else {
                if ((e > 127) && (e < 2048)) {
                    b += String.fromCharCode((e >> 6) | 192);
                    b += String.fromCharCode((e & 63) | 128);
                } else {
                    b += String.fromCharCode((e >> 12) | 224);
                    b += String.fromCharCode(((e >> 6) & 63) | 128);
                    b += String.fromCharCode((e & 63) | 128);
                }
            }
        }
        return b;
    };
    _utf8_decode = function(b) {
        var d = "";
        var e = 0;
        var f = c1 = c2 = 0;
        while (e < b.length) {
            f = b.charCodeAt(e);
            if (f < 128) {
                d += String.fromCharCode(f);
                e++;
            } else {
                if ((f > 191) && (f < 224)) {
                    c2 = b.charCodeAt(e + 1);
                    d += String.fromCharCode(((f & 31) << 6) | (c2 & 63));
                    e += 2;
                } else {
                    c2 = b.charCodeAt(e + 1);
                    c3 = b.charCodeAt(e + 2);
                    d += String.fromCharCode(((f & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    e += 3;
                }
            }
        }
        return d;
    };
}
function popPosition(f) {
    var e = $(window).width();
    var c = $(window).height();
    var b = $(f).width();
    var d = $(f).height();
    $(f).css({
        left: e / 2 - b / 2,
        top: c / 2 - d / 2
    });
}
function popClose(b) {
    $(b).find(".pop-close").click(function() {
        $("#cover").hide();
        $(b).hide();
    });
    $("#cover").click(function() {
        $("#cover").hide();
        $(b).hide();
    });
    $(".cancel").click(function() {
        $("#cover").hide();
        $(b).hide();
    });
}
function popUp(d, e, b) {
    if (d != "") {
        $(d).click(function() {
            popPosition(e);
            $("#cover").show();
            $(e).show();
            popClose(e);
        });
    } else {
        $(e).find(".pop_info").text(b);
        popPosition(e);
        $("#cover").show();
        $(e).show();
        var c = setTimeout(function() {
            $("#cover").hide();
            $(e).hide();
        }, 2000);
        $(e).find(".pop-close").click(function() {
            clearTimeout(c);
            $("#cover").hide();
            $(e).hide();
        });
        $("#cover").click(function() {
            clearTimeout(c);
            $("#cover").hide();
            $(e).hide();
        });
    }
}
function count_down(d, c) {
    var b = parseInt($(d).html());
    if (b > 0) {
        $(d).html(b - 1);
        setTimeout(function() {
            count_down(d, c);
        }, 1000);
    }
    if (b == 0) {
        if (c == "pop") {
            $("#countdown").css("display", "none");
            $("#confirm").css("display", "block");
            $("#confirm .button").click(function() {
                $("#pop-instructions").hide();
                $("#cover_instructions").hide();
            });
        }
        if (c == "go_back") {
            $("#go_back_link").trigger("click");
        }
    }
}
function placehold() {
    $(".input_style").each(function() {
        var b = $(this).attr("default_value");
        if ($(this).attr("default_value")) {
            $(this).focus(function() {
                if ($(this).val() == b) {
                    $(this).val("");
                    $(this).css("color", "#333");
                }
            });
            $(this).blur(function() {
                if ($(this).val() == "") {
                    $(this).val(b);
                    $(this).css("color", "#999");
                }
            });
        }
    });
}
function articleLinkAdd() {
    var b = $(".good_link").length;
    if (b <= 2) {
        var c = $(this).parent();
        c.after('<div class="good_link"><input type="text" class="input_style lFloat width_388 grey" value="请输入文章链接，站内文章最佳" default_value="请输入文章链接，站内文章最佳" name="article_links[]"/><input type="button" value="+" class="button_add" /></div>');
        $(this).removeClass("button_add").addClass("button_reduce").val("-");
        $(this).unbind("click").bind("click", function() {
            $(this).parent().remove();
            $(".good_link").find(".button_add").each(function() {
                if ($(this).hasClass("button_add")) {
                    $(this).removeClass("disabled");
                }
            });
        });
        placehold();
        c.next(".good_link").find(".button_add").bind("click", articleLinkAdd);
    }
    if (b == 2) {
        $(".good_link").find(".button_add").each(function() {
            if ($(this).hasClass("button_add")) {
                $(this).addClass("disabled");
            }
        });
    }
}
function login_reg_input(b) {
    SetInputCss(b);
    $(b).mouseup(function() {
        SetInputCss(b);
    });
    $(b).blur(function() {
        if ($.trim($(this).val()) == "") {
            $(this).removeClass("form-input-focus");
            $(this).prev().removeClass("item-tip-focus");
        }
    });
    $(b).focus(function() {
        if (!$(this).hasClass("form-input-focus")) {
            $(this).addClass("form-input-focus");
            $(this).prev().addClass("item-tip-focus");
        }
    });
    $(".item-tip").click(function() {
        $(this).next().focus();
    });
}
function SetInputCss(b) {
    $(b).each(function() {
        if ($.trim($(this).val()) != "") {
            $(this).addClass("form-input-focus");
            $(this).prev().addClass("item-tip-focus");
        }
    });
}
slidingFunction = function() {
    var o = navigator.userAgent.toLowerCase();
    var h = {
        IE: /msie/.test(o),
        OPERA: /opera/.test(o),
        MOZ: /gecko/.test(o),
        IE5: /msie 5 /.test(o),
        IE55: /msie 5.5/.test(o),
        IE6: /msie 6/.test(o),
        IE7: /msie 7/.test(o),
        SAFARI: /safari/.test(o)
    };
    var k = $("#right_side").height();
    var e = $("#right_sliding");
    var i = (e.length > 0);
    var r = 0;
    var x = 0;
    var m = $("#footer").height();
    var w = $(window).width();
    var b = $(window).height();
    var q = false;
    var u = false;
    var v = false;
    var g = $("section.wrap").width();
    var j = $("#leftLayer").height();
    var s = $("#rightLayer").height();
    var l = w / 2 - g / 2 - 10 - 48;
    var d = b / 2 - j / 2 - 50;
    if (l > 0) {
        $("#leftLayer").show().css({
            "left": l,
            "top": d
        });
        $("#rightLayer").show().css("right", l);
    } else {
        if (l = 0) {
            $("#leftLayer").show().css({
                "left": 0,
                "top": d
            });
            $("#rightLayer").show().css("right", 0);
        } else {
            $("#leftLayer").hide();
            $("#rightLayer").hide();
        }
    }
    var c = document.body.scrollTop || document.documentElement.scrollTop;
    (c > 300) ? $("#backToTop").css("display", "block") : $("#backToTop").css("display", "none");
    if (h.IE6) {
        $("#rightLayer").css("top", c + b - 166);
    }
    var t = $("body").height();
    var y = document.getElementById("rightLayer");
    if (y) {
        var p = $("#rightLayer").height() + 18;
        if (t <= c + b + m - p + 135) {
            var f = c + b + m + 20 - t;
            $("#rightLayer").css({
                position: "fixed",
                bottom: f
            });
        } else {
            $("#rightLayer").css({
                position: "fixed",
                bottom: 0
            });
        }
    }
};
function fixFooterPosition(d) {
    var c = $(window).height();
    var b = 110 + $(".wrap").height();
    if (c - b >= 80) {
        $(d).css({
            "position": "fixed",
            "left": "0",
            "bottom": "0"
        });
    } else {
        $(d).css("position", "static");
    }
}
function sortTab(b) {
    $(b).click(function() {
        if ($(this).hasClass("gold_t") == true) {
            $(this).addClass("gold_b");
            $(this).removeClass("gold_t");
        } else {
            $(this).addClass("gold_t");
            $(this).removeClass("gold_b");
        }
    });
}
function classify(b) {
    var c = $(b).find("a");
    $(c).click(function() {
        var e = $(b).find(".current_red").length;
        var d = $(this).attr("class");
        if (e <= 2) {
            if (d == "default_grey") {
                $(this).removeClass().addClass("current_red");
                $(this).find("input").prop("checked", true);
            }
        }
        if (e == 2) {
            $(c).each(function() {
                if ($(this).hasClass("default_grey")) {
                    $(this).addClass("disabled");
                }
            });
        }
        if (d == "current_red") {
            $(this).removeClass().addClass("default_grey");
            $(this).find("input").removeAttr("checked");
            $(c).removeClass("disabled");
        }
    });
}
function read(b) {
    $(b).click(function() {
        if ($(b).is(":checked")) {
            $("#btn_submit").removeClass("button_grey").addClass("button_red").attr("disabled", false).css("border", "1px solid #f04848");
        } else {
            $("#btn_submit").removeClass("button_red").addClass("button_grey").attr("disabled", true).css("border", "0");
        }
    });
}
$(function() {
    if (zhiyou_open) {
        zhiyou_relate.request_zhiyou_info(function(f) {
            var g = f.point;
            var c = f.gold;
            var e = f.can_apply;
            var d = f.has_mobile;
            $("#user_prob").val(g + "-" + c + "-" + e + "-" + d);
        });
    } else {
        requestUserInfo();
    }
    if (zhiyou_open) {
        var b = {
            "redirect_url": encodeURIComponent(window.location.href)
        };
        zhiyou_relate.popup_login_init(b);
    } else {
        login();
    }
    sortTab(".gold_t");
    $("#quickComment").autoTextarea({
        maxHeight: 200
    });
    read("#read");
    showHide(".haveLayer", "", ".more_time_box");
    showHide(".user_avatar", "", ".more_user_avatar");
    showHide(".moreNav", "moreNavHover", ".more_moreNav");
    showHide(".submission", "submissionHover", ".more_submission");
    showHide(".login_Info", "login_InfoHover", ".more_login_Info");
    showHide(".menu_more", "menu_more_current", ".more_menu_more");
    showHidenNotice(".login_Info", "#chief_notice");
    showHidenNotice(".submission", "#chief_notice");
    placehold();
    popPosition("#pop-instructions");
    popPosition("#pop-tip");
    if (zhiyou_open == 1) {
        $("#navBar_login,#user_info_tosign,#sign_login a").addClass("zhiyou_login");
    } else {
        popUp("#navBar_login", "#pop-login", "");
        popUp("#user_info_tosign", "#pop-login", "");
        popUp("#sign_login a", "#pop-login", "");
    }
    login_reg_input(".form-input");
    count_down("#jumpTo", "pop");
    GetRTime();
    $(".button_add").bind("click", articleLinkAdd);
    $(".button_reduce").click(function() {
        $(this).parent().remove();
        var c = $(".good_link").length;
        if (c < 3) {
            $(".good_link").find(".button_add").removeClass("disabled");
        }
    });
    $(window).resize(function() {
        slidingFunction();
    });
    $(window).scroll(function() {
        slidingFunction();
    });
    slidingFunction();
    $(".goTotop").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 150);
    });
    classify("#insterested");
    login_reg_input(".form-input");
    get_user_is_apply();
    scored("#details-zan", "current");
    $(".intro").mouseenter(function() {
        $(".intro_detail").fadeIn(400);
    });
    $(".intro_detail").mouseleave(function() {
        $(".intro_detail").fadeOut(200);
    });
    $("img.lazy").lazyload({
        threshold: 200
    });
});
function scored(d, c) {
    var b = $(d);
    if (b.find("a").hasClass(c)) {
        b.mouseover(function() {
            $(this).find("." + c).css("display", "none");
            $(this).find(".scoredInfo").css("display", "block");
        });
        b.mouseout(function() {
            $(this).find("." + c).css("display", "block");
            $(this).find(".scoredInfo").css("display", "none");
        });
    }
}
function showHidenNotice(c, b) {
    if (!$(b).is(":hidden")) {
        $(c).hover(function() {
            $(b).hide();
        }, function() {
            $(b).show();
        });
    }
}
function showError(b, c) {
    b.html(c).fadeIn().delay(3000).fadeOut();
}
function login() {
    $("#btn_login").click(function() {
        var i = $(".notice_error");
        var b = $.trim($("#user_login").val());
        var g = $("#user_pass").val();
        var h = $.trim($("#captcha").val());
        var j = $("#rememberme").is(":checked") + 0;
        var d = $.trim($("#is_third").val());
        var c = $("#is_pop_login").val();
        if (b == "") {
            showError(i, "请输入用户名或邮箱");
        } else {
            if (g == "") {
                showError(i, "请输入密码");
            } else {
                if ($(".captcha_switch").is(":visible") && h == "") {
                    showError(i, "请输入验证码");
                } else {
                    var e = new Base64();
                    var k = 0;
                    if ($("#rememberme").is(":checked")) {
                        k = 1;
                    }
                    var f = smzdm_www + "/user/login/jsonp_check";
                    $.ajax({
                        type: "get",
                        url: f,
                        data: "user_login=" + b + "&user_pass=" + encodeURIComponent(g) + "&rememberme=" + j + "&is_third=" + d + "&is_pop=" + c + "&captcha=" + h,
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function(m) {
                            var p = m.data.redirect_to;
                            var o = m.data.is_use_captcha;
                            var t = m.error_code;
                            if (p != "" && p != undefined) {
                                window.location.href = p;
                            } else {
                                if (o) {
                                    var r = $("#captcha_img").attr("data-src");
                                    $("#captcha_img").attr("src", r);
                                    $(".captcha_switch").show();
                                }
                                if (t == 0) {
                                    if ($("#pop-login").length > 0) {
                                        location.reload();
                                    } else {
                                        var l = $.trim($("#redirect_to").val());
                                        if ("" == l) {
                                            l = "http://www.smzdm.com";
                                        }
                                        window.location.href = l;
                                    }
                                }
                                var s = m.error_msg;
                                for (var q in s) {
                                    showError(i, s[q]);
                                    break;
                                }
                            }
                        },
                        error: function() {
                            showError(i, "网络错误，请稍后重试");
                        }
                    });
                }
            }
        }
        return false;
    });
}
function showRegError(b, c) {
    b.siblings(".icon-loginright").hide().end().siblings(".error").html(c).show();
}
function requestUserInfo() {
    if (zhiyou_open) {
        zhiyou_relate.request_zhiyou_info();
        return;
    }
    var b = $.trim($("#commentform #pid").val());
    var c = $.trim($("#commentform #type").val());
    var d = $("#user_domain").val();
    var e = d + "/user/info/jsonp_get_current";
    $.ajax({
        type: "get",
        url: e,
        data: "pid=" + b + "&type=" + c + "&prob=1",
        dataType: "jsonp",
        jsonp: "callback",
        success: function(J) {
            if (J.user.length != 0) {
                var g = J.user.user_smzdm_id;
                var k = J.user.display_name;
                var F = J.new_notice;
                var t = J.user.banright;
                var x = t.length;
                var q = J.user.avatar.split("small")[0] + "middle" + J.user.avatar.split("small")[1];
                var I = d + "/user";
                var C = J.user.point;
                var m = J.user.gold;
                var z = J.user.prob.can_apply;
                var H = J.user.is_mobile;
                $("#user_prob").val(C + "-" + m + "-" + z + "-" + H);
                var s = J.user.checkin.has_checkin;
                var v = J.user.checkin.daily_attendance_number;
                var o = J.user.checkin.set_checkin;
                var B = parseInt(F.message.num);
                var l = parseInt(F.comment.num);
                var h = J.user.capabilities;
                var j = J.user.is_comment_connect;
                var r = J.user.is_anonymous;
                $("body").append('<input id="log_status" type="hidden" value="1" />');
                if (h != "") {
                    if (h.administrator || h.editor || h.pinglun || h.edit_posts || h.moderate_comments) {
                        $("body").append('<input type="hidden" id="authority" value="editor" />');
                        if ($(".list").length > 0) {
                            listAddEditStart();
                        }
                        if ($("#isDetail").length > 0) {
                            detailAddEditStart();
                        }
                        $("#authority").val("all");
                    }
                }
                $("#navBar_login,#navBar_reg").hide();
                $("#navBar_login_Info").find(".nickName").html(k);
                $("#navBar_login_Info").show();
                if (B != 0 || l != 0) {
                    if (B != 0) {
                        var f = F.message.url;
                        $("#notice_message").attr("href", f).find("em").html(B);
                        $("#user_menu_message").find("a").attr("href", f).html("我的消息<span>" + B + "</span>");
                    } else {
                        $("#notice_message").hide();
                    }
                    if (l != 0) {
                        var D = F.comment.url;
                        $("#notice_comment").attr("href", D).find("em").html(l);
                        $("#user_menu_comment").find("a").attr("href", D).html("我的评论<span>" + l + "</span>");
                    } else {
                        $("#notice_comment").hide();
                    }
                    $("#chief_notice").show().find(".close").click(function() {
                        $("#chief_notice").hide();
                    });
                    $("#chief_notice").slideDown("slow");
                } else {
                    $("#chief_notice").hide();
                }
                if ($("#user_info").length > 0) {
                    $("#sign_login").hide();
                    $("#user_info_avatar").attr({
                        "src": q,
                        "alt": k
                    }).unwrap("span").wrap('<a href=" ' + I + ' " class="userPic" target="_blank"></a>');
                    $("#user_info_name").html(' <a href=" ' + I + ' " title=" ' + k + ' " target="_blank">' + k + "</a> ");
                    $("#user_info_score").find("em").html(C).end().next("a").andSelf().show();
                    $("#user_info_tosign").unbind("click").bind("click", toSign);
                    if (s) {
                        var p = parseInt($("#user_info").attr("needMobileTips"));
                        $("#user_info_tosign").html("已签到" + v + "天").removeClass("signScore").addClass("signScored").unbind("click");
                        if (p != 1) {
                            $("#user_info_tosign").attr("href", d + "/qiandao ");
                        }
                    }
                    var K = $("#channel").val();
                    if (K != "index") {
                        var G = J.user.checkin.slogan;
                        $(".scoreBox").after(G);
                    }
                }
                if (r && 1 == r) {
                    $("#comment_avatar").attr({
                        "src": no_avatar,
                        "alt": "匿名用户"
                    }).unwrap("span").wrap('<a href="javascript:void(0);" class="userPic"></a>');
                    $("#comment_avatar").parent(".userPic").after(' <span class="comment_nickName grey">匿名用户</span> ');
                } else {
                    $("#comment_avatar").attr({
                        "src": q,
                        "alt": k
                    }).unwrap("span").wrap('<a href=" ' + I + ' " class="userPic" target="_blank" title=" ' + k + ' "></a>');
                    $("#comment_avatar").parent(".userPic").after(' <a href=" ' + I + ' " class="comment_nickName a_underline" target="_blank"  title=" ' + k + ' ">' + k + "</a> ");
                    if (J.user.has_christmas_hat) {
                        $("#comment_avatar").parent(".userPic").before('<a class="hat" href="http://news.smzdm.com/p/16803" title="七夕快乐！" target="_blank"></a> ');
                    }
                }
                $("#comment_tips").remove();
                $(".noLogin").removeClass("noLogin");
                var u = $("#textareaComment").attr("default_data");
                $("#textareaComment").unbind("click").val(u).focus(function() {
                    if ($(this).val() == u) {
                        $(this).val("");
                    }
                    $(this).css("color", "#666");
                }).blur(function() {
                    if ($(this).val() == "") {
                        $(this).val(u).css("color", "#ccc");
                    }
                }).change(function() {
                    $("#textCommentSubmit").removeAttr("disabled");
                });
                $(".comment_switch").show(function() {
                    if (j == "yes" && $("#commentform").find(".check").length > 0) {
                        $("#commentform").find(".check").addClass("icon-rightframe");
                    } else {
                        if (j == "no" && $("#commentform").find(".check").length > 0) {
                            $("#commentform").find(".check").removeClass("icon-rightframe");
                        }
                    }
                });
                $("#textCommentSubmit").removeAttr("disabled").removeClass("btn_subGrey").addClass("btn_sub");
                for (var A = 0; A < x; A++) {
                    if (t[A] == 1) {
                        var E = J.user.bantips;
                        $("#textareaComment").html("").attr("disabled", "disabled");
                        $("#comment_error").html(E).show();
                        $("#textCommentSubmit").removeClass("btn_sub").addClass("btn_subGrey").attr("disabled", "disabled");
                        $(".comment_switch").hide();
                        $(".atta,.reply").unbind("click");
                        break;
                    }
                }
                showHidenNotice(".login_Info", "#chief_notice");
                showHidenNotice(".submission", "#chief_notice");
            } else {
                var y = parseInt(J.login_error_num);
                if (y >= 3) {
                    var w = $("#captcha_img").attr("data-src");
                    $("#captcha_img").attr("src", w);
                    $(".captcha_switch").show();
                }
            }
            if (J.c_close_enter) {
                $("#textareaComment").html("").attr("disabled", "disabled");
                $("#textCommentSubmit").removeClass("btn_sub").addClass("btn_subGrey").attr("disabled", "disabled");
                $(".comment_switch").hide();
                $(".atta,.reply").unbind("click");
                if (J.user.length == 0) {
                    $(".noLogin .comment_tips").unbind("click").remove();
                }
            }
        },
        error: function() {}
    });
}
function get_user_prob_info() {
    $.ajax({
        type: "POST",
        url: "/user_prob_info",
        data: {},
        dataType: "json",
        success: function(b) {
            if (b.error_code == 0) {
                $("#user-area").html(b.probation_user_view);
                $("#probation_login").click(function() {
                    if (zhiyou_open) {
                        zhiyou_relate.popup_login_show();
                    } else {
                        popPosition("#pop-login");
                        $("#pop-login,#cover").show();
                        popClose("#pop-login");
                    }
                });
            }
        }
    });
}
function setCookieArr1(k, h, m, q, f, b) {
    var c = getCookie(k);
    var o;
    if (c) {
        o = json_decode(c);
    }
    if (o) {
        var e = o.length;
        if (e >= cookie_length_limit) {
            var l = new Array();
            o[cookie_length_limit] = h;
            for (var g in o) {
                if (g <= e - 1) {
                    var d = parseInt(g) + 1;
                    l[g] = o[d.toString()];
                }
            }
            o = l;
        } else {
            o[e] = h;
        }
    } else {
        var o = new Array();
        o[0] = h;
    }
    var p = json_encode(o);
    m = m ? m : 604800;
    setCookie(k, p, m, q, f, b);
    return;
}
function getBooInCookieArr1(f, d) {
    var c = getCookie(f);
    if (c) {
        var e = json_decode(c);
        if (e) {
            for (var b in e) {
                if (e[b] && e[b] == d) {
                    return true;
                }
            }
        }
    }
    return false;
}
function getCookie(c) {
    var b = document.cookie.match(new RegExp("(^| )" + c + "=([^;]*)(;|$)"));
    if (b != null) {
        return unescape(b[2]);
    }
    return null;
}
function setCookie(c, e, b, f) {
    if (b) {
        var d = b;
    } else {
        var d = 30 * 3;
    }
    var g = new Date();
    g.setTime(g.getTime() + d * 24 * 60 * 60 * 1000);
    c += "=" + escape(e) + ";expires=" + g.toGMTString();
    if (f) {
        c += "; path=" + f;
    }
    document.cookie = c;
}
function setCookieBydomain(c, f, b, g) {
    if (b) {
        var e = b;
    } else {
        var e = 30 * 3;
    }
    var h = new Date();
    h.setTime(h.getTime() + e * 24 * 60 * 60 * 1000);
    var d = c + "=" + escape(f) + ";path=" + g + ";expires=" + h.toGMTString();
    d += ";domain=" + cookie_domain;
    document.cookie = d;
}
function json_decode(str_json) {
    var json = this.window.JSON;
    if (typeof json === "object" && typeof json.parse === "function") {
        return json.parse(str_json);
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var j;
    var text = str_json;
    cx.lastIndex = 0;
    if (cx.test(text)) {
        text = text.replace(cx, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        });
    }
    if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
        j = eval("(" + text + ")");
        return j;
    }
    throw new SyntaxError("json_decode");
}
function user_auth_password(e, c, b) {
    var d = $.trim($("#safepass").val());
    $("#public_msg").text("");
    if (d == "") {
        $("#public_msg").text("请输入安全密码");
        return;
    }
    $.ajax({
        type: "POST",
        dataType: "jsonp",
        jsonp: "callback",
        url: "http://new.www.bq.com/safe_pass_auth",
        data: "safepass=" + d,
        timeout: 5000,
        success: function(f) {
            switch (f.error_code) {
            case 0:
                send_probation_apply(e);
                break;
            case 1:
                $("#public_msg").html(f.error_msg["safepass"]);
                break;
            case 2:
                $("#public_msg").html(f.error_msg["public"]);
                break;
            }
        }
    });
}
function probation_apply(c, f, m, h) {
    var d = $("#user_prob").val();
    var e = 0;
    var o = 0;
    var g = 0;
    var b = new Array();
    if (d == "") {
        e = -1;
    } else {
        b = d.split("-");
        if (b[0] != "") {
            g = b[0];
        }
        if (b[1] != "") {
            o = b[1];
        }
        if (b[2] != "") {
            e = b[2];
        }
        if (b[3] != "") {
            user_is_mobile = b[3];
        }
    }
    if (e == -1) {
        $("#pop_tip").hide();
        $("#cover").hide();
        if (zhiyou_open) {
            zhiyou_relate.popup_login_show();
        } else {
            popPosition("#pop-login");
            $("#pop-login,#cover").show();
            popClose("#pop-login");
        }
    } else {
        var l = true;
        if (e == 1) {
            var i = "<p>抱歉，你没有按时提交众测报告，无法申请新产品，请尽快在“<a class='a_underline' target='_blank' href='" + smzdm_test + "/user/zhongce/chenggong'>我的众测</a>”中补交报告，通过审核后恢复你的申请资格。</p><br><p><a class='button button_red' onclick='$(\"#pop_tip\").hide();$(\"#cover\").hide();' href='javascript:void(0)'>确&nbsp;&nbsp;认</a></p>";
        } else {
            if (parseInt(o) < parseInt(f) || parseInt(g) < parseInt(m)) {
                var i = "<p>抱歉，你的积分（或金币）不足<a class='small_size a_underline' target='_blank' href='" + integral_plan + "'><br>如何获得金币？</a></p><p><a class='button button_red' onclick='$(\"#pop_tip\").hide();$(\"#cover\").hide();' href='javascript:void(0)'>确&nbsp;&nbsp;认</a></p>";
            } else {
                if (user_is_mobile == 0) {
                    var i = "<p>你需要<a href='" + smzdm_www + "/user/mobile/verify' target='_blank'>绑定手机</a>后才可申请众测产品<br><p><a href='javascript:void(0)' target='_blank' class='button button_red' onclick='$(\"#pop_tip\").hide();$(\"#cover\").hide();' >确&nbsp;&nbsp;认</a></p>";
                } else {
                    var j = "";
                    var k = "";
                    var p = "";
                    var q = "";
                    if (open_captcha) {
                        k = "<p class='text_Left'>验证码：<input id='captcha' class='input_style width_103 grey' type='text' name='captcha' autocomplete='off' tabindex='5' />" + '<img onclick="document.getElementById(\'captcha_img\').src = \'/getcaptcha/ch/apply_product?\' + Math.random();document.getElementById(\'captcha\').focus();return false;" id="captcha_img" src="/getcaptcha/ch/apply_product" title="看不清?点击更换" alt="看不清?点击更换" />' + "<span class='small_size padding_l_10'><a class='a_underline' href='javascript:void(0);' onclick=\"document.getElementById('captcha_img').src = '/getcaptcha/ch/apply_product?' + Math.random();document.getElementById('captcha').focus();return false;\">点击更换</a></span><span style='display:none;' id = 'captcha_error' class='error'></span>";
                    } else {
                        k = "<span style='display:none;' id = 'captcha_error' class='error'></span>";
                    }
                    if (f >= 0) {
                        p = "<span class='red'>" + f + "</span> 金币 ";
                    }
                    if (m >= 0) {
                        if (p != "") {
                            q = "、";
                        }
                        q = q + "<span class='red'>" + m + "</span> 积分";
                    }
                    l = false;
                }
            }
        }
        if (l) {
            $("#pop_tip").hide();
            $("#pop_tip .pop_info").html(i);
            popPosition("#pop_tip");
            $("#pop_tip").show();
            $("#cover").show();
            popClose("#pop_tip");
            placehold();
        } else {
            window.location.href = smzdm_test + "/yanzheng/" + c;
        }
    }
}
function send_probation_apply(e) {
    if (apply_can_click == false) {
        return false;
    } else {
        apply_can_click = false;
    }
    var c = $("#captcha").val();
    var b = $("#safepass").val();
    var d = $("#input_reason").val();
    $("#public_msg").html("");
    $("#captcha_error").html("");
    if (c == "" && open_captcha) {
        apply_can_click = true;
        $("#captcha").focus().addClass("red_border");
        $("#captcha_error").css("display", "block").html("请输入验证码");
    } else {
        if (getTextLength(input_reason) > 500) {
            apply_can_click = true;
            $("html,body").animate({
                scrollTop: $(".product_info").offset().top
            }, 100);
        } else {
            if (e > 0) {
                $.ajax({
                    url: "/ajax_probation_apply",
                    type: "post",
                    data: {
                        p_id: e,
                        code: c,
                        plan: $.trim(d),
                        safepass: b
                    },
                    dataType: "json",
                    success: function(h) {
                        apply_can_click = true;
                        var g = true;
                        switch (h.error_code) {
                        case -1:
                            var f = "<p>" + h.error_msg + "</p>";
                            document.getElementById("captcha_img").src = "/getcaptcha/ch/apply_product?" + Math.random();
                            aply_count_down("#apply_jumpTo", "apply");
                            break;
                        case 0:
                            var f = "提交申请成功。申请进度可稍后在“<a class='a_underline' target='_blank' href='" + smzdm_test + "/user/zhongce'>我的众测</a>”里查看。";
                            var i = smzdm_test + "/p/" + e;
                            $(" .test_form_button").find(" .button_red").removeClass("button_red").addClass("button_grey").removeAttr("onclick").html("已申请");
                            $(" .test_form_button").find("a").css("display", "none");
                            apply_can_click = false;
                            break;
                        case 1:
                            $("#captcha").focus().addClass("red_border");
                            $("#captcha_error").css("display", "block").html("请输入验证码");
                            g = false;
                            break;
                        case 2:
                            var f = '<p>已申请过该产品，请勿重复申请。</p><div class="a_blockBox"><a class="a_redBlock lFloat"  href="' + smzdm_test + "/p/" + e + '">确&nbsp;&nbsp;定</a></div>';
                            $(" .test_form_button").find(" .button_red").removeClass("button_red").addClass("button_grey").removeAttr("onclick").html("已申请");
                            $(" .test_form_button").find("a").css("display", "none");
                            break;
                        case 3:
                            var f = "<p>系统错误<br><div class='a_blockBox'><a class='a_redBlock lFloat' onclick='$(\"#confirm_div\").hide();$(\"#cover\").hide();' href='javascript:void(0)'>确&nbsp;&nbsp;定</a></div>";
                            break;
                        case 4:
                            var f = "<p>你有未提交的众测报告，无法申请新产品；<br>请在“<a class='a_underline' target='_blank' href='" + smzdm_test + "/user/zhongce'>我的众测</a>”中补交报告，报告成功发布后即可正常申请。</p><div class='a_blockBox'><a class='a_redBlock lFloat' href='" + smzdm_test + "/p/" + e + "'>确&nbsp;&nbsp;定</a></div>";
                            break;
                        case 5:
                            $("#confirm_div").hide();
                            $("#cover").hide();
                            if (zhiyou_open) {
                                zhiyou_relate.popup_login_show();
                            } else {
                                popPosition("#pop-login");
                                $("#pop-login,#cover").show();
                                popClose("#pop-login");
                            }
                            g = false;
                            break;
                        case 6:
                            var f = "<p>抱歉，你的积分（或金币）不足<br><a class='small_size a_underline' target='_blank' href='" + integral_plan + "'>如何获得金币？</a></p><div class='a_blockBox'><a class='a_redBlock lFloat' href='" + smzdm_test + "/p/" + e + "'>确&nbsp;&nbsp;定</a></div>";
                            break;
                        case 7:
                            $("#captcha").focus().addClass("red_border");
                            $("#captcha_error").css("display", "block").html("验证码错误");
                            g = false;
                            break;
                        case 9:
                            var f = "<p>抱歉，你的积分（或金币）不足<br><a class='small_size a_underline' target='_blank' href='" + integral_plan + "'>如何获得积分？</a></p><div class='a_blockBox'><a class='a_redBlock lFloat' href='" + smzdm_test + "/p/" + e + "'>确&nbsp;&nbsp;定</a></div>";
                            break;
                        case 10:
                            switch (h.safe_msg.error_code) {
                            case 1:
                                $("#public_msg").html(h.safe_msg.error_msg.safepass);
                                break;
                            case 2:
                                $("#public_msg").html(h.safe_msg.error_msg.over_times);
                                break;
                            }
                            g = false;
                            break;
                        case 11:
                            var f = "<p>抱歉，申请已结束</p><div class='a_blockBox'><a class='a_redBlock lFloat' href='" + smzdm_test + "/p/" + e + "'>确&nbsp;&nbsp;定</a></div>";
                            break;
                        default:
                        }
                        if (g) {
                            if (typeof (h.error_code) != "undefined" && h.error_code == 0) {
                                $("#pop_info").hide();
                                $("#pop_share").html(f).show();
                                $("#pop_href").attr("href", i);
                                $("#pot_btn_div").show();
                            } else {
                                $("#pop_info").html(f);
                                $("#pot_btn_div").hide();
                                $("#pop_share").hide();
                            }
                            popPosition("#confirm_div");
                            popClose("#confirm_div");
                            $("#confirm_div").show();
                            $("#cover").show();
                            placehold();
                        }
                    }
                });
            }
        }
    }
}
function get_user_is_apply() {
    var b = getCookie("user");
    if (b === null) {
        return "";
    } else {
        var d = b.split("|");
        var e = $("#probation-id").val();
        var c = "smzdm_probation_apply_" + d[1];
        var g = getCookie(c);
        if (g === null) {
            return "";
        } else {
            var h = json_decode(g);
            if ($.inArray(e, h) > -1) {
                var f = $("#application-time .banner_btn .apply").prev();
                $("#application-time .banner_btn .apply").remove();
                f.after('<span class="button button_grey">已申请</span>');
                $("#qn-right .banner_btn").html('<span class="button button_grey">已申请</span>');
            }
        }
    }
}
function aply_count_down(d, c) {
    var b = parseInt($(d).html());
    if (b > 0) {
        $(d).html(b - 1);
        setTimeout(function() {
            aply_count_down(d, c);
        }, 1000);
    }
    if (b == 0) {
        if (c == "apply") {
            $("#confirm_div").hide();
            $("#cover").hide();
        }
        if (c == "go_back") {
            history.go(-1);
        }
    }
}
function submit_form() {
    var b = true;
    if ($("#captcha").val() == "") {
        $("#captcha").focus();
        $("#captcha_error").css("display", "inline-block").html("请输入验证码");
        b = false;
    } else {
        $("#captcha_error").css("display", "none");
    }
    if (b) {
        $("#company_type").removeAttr("disabled");
        $("#product_category").removeAttr("disabled");
        $("#product_status").removeAttr("disabled");
        $("#datepicker").removeAttr("disabled");
        $.ajax({
            "url": "/probation_business/ajax_apply",
            "data": $("#business_form").serialize(),
            "type": "post",
            "cache": false,
            "dataType": "json",
            "timeout": 3000,
            "success": function(d) {
                var c = "";
                if (0 == d.error_code) {
                    var c = "<p>你的报名已提交，请耐心等待联系</p>" + "<p style='text-align:center;margin-top:20px;'><a class='button button_red' href='javascript:void(0)' onclick='window.location.href=\"" + smzdm_test + "\"'>确&nbsp;&nbsp;认</a></p>" + "<p></p>";
                    $("#captcha_error").css("display", "none");
                } else {
                    if (1 == d.error_code) {
                        var c = "<p>参数错误</p>" + "<p><a class='button button_red' href='javascript:void(0)' onclick='$(\"#confirm_div\").hide();$(\"#cover\").hide();'>确&nbsp;&nbsp;认</a></p>" + "<p></p>";
                        $("#captcha_error").css("display", "none");
                    } else {
                        if (2 == d.error_code) {
                            $("#captcha").focus();
                            $("#captcha_error").css("display", "inline-block").html("验证码错误");
                        } else {
                            var c = "<p>系统错误 </p>" + "<p><a class='button button_red' href='javascript:void(0)' onclick='$(\"#confirm_div\").hide();$(\"#cover\").hide();'>确&nbsp;&nbsp;认</a></p>" + "<p></p>";
                            $("#captcha_error").css("display", "none");
                        }
                    }
                }
                if (c != "") {
                    $("#pop_info").html(c);
                    $("#confirm_div .pop_name").html("小提示");
                    popPosition("#confirm_div");
                    $("#confirm_div").show();
                    $("#cover").show();
                    if (0 == d.error_code) {
                        $(".pop-close").click(function() {
                            window.location.href = smzdm_test;
                        });
                    }
                }
            }
        });
    }
}
function confirm_submit() {
    var b = true;
    if ($.trim($("#company_name").val()) == "") {
        $("#company_name").focus();
        $("#company_name_error").css("display", "inline-block").html("请输入公司名称");
        b = false;
    } else {
        $("#company_name_error").css("display", "none");
    }
    if ($.trim($("#product_brand").val()) == "") {
        $("#product_brand").focus();
        $("#product_brand_error").css("display", "inline-block").html("请输入品牌");
        b = false;
    } else {
        $("#product_brand_error").css("display", "none");
    }
    if ($("#product_name").val() == "") {
        $("#product_name").focus();
        $("#product_brand_error").css("display", "inline-block").html("请输入产品名称");
        b = false;
    } else {
        $("#product_brand_error").css("display", "none");
    }
    if ($("#provide_num").val() == "" || $("#provide_num").val() <= 0 || isNaN($("#provide_num").val())) {
        $("#provide_num").focus();
        $("#provide_num_error").css("display", "inline-block").html("请输入送测数量");
        b = false;
    } else {
        $("#provide_num_error").css("display", "none");
    }
    if ($("#sale_price").val() == "" || $("#sale_price").val() < 0 || isNaN($("#sale_price").val())) {
        $("#sale_price").focus();
        $("#sale_price_error").css("display", "inline-block").html("请输入销售价格");
        b = false;
    } else {
        $("#sale_price_error").css("display", "none");
    }
    if ($("#contact").val() == "") {
        $("#contact").focus();
        $("#contact_error").css("display", "inline-block").html("请输入联系人");
        b = false;
    } else {
        $("#contact_error").css("display", "none");
    }
    if ($("#email").val() == "") {
        $("#email").focus();
        $("#email_error").css("display", "inline-block").html("请输入Email");
        b = false;
    } else {
        if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($("#email").val()) == false) {
            $("#email").focus();
            $("#email_error").css("display", "inline-block").html("邮箱格式不正确，请重新填写");
            b = false;
        } else {
            $("#email_error").css("display", "none");
        }
    }
    if ($("#contact_phone").val() == "") {
        $("#contact_phone").focus();
        $("#contact_phone_error").css("display", "inline-block").html("请输入联系电话");
        b = false;
    } else {
        $("#contact_phone_error").css("display", "none");
    }
    if ($("#buy_url").val() == "") {
        $("#buy_url").focus();
        $("#buy_url_error").css("display", "inline-block").html("请输入购买链接");
        b = false;
    } else {
        $("#buy_url_error").css("display", "none");
    }
    if ($("#logo_pic_url").val() == "") {
        $("#un-order-img-warn").css("display", "inline-block").html("请上传商家LOGO");
        b = false;
    } else {
        $("#logo_pic_url_error").css("display", "none");
    }
    if ($.trim($("#remark").val()) == "") {
        $("#remark").focus();
        $("#remark_error").css("display", "inline-block").html("请输入商品介绍");
        b = false;
    } else {
        $("#remark_error").css("display", "none");
    }
    if (b) {
        $("#captcha_div").css("display", "block");
        $("#read_div").css("display", "block");
        $("#form_back").css("display", "");
        $("#company_name").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#product_brand").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#product_name").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#product_status").removeClass("input_style").addClass("input_style_disabled").attr("disabled", "disabled");
        $("#product_category").removeClass("input_style").addClass("input_style_disabled").attr("disabled", "disabled");
        $("#company_type").removeClass("input_style").addClass("input_style_disabled").attr("disabled", "disabled");
        $("#provide_num").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#sale_price").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#datepicker").removeClass("input_style").addClass("input_style_disabled").attr("disabled", "disabled");
        $("#contact").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#email").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#contact_phone").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#remark").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#buy_url").removeClass("input_style").addClass("input_style_disabled").attr("readonly", "readonly");
        $("#fileToUpload").removeClass("input_style").addClass("input_style_disabled").attr("disabled", "disabled");
        $("#btn_submit").attr("onclick", "submit_form()");
    }
}
function form_back() {
    $("#captcha_div").css("display", "none");
    $("#read_div").css("display", "none");
    $("#form_back").css("display", "none");
    $("#company_name").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#product_brand").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#product_name").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#product_status").addClass("input_style").removeClass("input_style_disabled").removeAttr("disabled");
    $("#product_category").addClass("input_style").removeClass("input_style_disabled").removeAttr("disabled");
    $("#company_type").addClass("input_style").removeClass("input_style_disabled").removeAttr("disabled");
    $("#provide_num").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#sale_price").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#datepicker").addClass("input_style").removeClass("input_style_disabled").removeAttr("disabled");
    $("#contact").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#email").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#contact_phone").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#remark").addClass("input_style").removeClass("input_style_disabled").removeAttr("readonly");
    $("#btn_submit").attr("onclick", "confirm_submit()");
    $("#label_read").html("我已阅读用户须知");
}
function ajax_collect(article_id, channel, obj) {
    if (!collect_status) {
        popUp("", "#pop-closed", "服务器君奔赴双11前线，家里没余粮，收藏君悲痛欲绝自挂东南枝了。");
        return;
    }
    if (zhiyou_open) {
        if (channel == 7) {
            channel = 8;
        } else {
            if (channel == 8) {
                channel = 7;
            }
        }
        zhiyou_relate.add_favorite(article_id, channel, obj);
        return;
    }
    var collection_uri = "";
    if (channel == 2) {
        var url = smzdm_faxian;
        collection_uri = faxian_collection;
    } else {
        if (channel == 3) {
            var url = smzdm_show;
            collection_uri = show_collection;
        } else {
            if (channel == 4) {
                var url = smzdm_jingyan;
                collection_uri = jingyan_collection;
            } else {
                if (channel == 5) {
                    var url = smzdm_haitao;
                    collection_uri = haitao_collection;
                } else {
                    if (channel == 6) {
                        var url = smzdm_news;
                        collection_uri = news_collection;
                    } else {
                        if (channel == 7 || channel == 8) {
                            var url = smzdm_test;
                            collection_uri = test_collection;
                        } else {
                            var url = smzdm_www;
                            collection_uri = youhui_collection;
                        }
                    }
                }
            }
        }
    }
    $.ajax({
        url: "/ajax_collect",
        type: "post",
        data: "article_id=" + article_id + "&channel=" + channel,
        dataType: "json",
        success: function(data) {
            var d = eval(data);
            if (d.error_code == 0) {
                if (collection_uri) {
                    $("#pop-collect .pop_info_show a:first").attr("href", collection_uri);
                }
                popPosition("#pop-collect");
                $("#pop-collect").show();
                $("#cover").show();
                popClose("#pop-collect");
                $("a[id='collect_" + channel + "_" + article_id + "']").each(function() {
                    $(this).attr("class", "fav current");
                    $(this).find("em").html(Number($(this).find("em").html()) + 1);
                });
                popUp("", "#pop-collect", "");
            } else {
                if (d.error_code == 2) {
                    if (collection_uri) {
                        $("#pop-nocollect .pop_info_show a:first").attr("href", collection_uri);
                    }
                    popPosition("#pop-nocollect");
                    $("#pop-nocollect").show();
                    $("#cover").show();
                    popClose("#pop-nocollect");
                    $("a[id='collect_" + channel + "_" + article_id + "']").each(function() {
                        $(this).attr("class", "fav");
                        $(this).find("em").html(Number($(this).find("em").html()) - 1);
                    });
                    popUp("", "#pop-nocollect", "");
                } else {
                    if (d.error_code == 5) {
                        if (zhiyou_open) {
                            zhiyou_relate.popup_login_show();
                        } else {
                            if (zhiyou_open) {
                                zhiyou_relate.popup_login_show();
                            } else {
                                popPosition("#pop-login");
                                $("#pop-login,#cover").show();
                                popClose("#pop-login");
                            }
                        }
                    } else {
                        if (d.error_code == 6) {
                            popUp("", "#pop-closed", "服务器君奔赴双11前线，家里没余粮，收藏君悲痛欲绝自挂东南枝了。");
                        } else {}
                    }
                }
            }
            return;
        }
    });
}
function set_collect_current() {
    if (zhiyou_open) {
        zhiyou_relate.init_favorite_by_cookie();
        return;
    }
    $(".fav").each(function() {
        var g = $(this).attr("id");
        if (typeof (g) != "undefined") {
            var c = g.split("_");
            var e = c[2];
            var d = c[1];
            if (d == 8) {
                var b = getCookie("smzdm_collection_test_probation");
            } else {
                var b = getCookie("smzdm_collection_test");
            }
            if (b != null) {
                var f = b.split(",");
                if ((d == 7 || d == 8) && $.inArray(e, f) > -1) {
                    $(this).attr("class", "fav current");
                }
            }
        }
    });
}
function ajax_love(article_id, channel, obj) {
    if (zhiyou_open) {
        var rating = 1;
        if (channel == 7) {
            channel = 8;
        } else {
            if (channel == 8) {
                channel = 7;
            }
        }
        zhiyou_relate.add_rating("zan", article_id, channel, rating, obj);
        return;
    }
    if (channel == 2) {
        var url = smzdm_faxian;
    } else {
        if (channel == 3) {
            var url = smzdm_show;
        } else {
            if (channel == 4) {
                var url = smzdm_jingyan;
            } else {
                if (channel == 6) {
                    var url = smzdm_news;
                } else {
                    if (channel == 7) {
                        var url = smzdm_test;
                    }
                }
            }
        }
    }
    $.ajax({
        url: "/ajax_love",
        type: "post",
        data: "article_id=" + article_id + "&channel=" + channel,
        dataType: "json",
        success: function(data) {
            var d = eval(data);
            if (d.error_code == 0) {} else {
                if (d.error_code == 2) {} else {
                    if (d.error_code == 6) {} else {}
                }
            }
            $(obj).find("span.addNumber").fadeIn().animate({
                top: "-35px"
            }, "normal").fadeOut(300);
            $(obj).attr("class", "zan current");
            scored("#details-zan", "current");
            if ($(obj).find("em").length > 0) {
                $(obj).find("em").html(Number($(obj).find("em").html()) + 1);
                $(obj).find("span.scoreAnimate").fadeIn().animate({
                    top: "-35px"
                }, "normal").fadeOut(300);
            } else {
                if ($(obj).parents(".show_exp_zan").find("em").length > 0) {
                    $(obj).parents(".show_exp_zan").find("em").html(Number($(obj).parents(".show_exp_zan").find("em").html()) + 1);
                } else {
                    $(obj).parents(".show_exp_zan").find(".grey").html("已有<em>1</em>人赞过");
                }
            }
            $(obj).removeAttr("onclick");
            $(obj).css("cursor", "default");
            return;
        }
    });
}
function set_loverating_current() {
    if (zhiyou_open) {
        zhiyou_relate.init_rating_by_cookie();
        return;
    }
    $(".zan").each(function() {
        var g = $(this).attr("id");
        if (typeof (g) != "undefined") {
            var c = g.split("_");
            var e = c[3];
            var d = c[2];
            var b = getCookie("smzdm_loverating_test");
            if (b != null) {
                var f = b.split(",");
                if (d == 7 && $.inArray(e, f) > -1) {
                    $(this).attr("class", "zan current");
                    $(this).removeAttr("onclick");
                    $(this).css("cursor", "default");
                }
            }
        }
    });
}
function tab(b, c, d, e) {
    if (e == "click") {
        $(b).click(function() {
            $(this).addClass(d).siblings().removeClass(d);
            $(c).hide().eq($(b).index(this)).show();
        });
    } else {
        if (e == "hover") {
            $(b).mouseover(function() {
                $(this).addClass(d).siblings().removeClass(d);
                $(c).hide().eq($(b).index(this)).show();
            });
        }
    }
}
function openClose(c, b, g) {
    if (g == "mallNav") {
        $(c).click(function() {
            $(this).prev().css("height", "auto");
            $(this).hide();
            $(this).next("a").show();
        });
        $(b).click(function() {
            $(this).parent().find("ul").css("height", "64px");
            $(this).hide();
            $(this).prev("a").show();
        });
    } else {
        if (g == "comments") {
            var f = $("blockquote").length;
            for (var d = 0; d < f; d++) {
                var e = $(c).prev(".comment_con").eq(d).height();
                if (parseInt($(c).prev(".comment_con").eq(d).height()) > 120) {
                    $(c).prev(".comment_con").eq(d).height(120);
                    $(c).eq(d).css("display", "block");
                } else {
                    $(c).eq(d).css("display", "none");
                }
            }
            $(c).click(function() {
                $(this).prev().css({
                    "height": "auto",
                    "max-height": "100%"
                });
                $(this).hide();
            });
        }
    }
}
(function(f) {
    if (f.browser) {
        return;
    }
    f.browser = {};
    f.browser.mozilla = false;
    f.browser.webkit = false;
    f.browser.opera = false;
    f.browser.msie = false;
    var e = navigator.userAgent;
    f.browser.name = navigator.appName;
    f.browser.fullVersion = "" + parseFloat(navigator.appVersion);
    f.browser.majorVersion = parseInt(navigator.appVersion, 10);
    var b,
        d,
        c;
    if ((d = e.indexOf("Opera")) != -1) {
        f.browser.opera = true;
        f.browser.name = "Opera";
        f.browser.fullVersion = e.substring(d + 6);
        if ((d = e.indexOf("Version")) != -1) {
            f.browser.fullVersion = e.substring(d + 8);
        }
    } else {
        if ((d = e.indexOf("MSIE")) != -1) {
            f.browser.msie = true;
            f.browser.name = "Microsoft Internet Explorer";
            f.browser.fullVersion = e.substring(d + 5);
        } else {
            if ((d = e.indexOf("Chrome")) != -1) {
                f.browser.webkit = true;
                f.browser.name = "Chrome";
                f.browser.fullVersion = e.substring(d + 7);
            } else {
                if ((d = e.indexOf("Safari")) != -1) {
                    f.browser.webkit = true;
                    f.browser.name = "Safari";
                    f.browser.fullVersion = e.substring(d + 7);
                    if ((d = e.indexOf("Version")) != -1) {
                        f.browser.fullVersion = e.substring(d + 8);
                    }
                } else {
                    if ((d = e.indexOf("Firefox")) != -1) {
                        f.browser.mozilla = true;
                        f.browser.name = "Firefox";
                        f.browser.fullVersion = e.substring(d + 8);
                    } else {
                        if ((b = e.lastIndexOf(" ") + 1) < (d = e.lastIndexOf("/"))) {
                            f.browser.name = e.substring(b, d);
                            f.browser.fullVersion = e.substring(d + 1);
                            if (f.browser.name.toLowerCase() == f.browser.name.toUpperCase()) {
                                f.browser.name = navigator.appName;
                            }
                        }
                    }
                }
            }
        }
    }
    if ((c = f.browser.fullVersion.indexOf(";")) != -1) {
        f.browser.fullVersion = f.browser.fullVersion.substring(0, c);
    }
    if ((c = f.browser.fullVersion.indexOf(" ")) != -1) {
        f.browser.fullVersion = f.browser.fullVersion.substring(0, c);
    }
    f.browser.majorVersion = parseInt("" + f.browser.fullVersion, 10);
    if (isNaN(f.browser.majorVersion)) {
        f.browser.fullVersion = "" + parseFloat(navigator.appVersion);
        f.browser.majorVersion = parseInt(navigator.appVersion, 10);
    }
    f.browser.version = f.browser.majorVersion;
})(jQuery);
$.fn.boxy = function(b) {
    b = b || {};
    return this.each(function() {
        var d = this.nodeName.toLowerCase(),
            c = this;
        if (d == "a") {
            $(this).click(function() {
                var i = Boxy.linkedTo(this),
                    f = this.getAttribute("href"),
                    h = $.extend({
                        actuator: this,
                        title: this.title
                    }, b);
                if (f.match(/(&|\?)boxy\.modal/)) {
                    h.modal = true;
                }
                if (i) {
                    i.show();
                } else {
                    if (f.indexOf("#") >= 0) {
                        var g = $(f.substr(f.indexOf("#"))),
                            e = g.clone(true);
                        g.remove();
                        h.unloadOnHide = false;
                        new Boxy(e, h);
                    } else {
                        if (f.match(/\.(jpe?g|png|gif|bmp)($|\?)/i)) {
                            h.unloadOnHide = true;
                            Boxy.loadImage(this.href, h);
                        } else {
                            if (!h.cache) {
                                h.unloadOnHide = true;
                            }
                            Boxy.load(this.href, h);
                        }
                    }
                }
                return false;
            });
        } else {
            if (d == "form") {
                $(this).bind("submit.boxy", function() {
                    Boxy.confirm(b.message || "Please confirm:", function() {
                        $(c).unbind("submit.boxy").submit();
                    });
                    return false;
                });
            }
        }
    });
};
function Boxy(c, b) {
    this.boxy = $(Boxy.WRAPPER);
    $.data(this.boxy[0], "boxy", this);
    this.visible = false;
    this.options = $.extend({}, Boxy.DEFAULTS, b || {});
    if (this.options.modal) {
        this.options = $.extend(this.options, {
            center: true,
            draggable: false
        });
    }
    if (this.options.actuator) {
        $.data(this.options.actuator, "active.boxy", this);
    }
    this.setContent(c || "<div></div>");
    this._setupTitleBar();
    this.boxy.css("display", "none").appendTo(document.body);
    this.toTop();
    if (this.options.fixed) {
        if (Boxy.IE6) {
            this.options.fixed = false;
        } else {
            this.boxy.addClass("fixed");
        }
    }
    if (this.options.center && Boxy._u(this.options.x, this.options.y)) {
        this.center();
    } else {
        this.moveTo(Boxy._u(this.options.x) ? Boxy.DEFAULT_X : this.options.x, Boxy._u(this.options.y) ? Boxy.DEFAULT_Y : this.options.y);
    }
    if (this.options.show) {
        this.show();
    }
}
Boxy.EF = function() {};
$.extend(Boxy, {
    WRAPPER: "<table cellspacing='0' cellpadding='0' border='0' class='boxy-wrapper'>" + "<tr><td class='boxy-top-left'></td><td class='boxy-top'></td><td class='boxy-top-right'></td></tr>" + "<tr><td class='boxy-left'></td><td class='boxy-inner'></td><td class='boxy-right'></td></tr>" + "<tr><td class='boxy-bottom-left'></td><td class='boxy-bottom'></td><td class='boxy-bottom-right'></td></tr>" + "</table>",
    DEFAULTS: {
        title: null,
        closeable: true,
        draggable: true,
        clone: false,
        actuator: null,
        center: true,
        show: true,
        modal: false,
        fixed: true,
        closeText: "",
        unloadOnHide: false,
        clickToFront: false,
        behaviours: Boxy.EF,
        afterDrop: Boxy.EF,
        afterShow: Boxy.EF,
        afterHide: Boxy.EF,
        beforeUnload: Boxy.EF,
        hideFade: false,
        hideShrink: "vertical"
    },
    IE6: ($.browser.msie && $.browser.version < 7),
    DEFAULT_X: 50,
    DEFAULT_Y: 50,
    MODAL_OPACITY: 0.7,
    zIndex: 1337,
    dragConfigured: false,
    resizeConfigured: false,
    dragging: null,
    load: function(c, b) {
        b = b || {};
        var d = {
            url: c,
            type: "GET",
            dataType: "html",
            cache: false,
            success: function(e) {
                e = $(e);
                if (b.filter) {
                    e = $(b.filter, e);
                }
                new Boxy(e, b);
            }
        };
        $.each(["type", "cache"], function() {
            if (this in b) {
                d[this] = b[this];
                delete b[this];
            }
        });
        $.ajax(d);
    },
    loadImage: function(d, c) {
        var b = new Image();
        b.onload = function() {
            new Boxy($('<div class="boxy-image-wrapper"/>').append(this), c);
        };
        b.src = d;
    },
    get: function(b) {
        var c = $(b).parents(".boxy-wrapper");
        return c.length ? $.data(c[0], "boxy") : null;
    },
    linkedTo: function(b) {
        return $.data(b, "active.boxy");
    },
    alert: function(c, d, b) {
        return Boxy.ask(c, ["确定"], d, b);
    },
    tips: function(c) {
        var b = arguments[1] ? arguments[1] : 0;
        return Boxy.ask(c, [], function() {}, {
            "title": "小提示",
            "draggable": true,
            "closeable": true,
            "afterShow": function() {
                if (b) {
                    setTimeout("Boxy.get($('.answers')).hide();", b);
                }
            }
        });
    },
    confirm: function(f, g, c, d) {
        var e,
            b;
        if (!d) {
            e = "确定";
            b = "取消";
        } else {
            e = d.OK;
            b = d.Cancel;
        }
        return Boxy.ask(f, [e, b], function(h) {
            if (h == e) {
                g();
            }
        }, c);
    },
    confirmMore: function(g, h, f, c, d) {
        var e,
            b;
        if (!d) {
            e = "确定";
            b = "取消";
        } else {
            e = d.OK;
            b = d.Cancel;
        }
        return Boxy.ask(g, [e, b], function(i) {
            if (i == e) {
                h();
            }
            if (i == b) {
                f();
            }
        }, c);
    },
    ask: function(c, f, g, d) {
        d = $.extend({
            modal: true,
            closeable: false
        }, d || {}, {
            show: true,
            unloadOnHide: true
        });
        var b = $("<div></div>").append($('<div class="question"></div>').html(c));
        var e = $('<form class="answers"></form>');
        e.html($.map(Boxy._values(f), function(i) {
            var h = "";
            if ("确定" == i) {
                h = " boxy_ok";
            } else {
                if ("取消" == i) {
                    h = " boxy_cancel";
                }
            }
            return "<input type='button' class='boxy_button" + h + "' value='" + i + "' />";
        }).join(" "));
        $("input[type=button]", e).click(function() {
            var h = this;
            Boxy.get(this).hide(function() {
                if (g) {
                    $.each(f, function(j, k) {
                        if (k == h.value) {
                            g(f instanceof Array ? k : j);
                            return false;
                        }
                    });
                }
            });
        });
        b.append(e);
        new Boxy(b, d);
    },
    isModalVisible: function() {
        return $(".boxy-modal-blackout").length > 0;
    },
    _u: function() {
        for (var b = 0; b < arguments.length; b++) {
            if (typeof arguments[b] != "undefined") {
                return false;
            }
        }
        return true;
    },
    _values: function(c) {
        if (c instanceof Array) {
            return c;
        }
        var d = [];
        for (var b in c) {
            d.push(c[b]);
        }
        return d;
    },
    _handleResize: function(b) {
        $(".boxy-modal-blackout").css("display", "none").css(Boxy._cssForOverlay()).css("display", "block");
    },
    _handleDrag: function(b) {
        var c;
        if (c = Boxy.dragging) {
            c[0].boxy.css({
                left: b.pageX - c[1],
                top: b.pageY - c[2]
            });
        }
    },
    _nextZ: function() {
        return Boxy.zIndex++;
    },
    _viewport: function() {
        var f = document.documentElement,
            c = document.body,
            e = window;
        return $.extend($.browser.msie ? {
            left: c.scrollLeft || f.scrollLeft,
            top: c.scrollTop || f.scrollTop
        } : {
            left: e.pageXOffset,
            top: e.pageYOffset
        }, !Boxy._u(e.innerWidth) ? {
            width: e.innerWidth,
            height: e.innerHeight
        } : (!Boxy._u(f) && !Boxy._u(f.clientWidth) && f.clientWidth != 0 ? {
            width: f.clientWidth,
            height: f.clientHeight
        } : {
            width: c.clientWidth,
            height: c.clientHeight
        }));
    },
    _setupModalResizing: function() {
        if (!Boxy.resizeConfigured) {
            var b = $(window).resize(Boxy._handleResize);
            if (Boxy.IE6) {
                b.scroll(Boxy._handleResize);
            }
            Boxy.resizeConfigured = true;
        }
    },
    _cssForOverlay: function() {
        if (Boxy.IE6) {
            return Boxy._viewport();
        } else {
            return {
                width: "100%",
                height: $(document).height()
            };
        }
    }
});
Boxy.prototype = {
    estimateSize: function() {
        this.boxy.css({
            visibility: "hidden",
            display: "block"
        });
        var b = this.getSize();
        this.boxy.css("display", "none").css("visibility", "visible");
        return b;
    },
    getSize: function() {
        return [this.boxy.width(), this.boxy.height()];
    },
    getContentSize: function() {
        var b = this.getContent();
        return [b.width(), b.height()];
    },
    getPosition: function() {
        var c = this.boxy[0];
        return [c.offsetLeft, c.offsetTop];
    },
    getCenter: function() {
        var c = this.getPosition();
        var b = this.getSize();
        return [Math.floor(c[0] + b[0] / 2), Math.floor(c[1] + b[1] / 2)];
    },
    getInner: function() {
        return $(".boxy-inner", this.boxy);
    },
    getContent: function() {
        return $(".boxy-content", this.boxy);
    },
    setContent: function(b) {
        b = $(b).css({
            display: "block"
        }).addClass("boxy-content");
        if (this.options.clone) {
            b = b.clone(true);
        }
        this.getContent().remove();
        this.getInner().append(b);
        this._setupDefaultBehaviours(b);
        this.options.behaviours.call(this, b);
        return this;
    },
    moveTo: function(b, c) {
        this.moveToX(b).moveToY(c);
        return this;
    },
    moveToX: function(b) {
        if (typeof b == "number") {
            this.boxy.css({
                left: b
            });
        } else {
            this.centerX();
        }
        return this;
    },
    moveToY: function(b) {
        if (typeof b == "number") {
            this.boxy.css({
                top: b
            });
        } else {
            this.centerY();
        }
        return this;
    },
    centerAt: function(b, d) {
        var c = this[this.visible ? "getSize" : "estimateSize"]();
        if (typeof b == "number") {
            this.moveToX(b - c[0] / 2);
        }
        if (typeof d == "number") {
            this.moveToY(d - c[1] / 2);
        }
        return this;
    },
    centerAtX: function(b) {
        return this.centerAt(b, null);
    },
    centerAtY: function(b) {
        return this.centerAt(null, b);
    },
    center: function(c) {
        var b = Boxy._viewport();
        var d = this.options.fixed ? [0, 0] : [b.left, b.top];
        if (!c || c == "x") {
            this.centerAt(d[0] + b.width / 2, null);
        }
        if (!c || c == "y") {
            this.centerAt(null, d[1] + b.height / 2);
        }
        return this;
    },
    centerX: function() {
        return this.center("x");
    },
    centerY: function() {
        return this.center("y");
    },
    resize: function(c, b, e) {
        if (!this.visible) {
            return;
        }
        var d = this._getBoundsForResize(c, b);
        this.boxy.css({
            left: d[0],
            top: d[1]
        });
        this.getContent().css({
            width: d[2],
            height: d[3]
        });
        if (e) {
            e(this);
        }
        return this;
    },
    tween: function(d, b, f) {
        if (!this.visible) {
            return;
        }
        var e = this._getBoundsForResize(d, b);
        var c = this;
        this.boxy.stop().animate({
            left: e[0],
            top: e[1]
        });
        this.getContent().stop().animate({
            width: e[2],
            height: e[3]
        }, function() {
            if (f) {
                f(c);
            }
        });
        return this;
    },
    isVisible: function() {
        return this.visible;
    },
    show: function() {
        if (this.visible) {
            return;
        }
        if (this.options.modal) {
            var b = this;
            Boxy._setupModalResizing();
            this.modalBlackout = $('<div class="boxy-modal-blackout"></div>').css($.extend(Boxy._cssForOverlay(), {
                zIndex: Boxy._nextZ(),
                opacity: Boxy.MODAL_OPACITY
            })).appendTo(document.body);
            this.toTop();
            if (this.options.closeable) {
                $(document.body).bind("keypress.boxy", function(c) {
                    var d = c.which || c.keyCode;
                    if (d == 27) {
                        b.hide();
                        $(document.body).unbind("keypress.boxy");
                    }
                });
            }
        }
        this.getInner().stop().css({
            width: "",
            height: ""
        });
        this.boxy.stop().css({
            opacity: 1
        }).show();
        this.visible = true;
        this.boxy.find(".close:first").focus();
        this._fire("afterShow");
        return this;
    },
    hide: function(h) {
        if (!this.visible) {
            return;
        }
        var d = this;
        if (this.options.modal) {
            $(document.body).unbind("keypress.boxy");
            this.modalBlackout.animate({
                opacity: 0
            }, function() {
                $(this).remove();
            });
        }
        var g = {
                boxy: {},
                inner: {}
            },
            f = 0,
            b = function() {
                d.boxy.css({
                    display: "none"
                });
                d.visible = false;
                d._fire("afterHide");
                if (h) {
                    h(d);
                }
                if (d.options.unloadOnHide) {
                    d.unload();
                }
            };
        if (this.options.hideShrink) {
            var c = this.getInner(),
                e = this.options.hideShrink,
                i = this.getPosition();
            f |= 1;
            if (e === true || e == "vertical") {
                g.inner.height = 0;
                g.boxy.top = i[1] + c.height() / 2;
            }
            if (e === true || e == "horizontal") {
                g.inner.width = 0;
                g.boxy.left = i[0] + c.width() / 2;
            }
        }
        if (this.options.hideFade) {
            f |= 2;
            g.boxy.opacity = 0;
        }
        if (f) {
            if (f & 1) {
                c.stop().animate(g.inner, 0);
            }
            this.boxy.stop().animate(g.boxy, 0, b);
        } else {
            b();
        }
        return this;
    },
    toggle: function() {
        this[this.visible ? "hide" : "show"]();
        return this;
    },
    hideAndUnload: function(b) {
        this.options.unloadOnHide = true;
        this.hide(b);
        return this;
    },
    unload: function() {
        this._fire("beforeUnload");
        this.boxy.remove();
        if (this.options.actuator) {
            $.data(this.options.actuator, "active.boxy", false);
        }
    },
    toTop: function() {
        this.boxy.css({
            zIndex: Boxy._nextZ()
        });
        return this;
    },
    getTitle: function() {
        return $("> .title-bar h2", this.getInner()).html();
    },
    setTitle: function(b) {
        $("> .title-bar h2", this.getInner()).html(b);
        return this;
    },
    _getBoundsForResize: function(d, b) {
        var c = this.getContentSize();
        var f = [d - c[0], b - c[1]];
        var e = this.getPosition();
        return [Math.max(e[0] - f[0] / 2, 0), Math.max(e[1] - f[1] / 2, 0), d, b];
    },
    _setupTitleBar: function() {
        if (this.options.title) {
            var c = this;
            var b = $("<div class='title-bar'></div>").html("<h2>" + this.options.title + "</h2>");
            if (this.options.closeable) {
                b.append($("<hr><a href='#' class='close'></a>").html(this.options.closeText));
            }
            if (this.options.draggable) {
                b[0].onselectstart = function() {
                    return false;
                };
                b[0].unselectable = "on";
                b[0].style.MozUserSelect = "none";
                if (!Boxy.dragConfigured) {
                    $(document).mousemove(Boxy._handleDrag);
                    Boxy.dragConfigured = true;
                }
                b.mousedown(function(d) {
                    c.toTop();
                    Boxy.dragging = [c, d.pageX - c.boxy[0].offsetLeft, d.pageY - c.boxy[0].offsetTop];
                    $(this).addClass("dragging");
                }).mouseup(function() {
                    $(this).removeClass("dragging");
                    Boxy.dragging = null;
                    c._fire("afterDrop");
                });
            }
            this.getInner().prepend(b);
            this._setupDefaultBehaviours(b);
        }
    },
    _setupDefaultBehaviours: function(b) {
        var c = this;
        if (this.options.clickToFront) {
            b.click(function() {
                c.toTop();
            });
        }
        $(".close", b).click(function() {
            c.hide();
            return false;
        }).mousedown(function(d) {
            d.stopPropagation();
        });
    },
    _fire: function(b) {
        this.options[b].call(this);
    }
};
function getBooInCookieArr2(f, e) {
    var d = getCookie(f);
    if (d) {
        var b = json_decode(d);
        if (b) {
            for (var c in b) {
                if (b[c] && b[c][0] && b[c][0] == e) {
                    return true;
                }
            }
        }
    }
    return false;
}
function setCookieArr2(m, f, e, p, r, k, c) {
    var g = getCookie(m);
    var b;
    if (g) {
        b = json_decode(g);
    }
    if (b) {
        var d = b.length;
        if (d >= cookie_length_limit) {
            var o = new Array();
            b[cookie_length_limit] = new Array();
            b[cookie_length_limit][0] = f;
            b[cookie_length_limit][1] = e;
            for (var l in b) {
                if (l <= d - 1) {
                    var h = parseInt(l) + 1;
                    o[l] = b[h.toString()];
                }
            }
            b = o;
        } else {
            b[d] = new Array();
            b[d][0] = f;
            b[d][1] = e;
        }
    } else {
        var b = new Array();
        b[0] = new Array();
        b[0][0] = f;
        b[0][1] = e;
    }
    var q = json_encode(b);
    p = p ? p : 604800;
    setCookie(m, q, p, r, k, c);
    return;
}
function json_encode(f) {
    var c = this.window.JSON;
    if (typeof c === "object" && typeof c.stringify === "function") {
        return c.stringify(f);
    }
    var d = f;
    var b = function(g) {
        var i = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var h = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        };
        i.lastIndex = 0;
        return i.test(g) ? '"' + g.replace(i, function(j) {
            var k = h[j];
            return typeof k === "string" ? k : "\\u" + ("0000" + j.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + g + '"';
    };
    var e = function(s, o) {
        var q = "";
        var h = "    ";
        var l = 0;
        var j = "";
        var t = "";
        var g = 0;
        var p = q;
        var m = [];
        var r = o[s];
        if (r && typeof r === "object" && typeof r.toJSON === "function") {
            r = r.toJSON(s);
        }
        switch (typeof r) {
        case "string":
            return b(r);
        case "number":
            return isFinite(r) ? String(r) : "null";
        case "boolean":
        case "null":
            return String(r);
        case "object":
            if (!r) {
                return "null";
            }
            q += h;
            m = [];
            if (Object.prototype.toString.apply(r) === "[object Array]") {
                g = r.length;
                for (l = 0; l < g; l += 1) {
                    m[l] = e(l, r) || "null";
                }
                t = m.length === 0 ? "[]" : q ? "[\n" + q + m.join(",\n" + q) + "\n" + p + "]" : "[" + m.join(",") + "]";
                q = p;
                return t;
            }
            for (j in r) {
                if (Object.hasOwnProperty.call(r, j)) {
                    t = e(j, r);
                    if (t) {
                        m.push(b(j) + (q ? ": " : ":") + t);
                    }
                }
            }
            t = m.length === 0 ? "{}" : q ? "{\n" + q + m.join(",\n" + q) + "\n" + p + "}" : "{" + m.join(",") + "}";
            q = p;
            return t;
        }
    };
    return e("", {
        "": d
    });
}
function del_user_report(c) {
    if (c) {
        var b = "<p>确认删除？</p>" + "<p><a class='button button_red' href='javascript:void(0)' onclick='delete_ajax(" + c + ")'>确&nbsp;&nbsp;认</a></p>" + "<p></p>";
        $("#pop_info").html(b);
        $("#confirm_div .pop_name").html("小提示");
        popPosition("#confirm_div");
        $("#confirm_div").show();
        $("#cover").show();
        popClose("#confirm_div");
    }
    return false;
}
function delete_ajax(b) {
    $.ajax({
        type: "POST",
        url: "/ajax_delete_report",
        data: {
            report_id: b
        },
        dataType: "json",
        success: function(d) {
            if (d.error_code == 0) {
                window.location.reload();
            } else {
                var c = "<p>系统错误，请稍后重试！</p>" + "<p><a class='button button_red' href='javascript:void(0)' onclick='window.location.reload()'>确&nbsp;&nbsp;认</a></p>" + "<p></p>";
                $("#pop_info").html(c);
            }
        }
    });
}
function edit_report(d, b) {
    if (d > 0 && b > 0) {
        var c = "<p>确定要编辑该评测吗？确定后，该评测将重新变为草稿状态，需要再次提交审核。</p>" + "<div class='a_blockBox'><a href='" + smzdm_test + "/p/" + d + "/edit/" + b + "' target='_blank' onclick='$(\"#confirm_div\").hide();$(\"#cover\").hide();' class='button button_red'>确&nbsp;&nbsp;认</a><a href='#' class='cancel'>取消</a></div>";
        $("#pop_info").html(c);
        $("#confirm_div .pop_name").html("小提示");
        popPosition("#confirm_div");
        $("#confirm_div").show();
        $("#cover").show();
        popClose("#confirm_div");
    }
}
function ajaxFileUpload() {
    $.ajaxFileUpload({
        url: "/ajax_logo_upload",
        secureuri: false,
        fileElementId: "fileToUpload",
        dataType: "json",
        data: {
            name: "logan",
            id: "id"
        },
        success: function(c, b) {
            if (c.error_code == 0) {
                $("#un-order-img-warn").html("");
                $("#preview").attr("src", c.file.url);
                $(".large_img").find("img").attr("src", c.file.url);
                $("#logo_pic_url").val(c.file.serialize_pic);
                $("#fileToUpload").show();
                $("#preview_wrapper").fadeIn(500);
            } else {
                if (c.error_code == 2) {} else {}
            }
            return false;
        },
        error: function(c, b, d) {
            alert(d);
            return false;
        }
    });
    return false;
}
function removePic() {
    var b = $("#preview_wrapper");
    b.hide();
    $("#fileToUpload").show();
    b.find("img:first").src = "";
    $("#logo_pic_url").val("");
    $("#preview").removeAttr("src");
    $("#un-order-img-warn").html("");
}
function menu_response() {
    $(".navBarWrap>.navBar>nav").attr("id", "header_nav");
    var e = $(window).width();
    var d = $('a[href^="http://www.smzdm.com/member/"]');
    for (var c = 0; c < d.length; c++) {
        if (e <= 680) {
            d.attr("href", "javascript:;");
            d.css("color", "#999");
        }
    }
    if (e <= 680) {
        if ($("#nav-test").length) {
            $("#nav-test").appendTo(".menu_320wrap");
            $(".menu_320 h3").show();
        }
        $("#header_nav").appendTo(".menu_320wrap");
        $("#leftLayer").remove();
        var f = $("#header_nav").find("a");
        for (var b = 0; b < f.length; b++) {
            f.eq(0).attr("href", "http://m.smzdm.com/?_ga=1.120388800.993576558.1427614431");
            f.eq(1).attr("href", "http://m.smzdm.com/youhui/?_ga=1.120388800.993576558.1427614431");
            f.eq(2).attr("href", "http://m.haitao.smzdm.com/?_ga=1.149280382.993576558.1427614431");
            f.eq(3).attr("href", "http://m.faxian.smzdm.com/");
            f.eq(4).attr("href", "http://m.post.smzdm.com/");
            f.eq(5).attr("href", "http://m.news.smzdm.com/");
        }
    }
}
function getTextLength(c) {
    var b = 0;
    var d = $(c).val().replace(/(^\s*)|(\s*$)/g, "");
    if (0 == d.length) {
        b = 0;
    } else {
        b = d.replace(/[^\x00-\xff]/g, "**").length + 1;
    }
    if (0 != b) {
        b = Math.abs(parseInt(b / 2));
    }
    return b;
}
function checkContentLength(e, d, b, f) {
    var c = getTextLength(e);
    if (c > f) {
        $(d).css("color", "red");
        $(b).html("最多输入" + f + "汉字");
    } else {
        $(d).removeAttr("style");
        $(b).html("");
    }
    $(d).html(c);
}
function banner_pages(b) {
    a = $(b).find(".slick-dots").find(".slick-active a").html();
    n = $(b).find(".slick-dots li:last a").html();
    if (a == undefined || n == undefined) {
        $(b).find(".custom_page").hide();
    } else {
        $(b).find(".custom_page").html("<em>" + a + "</em> / " + n);
    }
}
function detailQuickNav() {
    var b = $(window).scrollTop();
    var c = $("#product-nav").offset().top;
    if (b >= c) {
        $("#quick-nav").addClass("qn_move");
    } else {
        $("#quick-nav").removeClass("qn_move");
    }
}
$(function() {
    if ($("#quick-nav").length > 0 && $(window).width() > 680) {
        $(window).bind("scroll", function() {
            detailQuickNav();
        });
    }
    $(".list_testProduct_more").click(function() {
        var b = $("#per_page").val();
        $.ajax({
            type: "POST",
            url: "/json_more",
            data: {
                current_page: b
            },
            dataType: "json",
            success: function(c) {
                if (c.error_code == 0) {
                    $(".list_testProduct").append(c.list_view);
                    $("#per_page").val(c.current_page);
                    if (c.list_num <= 0) {
                        $(".list_testProduct_more").hide();
                    }
                    GetRTime();
                } else {
                    $(".list_testProduct_more").hide();
                }
            }
        });
    });
    if ($(".slider").length > 0) {
        $(".banner_page").slick({
            dots: true,
            infinite: true,
            autoplay: true,
            draggable: false,
            pauseOnHover: true,
            autoplaySpeed: 10000,
            speed: 400,
            slidesToShow: 4,
            slidesToScroll: 4
        }).on("afterChange", function() {
            banner_pages(".test_sliderWrap");
        });
        $(".zc_single-item").slick({
            dots: true,
            infinite: true,
            autoplay: true,
            draggable: false,
            pauseOnHover: true,
            autoplaySpeed: 5000,
            speed: 400,
            slidesToShow: 1,
            slidesToScroll: 1
        });
    }
    banner_pages(".test_sliderWrap");
    menu_response();
    $(window).resize(function() {
        menu_response();
    });
    $("#input_reason").keyup(function() {
        checkContentLength("#input_reason", "#reason_content_length", "", 500);
    });
    $("#plan").keyup(function() {
        checkContentLength("#plan", "#reason_content_length", "", 500);
    });
    $(".nav_320").click(function() {
        if ($(".menu_320").css("left") == "-1500px") {
            $(".menu_320").animate({
                "left": "0px"
            }, 500);
            $("#cover").show();
        }
        if ($(".menu_320").css("left") == "0px") {
            $(".menu_320").animate({
                "left": "-1500px"
            }, 500);
            $("#cover").hide();
        }
    });
    $(".icon-left").click(function() {
        $(".menu_320").animate({
            "left": "-1500px"
        }, 500);
        $("#cover").hide();
    });
    $(document).click(function() {
        if ($(".menu_320").css("left") == "0px") {
            $(".menu_320").animate({
                "left": "-1500px"
            }, 500);
            $("#cover").hide();
        }
    });
    if ($(window).width() <= 680) {
        if ($(".banner_info").length > 0) {
            $("#to-begin-time,#application-time,#end-time").remove();
        }
    }
});
function show_plan(c) {
    var b = '<p class="small_size">' + $("#title_" + c).val() + '</p>\n                    <br><p class="text_word">' + $("#evaluation_plan_" + c).val() + '</p>\n                    <div class="a_blockBox"><a class="button button_red cancel" href="JavaScript:void(0)">确认</a></div>';
    $("#confirm_div .pop_name").html("查看众测计划");
    $("#pop_info").html(b);
    popPosition("#confirm_div");
    $("#confirm_div").show();
    $("#cover").show();
    popClose("#confirm_div");
}
function write_plan(c) {
    var b = "<h4>" + $("#title_" + c).val() + '</h4>\n                   <p class="small_size" style="text-align:right;padding-right:20px"><span class="word_number"><em id="reason_content_length">0</em>/500</span></p>\n                   <p><textarea rows="8" cols="5" id="plan" class="input_style small_size width_278"></textarea></p>\n                   <div class="a_blockBox"><a class="button button_red" onclick="send_plan(' + c + ');" href="JavaScript:void(0)">确认</a> <a class="cancel" href="JavaScript:void(0)">关闭</a></div>';
    $("#confirm_div .pop_name").html("填写众测计划");
    $("#pop_info").html(b);
    popPosition("#confirm_div");
    $("#confirm_div").show();
    $("#cover").show();
    popClose("#confirm_div");
    $("#plan").keyup(function() {
        checkContentLength("#plan", "#reason_content_length", "", 500);
    });
}
function send_plan(b) {
    var c = $("#plan").val();
    if (getTextLength(plan) > 500) {
        return false;
    }
    if ($.trim(c) != "") {
        $.ajax({
            type: "POST",
            url: "/ajax_probation_plan",
            data: {
                probation_id: b,
                evaluation_plan: $.trim(c)
            },
            dataType: "json",
            success: function(d) {
                if (d.error_code == 0) {
                    $("#write_plan_" + b).css("display", "none");
                    $("#show_plan_" + b).css("display", "");
                    $("#evaluation_plan_" + b).val(c);
                    $("#confirm_div").hide();
                    $("#cover").hide();
                }
            }
        });
    } else {
        $("#pop_tip").hide();
        $("#cover").hide();
    }
}
function show_confirm_div(d, c) {
    $("#confirm_div").css("display", "block");
    if (c == "in") {
        var b = '<p id="msg_title">确认参加后，商品将发送到以下地址</p>\n                       <p>收货人姓名：<span id="name_str">' + $("#user_name").val() + '</span><input class="input_style width_103" style="display:none" id="name" value="' + $("#user_name").val() + '" /></p>\n                       <p>收货人地址：<span id="address_str">' + $("#user_address").val() + '</span><input class="input_style width_103" style="display:none" id="address" value="' + $("#user_address").val() + '" /></p>\n                       <p>邮政编码：<span id="zipcode_str">' + $("#user_zipcode").val() + '</span><input class="input_style width_103" style="display:none" id="zipcode" value="' + $("#user_zipcode").val() + '" /></p>\n                       <p>联系电话：<span id="telephone_str">' + $("#user_telephone").val() + '</span><input class="input_style width_103" style="display:none" id="telephone" value="' + $("#user_telephone").val() + '" /></p>\n                       <div class="a_blockBox">\n                          <a onclick="update_probation_ddress_confirm(' + d + ',1);" class="button button_red"  href="JavaScript:void(0)">确认</a>\n                          <a onclick="show_address_edit();" href="JavaScript:void(0)" id="edit_a">修改收货地址</a>\n                          <a class="cancel" href="JavaScript:void(0)" style="display:none" id="cancel_a">放弃修改</a>\n                       </div>';
    } else {
        var b = '<p style="text-align: center;">你真的想要放弃众测资格吗？</p>\n                       <div class="a_blockBox"><a onclick="update_probation_ddress_confirm(' + d + ',2);" class="button button_red" href="JavaScript:void(0)">放弃众测资格</a><a class="cancel" href="JavaScript:void(0)">再想想</a></div>';
    }
    $("#pop_info").html(b);
    $("#confirm_div .pop_name").html("小提示");
    popPosition("#confirm_div");
    $("#confirm_div").show();
    $("#cover").show();
    popClose("#confirm_div");
}
function show_address_edit() {
    $("#msg_title").html("点击确认，更新收货信息，确认添加众测").nextAll().addClass("mB10");
    $("#edit_a").css("display", "none");
    $("#name_str").css("display", "none");
    $("#address_str").css("display", "none");
    $("#zipcode_str").css("display", "none");
    $("#telephone_str").css("display", "none");
    $("#cancel_a").css("display", "");
    $("#name").css("display", "");
    $("#address").css("display", "");
    $("#zipcode").css("display", "");
    $("#telephone").css("display", "");
}
function ajax_probation_confirm(g, d, b, f, c, e) {
    $.ajax({
        type: "POST",
        url: "/ajax_probation_confirm",
        data: {
            probation_id: g,
            name: d,
            address: b,
            zipcode: f,
            telephone: c,
            partake: e
        },
        dataType: "json",
        success: function(h) {
            if (h.error_code == 0) {
                $("#confirm_in").css("display", "none");
                $("#confirm_out").css("display", "none");
                $("#red_right").css("display", "none");
                $("#confirm_div").hide();
                window.location.reload();
            } else {}
        }
    });
}
function update_probation_ddress_confirm(h, g) {
    if (g == 1) {
        var e = $("#name").val();
        var c = $("#address").val();
        var f = $("#zipcode").val();
        var d = $("#telephone").val();
        var b = true;
        if ("" == e) {
            alert("name");
            b = false;
        }
        if ("" == c) {
            alert("address");
            b = false;
        }
        if ("" == f) {
            alert("zipcode");
            b = false;
        }
        if ("" == d) {
            alert("telephone");
            b = false;
        }
        if (b) {
            ajax_probation_confirm(h, e, c, f, d, g);
        }
    } else {
        ajax_probation_confirm(h, "", "", "", "", g);
    }
}
function get_all_list(c) {
    var b = $("#probation-id").val();
    $.ajax({
        type: "GET",
        url: "/ajax_get_apply_all_user",
        data: {
            page: c,
            probation_id: b
        },
        dataType: "json",
        success: function(d) {
            if (d.error_code == 0) {
                $("#all_user_list").html(d.list_str);
            } else {}
        }
    });
}
function get_success_list(c) {
    var b = $("#probation-id").val();
    $.ajax({
        type: "GET",
        url: "/ajax_get_apply_success_user",
        data: {
            page: c,
            probation_id: b
        },
        dataType: "json",
        success: function(d) {
            if (d.error_code == 0) {
                $("#success_user_list").html(d.list_str);
            } else {}
        }
    });
}
function gettoday() {
    var b = new Date();
    now = b.getFullYear() + "/";
    now = now + (b.getMonth() + 1) + "/";
    now = now + b.getDate() + " ";
    now = now + b.getHours() + ":";
    now = now + b.getMinutes() + ":";
    now = now + b.getSeconds() + "";
    return now;
}
function gettodayend() {
    var b = new Date();
    end = b.getFullYear() + "/";
    end = end + (b.getMonth() + 1) + "/";
    end = end + b.getDate() + " ";
    end = end + "23:59:59";
    return end;
}
(function(d, c, b, f) {
    var e = d(c);
    d.fn.lazyload = function(g) {
        var i = this;
        var j;
        var h = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: c,
            data_attribute: "original",
            skip_invisible: false,
            appear: null,
            load: null,
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };
        function k() {
            var l = 0;
            i.each(function() {
                var m = d(this);
                if (h.skip_invisible && !m.is(":visible")) {
                    return;
                }
                if (d.abovethetop(this, h) || d.leftofbegin(this, h)) {} else {
                    if (!d.belowthefold(this, h) && !d.rightoffold(this, h)) {
                        m.trigger("appear");
                        l = 0;
                    } else {
                        if (++l > h.failure_limit) {
                            return false;
                        }
                    }
                }
            });
        }
        if (g) {
            if (f !== g.failurelimit) {
                g.failure_limit = g.failurelimit;
                delete g.failurelimit;
            }
            if (f !== g.effectspeed) {
                g.effect_speed = g.effectspeed;
                delete g.effectspeed;
            }
            d.extend(h, g);
        }
        j = (h.container === f || h.container === c) ? e : d(h.container);
        if (0 === h.event.indexOf("scroll")) {
            j.bind(h.event, function() {
                return k();
            });
        }
        this.each(function() {
            var l = this;
            var m = d(l);
            l.loaded = false;
            if (m.attr("src") === f || m.attr("src") === false) {
                if (m.is("img")) {
                    m.attr("src", h.placeholder);
                }
            }
            m.one("appear", function() {
                if (!this.loaded) {
                    if (h.appear) {
                        var o = i.length;
                        h.appear.call(l, o, h);
                    }
                    d("<img />").bind("load", function() {
                        var q = m.attr("data-" + h.data_attribute);
                        m.hide();
                        if (m.is("img")) {
                            m.attr("src", q);
                        } else {
                            m.css("background-image", "url('" + q + "')");
                        }
                        m[h.effect](h.effect_speed);
                        l.loaded = true;
                        var p = d.grep(i, function(s) {
                            return !s.loaded;
                        });
                        i = d(p);
                        if (h.load) {
                            var r = i.length;
                            h.load.call(l, r, h);
                        }
                    }).attr("src", m.attr("data-" + h.data_attribute));
                }
            });
            if (0 !== h.event.indexOf("scroll")) {
                m.bind(h.event, function() {
                    if (!l.loaded) {
                        m.trigger("appear");
                    }
                });
            }
        });
        e.bind("resize", function() {
            k();
        });
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            e.bind("pageshow", function(l) {
                if (l.originalEvent && l.originalEvent.persisted) {
                    i.each(function() {
                        d(this).trigger("appear");
                    });
                }
            });
        }
        d(b).ready(function() {
            k();
        });
        return this;
    };
    d.belowthefold = function(h, i) {
        var g;
        if (i.container === f || i.container === c) {
            g = (c.innerHeight ? c.innerHeight : e.height()) + e.scrollTop();
        } else {
            g = d(i.container).offset().top + d(i.container).height();
        }
        return g <= d(h).offset().top - i.threshold;
    };
    d.rightoffold = function(h, i) {
        var g;
        if (i.container === f || i.container === c) {
            g = e.width() + e.scrollLeft();
        } else {
            g = d(i.container).offset().left + d(i.container).width();
        }
        return g <= d(h).offset().left - i.threshold;
    };
    d.abovethetop = function(h, i) {
        var g;
        if (i.container === f || i.container === c) {
            g = e.scrollTop();
        } else {
            g = d(i.container).offset().top;
        }
        return g >= d(h).offset().top + i.threshold + d(h).height();
    };
    d.leftofbegin = function(h, i) {
        var g;
        if (i.container === f || i.container === c) {
            g = e.scrollLeft();
        } else {
            g = d(i.container).offset().left;
        }
        return g >= d(h).offset().left + i.threshold + d(h).width();
    };
    d.inviewport = function(g, h) {
        return !d.rightoffold(g, h) && !d.leftofbegin(g, h) && !d.belowthefold(g, h) && !d.abovethetop(g, h);
    };
    d.extend(d.expr[":"], {
        "below-the-fold": function(g) {
            return d.belowthefold(g, {
                threshold: 0
            });
        },
        "above-the-top": function(g) {
            return !d.belowthefold(g, {
                threshold: 0
            });
        },
        "right-of-screen": function(g) {
            return d.rightoffold(g, {
                threshold: 0
            });
        },
        "left-of-screen": function(g) {
            return !d.rightoffold(g, {
                threshold: 0
            });
        },
        "in-viewport": function(g) {
            return d.inviewport(g, {
                threshold: 0
            });
        },
        "above-the-fold": function(g) {
            return !d.belowthefold(g, {
                threshold: 0
            });
        },
        "right-of-fold": function(g) {
            return d.rightoffold(g, {
                threshold: 0
            });
        },
        "left-of-fold": function(g) {
            return !d.rightoffold(g, {
                threshold: 0
            });
        }
    });
})(jQuery, window, document);
function oncheckpage(b, c, f) {
    var e = $(f).parent().parent().find(".jumpToPage #input_num").val();
    var d = /^[1-9]+[0-9]*]*$/;
    if (d.test(e)) {
        if (e <= 0) {
            e = 1;
        }
        if (e > b) {
            e = b;
        }
        location.href = c + "1" + "#comments";
        if (e >= 1) {
            location.href = c + e + "#comments";
        }
    } else {
        alert("请输入有效数字！");
    }
    return true;
}
function addEditInterface(g) {
    if (g.attr("articleid") != undefined) {
        var e = g.attr("articleid").split("_");
        var f = parseInt(e[0]);
        var d = parseInt(e[1]);
        var b = g.find(".lrTop");
        var c = editUrlFilter(f, d);
        if (g.find(".lrTop").length == 0) {
            if (f == 2) {
                b = g.find(".itemUserInfo");
            } else {
                if (f == 3) {
                    b = g.find(".listItem");
                }
            }
        }
        b.append('<span class="edit_interface"><a href="' + c + '" target="_blank">编辑</a></span>');
    }
}
function listAddEditStart() {
    $(".list").each(function() {
        if ($(this).find(".edit_interface").length == 0) {
            addEditInterface($(this));
        }
    });
}

