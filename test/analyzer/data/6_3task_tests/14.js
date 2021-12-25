! function e(t, n, r) {
    function o(a, s) {
        if (!n[a]) {
            if (!t[a]) {
                var l = "function" == typeof require && require;
                if (!s && l) return l(a, !0);
                if (i) return i(a, !0);
                var c = new Error("Cannot find module '" + a + "'");
                throw c.code = "MODULE_NOT_FOUND", c
            }
            var u = n[a] = {
                exports: {}
            };
            t[a][0].call(u.exports, function(e) {
                var n = t[a][1][e];
                return o(n || e)
            }, u, u.exports, e, t, n, r)
        }
        return n[a].exports
    }
    for (var i = "function" == typeof require && require, a = 0; a < r.length; a++) o(r[a]);
    return o
}({
    32: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = l(e("query-string")),
            i = e("react-i18next"),
            a = l(e("../components/PlaylistCardAuto.jsx")),
            s = l(e("../components/ReactInfiniteScroll.jsx"));

        function l(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var c = function(e) {
            function t(e) {
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var n = function(e, t) {
                    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return n.loadMore = function() {
                    if (n.props.data.more && !n.state.loading) {
                        n.setState({
                            loading: !0
                        });
                        var e = n.props.data.playlists,
                            t = o.default.stringify({
                                ch_ename: KKBOX.channel.chEname,
                                terr: KKBOX.terr.toLowerCase(),
                                lang: KKBOX.locale,
                                offset: e.length,
                                limit: KKBOX.channel.playlistItemCount
                            });
                        fetch("/api/channel/playlists?" + t, {}).then(function(e) {
                            return e.json()
                        }).then(function(e) {
                            if ("okay" == e.status) {
                                var t = {};
                                (t = {
                                    more: e.data.more,
                                    playlists: n.props.data.playlists.concat(e.data.playlists)
                                }).playlists.length >= n.props.totalLimit && (t.more = !1, t.playlists = t.playlists.slice(0, n.props.totalLimit));
                                var r = Object.assign(n.props.data, t);
                                n.setState({
                                    data: r,
                                    loading: !1
                                })
                            }
                        })
                    }
                }, n.state = {
                    loading: !1
                }, n
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, React.Component), r(t, [{
                key: "getCards",
                value: function() {
                    return this.props.data.playlists.map(function(e) {
                        return React.createElement("div", {
                            className: KKBOX.channel.playlistCardGridClass,
                            key: e.id
                        }, React.createElement(a.default, {
                            id: e.id,
                            title: e.title,
                            cover: e.cover,
                            url: e.url,
                            shortUrl: e.url,
                            creator: e.creator,
                            addProtocol: e.protocols.add,
                            playProtocol: e.protocols.play
                        }))
                    })
                }
            }, {
                key: "render",
                value: function() {
                    var e = this.props.t,
                        t = React.createElement("div", {
                            className: "loading"
                        }, React.createElement("img", {
                            src: "/assets/images/ajax-loader-kkbox.gif",
                            alt: e("loading")
                        }));
                    return React.createElement(s.default, {
                        loadMore: this.loadMore,
                        hasMore: this.props.data.more,
                        loader: t
                    }, React.createElement("div", {
                        className: "row"
                    }, this.getCards()))
                }
            }, {
                key: "componentDidUpdate",
                value: function() {
                    if (this.props.data.playlists.length == this.props.totalLimit) {
                        var e = document.querySelector("#hot-playlist .row"),
                            t = document.getElementById("playlist-download-card");
                        e.appendChild(t), window.downloadCardHeight()
                    }
                }
            }]), t
        }();
        c.propTypes = {
            data: React.PropTypes.object,
            totalLimit: React.PropTypes.number
        }, c.defaultProps = {
            data: {
                more: !1,
                playlists: []
            }
        }, n.default = (0, i.translate)("channel")(c)
    }, {
        "../components/PlaylistCardAuto.jsx": 29,
        "../components/ReactInfiniteScroll.jsx": 30,
        "query-string": 22,
        "react-i18next": 24
    }],
    33: [function(e, t, n) {
        "use strict";
        var r = e("react-i18next"),
            o = s(e("i18next")),
            i = s(e("i18next-xhr-backend")),
            a = s(e("./PlaylistsList.jsx"));

        function s(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var l = !1,
            c = !1;

        function u() {
            if (l && c) {
                var e = 3 * KKBOX.channel.playlistItemCount - 1;
                ReactDOM.render(React.createElement(r.I18nextProvider, {
                    i18n: o.default
                }, React.createElement(a.default, {
                    data: KKBOX.channel,
                    totalLimit: e
                })), document.getElementById("hot-playlist"))
            }
        }
        o.default.use(i.default).init({
            lng: KKBOX.locale,
            ns: ["channel", "song_tool"],
            backend: {
                loadPath: "/assets/locales/{{lng}}/{{ns}}.json"
            }
        }, function() {
            l = !0, u()
        }), document.addEventListener("DOMContentLoaded", function() {
            c = !0, window.loadPolyfill(["fetch", "Object.assign"], function() {
                u()
            })
        })
    }, {
        "./PlaylistsList.jsx": 32,
        i18next: 20,
        "i18next-xhr-backend": 4,
        "react-i18next": 24
    }]
}, {}, [33]);