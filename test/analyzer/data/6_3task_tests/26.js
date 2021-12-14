var wp = {"endpoint":"https:\/\/fabfitfun.com\/magazine\/wp-json\/wp\/v2"};
! function(t) {
    var e = {};

    function n(r) {
        if (e[r]) return e[r].exports;
        var i = e[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return t[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
    }
    n.m = t, n.c = e, n.d = function(t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, {
            configurable: !1,
            enumerable: !0,
            get: r
        })
    }, n.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 1)
}({
    M9Lf: function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            function(t) {
                var e = n("I3G/"),
                    r = n.n(e),
                    i = n("8+8L"),
                    o = n("bqTm"),
                    a = n.n(o);
                t(document).ready(function() {
                    var e = "#posts-search";
                    return 0 !== t(e).length && (r.a.use(i.a), new r.a({
                        el: e,
                        directives: {
                            infiniteScroll: a.a
                        },
                        data: function() {
                            return {
                                posts: [],
                                totalPages: 1,
                                page: 1,
                                loading: !1,
                                stop: !1,
                                perPage: Number(t(e).attr("data-perpage")),
                                infinite: Boolean(t(e).attr("data-infinite")),
                                offset: Number(t(e).attr("data-offset")),
                                search: t(e).attr("data-search") ? t(e).attr("data-search") : void 0
                            }
                        },
                        mounted: function() {
                            this.loadPosts()
                        },
                        methods: {
                            loadPosts: function() {
                                var e = this;
                                this.loading = !0;
                                var n = {
                                    page: this.page,
                                    per_page: this.perPage,
                                    offset: this.offset
                                };
                                this.search && Object.assign(n, {
                                    search: this.search.toString()
                                }), this.stop ? this.loading = !1 : this.$http.get(wp.endpoint + "/posts", {
                                    params: n
                                }).then(function(t) {
                                    e.posts = e.posts.concat(t.body), e.totalPages = Number(t.headers.get("X-WP-Totalpages")), e.offset = e.offset + e.perPage, e.page = Math.ceil(e.offset / e.perPage), e.stop = e.page >= e.totalPages, e.loading = !1
                                }).then(function() {
                                    t(".articleCard").addClass("-animation")
                                })
                            }
                        }
                    }))
                })
            }.call(e, n("7t+N"))
    },
    oKWj: function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            function(t) {
                var e = n("I3G/"),
                    r = n.n(e),
                    i = n("8+8L"),
                    o = n("bqTm"),
                    a = n.n(o);
                t(document).ready(function() {
                    var e = "#latest-posts";
                    return 0 !== t(e).length && (r.a.use(i.a), new r.a({
                        el: e,
                        directives: {
                            infiniteScroll: a.a
                        },
                        data: function() {
                            return {
                                posts: [],
                                totalPages: 1,
                                page: 1,
                                loading: !1,
                                stop: !1,
                                perPage: Number(t(e).attr("data-perpage")),
                                infinite: Boolean(t(e).attr("data-infinite")),
                                offset: Number(t(e).attr("data-offset")),
                                category: t(e).attr("data-category") ? Number(t(e).attr("data-category")) : null,
                                author: t(e).attr("data-author") ? Number(t(e).attr("data-author")) : null,
                                exclude: t(e).attr("data-exclude") ? t(e).attr("data-exclude") : void 0
                            }
                        },
                        mounted: function() {
                            this.loadPosts()
                        },
                        methods: {
                            loadPosts: function() {
                                var e = this;
                                this.loading = !0;
                                var n = {
                                    page: this.page,
                                    per_page: this.perPage,
                                    offset: this.offset,
                                    categories_exclude: this.exclude
                                };
                                this.category && Object.assign(n, {
                                    categories: this.category
                                }), this.author && Object.assign(n, {
                                    author: this.author
                                }), this.stop ? this.loading = !1 : this.$http.get(wp.endpoint + "/posts", {
                                    params: n
                                }).then(function(t) {
                                    e.posts = e.posts.concat(t.body), e.totalPages = Number(t.headers.get("X-WP-Totalpages")), e.offset = e.offset + e.perPage, e.page = Math.ceil(e.offset / e.perPage), e.stop = e.page >= e.totalPages, e.loading = !1
                                }).then(function() {
                                    t(".articleCard").addClass("-animation")
                                })
                            }
                        }
                    }))
                })
            }.call(e, n("7t+N"))
    }
});