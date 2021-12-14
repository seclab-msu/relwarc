"use strict";

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function _possibleConstructorReturn(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !e || "object" != typeof e && "function" != typeof e ? t : e
}

function _inherits(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
    t.prototype = Object.create(e && e.prototype, {
        constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
}

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var _createClass = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var s = e[a];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
            }
        }
        return function(e, a, s) {
            return a && t(e.prototype, a), s && t(e, s), e
        }
    }(),
    SM = SM || {},
    PaperBoy = function() {
        function t() {
            _classCallCheck(this, t)
        }
        return _createClass(t, null, [{
            key: "configure",
            value: function(e) {
                var a = axios.create(e);
                a.defaults.headers.post["Content-Type"] = "application/json", a.defaults.headers.put["Content-Type"] = "application/json", Object.defineProperty(t, "axios", {
                    value: a,
                    writable: !1,
                    enumerable: !0,
                    configurable: !1
                })
            }
        }]), t
    }();
void 0 === SM.PaperBoy && (SM.PaperBoy = PaperBoy);
var _createClass = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var s = e[a];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
            }
        }
        return function(e, a, s) {
            return a && t(e.prototype, a), s && t(e, s), e
        }
    }(),
    MessageStatus = function t() {
        _classCallCheck(this, t)
    };
Object.defineProperty(MessageStatus, "SUPPRESSED", {
    value: "SUPPRESSED",
    writable: !1,
    enumerable: !0,
    configurable: !1
}), Object.defineProperty(MessageStatus, "POSTED", {
    value: "POSTED",
    writable: !1,
    enumerable: !0,
    configurable: !1
});
var MessageManager = function() {
    function t() {
        _classCallCheck(this, t)
    }
    return _createClass(t, null, [{
        key: "createMessage",
        value: function(t, e, a, s, n, o) {
            null == t || void 0 == t || 0 === t.length ? o({
                status: 400,
                data: [{
                    code: 106,
                    detail: "topicId can't be blank"
                }]
            }) : SM.PaperBoy.axios.post(escape("/api/v1/topics/" + t + "/messages"), {
                content: e,
                status: a,
                expires_in: s
            }).then(function(t) {
                n({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                o({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "getMessages",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "topicId can't be blank"
                }]
            }) : SM.PaperBoy.axios.get(escape("/api/v1/topics/" + t + "/messages"), {
                params: e
            }).then(function(t) {
                a({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "findMessageById",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or messageId can't be blank"
                }]
            }) : SM.PaperBoy.axios.get(escape("/api/v1/topics/" + t + "/messages/" + e)).then(function(t) {
                a({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "deleteMessage",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or messageId can't be blank"
                }]
            }) : SM.PaperBoy.axios.delete(escape("/api/v1/topics/" + t + "/messages/" + e)).then(function(t) {
                a({
                    status: t.status
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "updateMessageById",
        value: function(t, e, a, s, n) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? n({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or messageId can't be blank"
                }]
            }) : SM.PaperBoy.axios.put(escape("/api/v1/topics/" + t + "/messages/" + e), a).then(function(t) {
                s({
                    status: t.status
                })
            }).catch(function(t) {
                n({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "blockMessageById",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or messageId can't be blank"
                }]
            }) : SM.PaperBoy.axios.put(escape("/api/v1/topics/" + t + "/messages/" + e) + "?operation=SUPPRESS").then(function(t) {
                a({
                    status: t.status
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "activateMessageById",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or messageId can't be blank"
                }]
            }) : SM.PaperBoy.axios.put(escape("/api/v1/topics/" + t + "/messages/" + e) + "?operation=POST").then(function(t) {
                a({
                    status: t.status
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }]), t
}();
SM.PaperBoy.MessageManager = MessageManager, SM.PaperBoy.MessageStatus = MessageStatus;
var _createClass = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var s = e[a];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
            }
        }
        return function(e, a, s) {
            return a && t(e.prototype, a), s && t(e, s), e
        }
    }(),
    SubscriptionStatus = function t() {
        _classCallCheck(this, t)
    };
Object.defineProperty(SubscriptionStatus, "ACTIVE", {
    value: "ACTIVE",
    writable: !1,
    enumerable: !0,
    configurable: !1
}), Object.defineProperty(SubscriptionStatus, "INACTIVE", {
    value: "INACTIVE",
    writable: !1,
    enumerable: !0,
    configurable: !1
});
var SubscriptionManager = function() {
    function t() {
        _classCallCheck(this, t)
    }
    return _createClass(t, null, [{
        key: "createSubscription",
        value: function(t, e, a, s, n) {
            null == t || void 0 == t || 0 === t.length ? n({
                status: 400,
                data: [{
                    code: 106,
                    detail: "topicId can't be blank"
                }]
            }) : SM.PaperBoy.axios.post(escape("/api/v1/topics/" + t + "/subscriptions"), {
                user_id: e,
                status: a
            }).then(function(t) {
                s({
                    status: t.status
                })
            }).catch(function(t) {
                n({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "getSubscriptions",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "topicId can't be blank"
                }]
            }) : SM.PaperBoy.axios.get(escape("/api/v1/topics/" + t + "/subscriptions"), {
                params: e
            }).then(function(t) {
                a({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "findSubscriptionById",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or subscriptionId can't be blank"
                }]
            }) : SM.PaperBoy.axios.get(escape("/api/v1/topics/" + t + "/subscriptions/" + e)).then(function(t) {
                a({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "deleteSubscription",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or subscriptionId can't be blank"
                }]
            }) : SM.PaperBoy.axios.delete(escape("/api/v1/topics/" + t + "/subscriptions/" + e)).then(function(t) {
                a({
                    status: t.status
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "blockSubscriptionById",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or subscriptionId can't be blank"
                }]
            }) : SM.PaperBoy.axios.put(escape("/api/v1/topics/" + t + "/subscriptions/" + e) + "?operation=BLOCK").then(function(t) {
                a({
                    status: t.status
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "activateSubscriptionById",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither topicId or subscriptionId can't be blank"
                }]
            }) : SM.PaperBoy.axios.put(escape("/api/v1/topics/" + t + "/subscriptions/" + e) + "?operation=ACTIVATE").then(function(t) {
                a({
                    status: t.status
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }]), t
}();
SM.PaperBoy.SubscriptionManager = SubscriptionManager, SM.PaperBoy.SubscriptionStatus = SubscriptionStatus;
var _createClass = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var s = e[a];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
            }
        }
        return function(e, a, s) {
            return a && t(e.prototype, a), s && t(e, s), e
        }
    }(),
    TopicStatus = function t() {
        _classCallCheck(this, t)
    };
Object.defineProperty(TopicStatus, "ACTIVE", {
    value: "ACTIVE",
    writable: !1,
    enumerable: !0,
    configurable: !1
}), Object.defineProperty(TopicStatus, "INACTIVE", {
    value: "INACTIVE",
    writable: !1,
    enumerable: !0,
    configurable: !1
});
var TopicManager = function() {
    function t() {
        _classCallCheck(this, t)
    }
    return _createClass(t, null, [{
        key: "createTopic",
        value: function(t, e, a, s) {
            SM.PaperBoy.axios.post("/api/v1/topics", {
                external_id: t,
                status: e
            }).then(function(t) {
                a({
                    status: t.status
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "getTopics",
        value: function(t, e, a) {
            SM.PaperBoy.axios.get("/api/v1/topics", {
                params: t
            }).then(function(t) {
                e({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                a({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "findTopicById",
        value: function(t, e, a) {
            null == t || void 0 == t || 0 === t.length ? a({
                status: 400,
                data: [{
                    code: 106,
                    detail: "id can't be blank"
                }]
            }) : SM.PaperBoy.axios.get(escape("/api/v1/topics/" + t)).then(function(t) {
                e({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                a({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "deleteTopic",
        value: function(t, e, a) {
            null == t || void 0 == t || 0 === t.length ? a({
                status: 400,
                data: [{
                    code: 106,
                    detail: "id can't be blank"
                }]
            }) : SM.PaperBoy.axios.delete(escape("/api/v1/topics/" + t)).then(function(t) {
                e({
                    status: t.status
                })
            }).catch(function(t) {
                a({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "blockTopicById",
        value: function(t, e, a) {
            null == t || void 0 == t || 0 === t.length ? a({
                status: 400,
                data: [{
                    code: 106,
                    detail: "id can't be blank"
                }]
            }) : SM.PaperBoy.axios.put(escape("/api/v1/topics/" + t) + "?operation=BLOCK").then(function(t) {
                e({
                    status: t.status
                })
            }).catch(function(t) {
                a({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "activateTopicById",
        value: function(t, e, a) {
            null == t || void 0 == t || 0 === t.length ? a({
                status: 400,
                data: [{
                    code: 106,
                    detail: "id can't be blank"
                }]
            }) : SM.PaperBoy.axios.put(escape("/api/v1/topics/" + t) + "?operation=ACTIVATE").then(function(t) {
                e({
                    status: t.status
                })
            }).catch(function(t) {
                a({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }]), t
}();
SM.PaperBoy.TopicManager = TopicManager, SM.PaperBoy.TopicStatus = TopicStatus;
var _createClass = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var s = e[a];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
            }
        }
        return function(e, a, s) {
            return a && t(e.prototype, a), s && t(e, s), e
        }
    }(),
    Subscription = function() {
        function t(e, a, s, n) {
            _classCallCheck(this, t), this.userId = e, this.interval = a, this.onSuccess = s, this.onError = n, this.isActive = !0, this.intervalHandler = null, this.run()
        }
        return _createClass(t, [{
            key: "run",
            value: function() {
                this.isActive && SM.PaperBoy.UserManager.getMessages(this.userId, {
                    page: 0,
                    page_size: 200
                }, this.onSuccess, this.onError), this.isActive && (subscription = this, null !== subscription && null === this.intervalHandler && (this.intervalHandler = setInterval(function() {
                    subscription.run()
                }, this.interval)))
            }
        }, {
            key: "unsubscribe",
            value: function() {
                this.isActive = !1, null !== this.intervalHandler && clearInterval(this.intervalHandler)
            }
        }]), t
    }();
SM.PaperBoy.Subscription = Subscription;
var SubscriptionException = function(t) {
    function e(t) {
        return _classCallCheck(this, e), _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t))
    }
    return _inherits(e, t), e
}(Error);
SM.PaperBoy.SubscriptionException = SubscriptionException;
var UserManager = function() {
    function t() {
        _classCallCheck(this, t)
    }
    return _createClass(t, null, [{
        key: "getSubscriptions",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "userId can't be blank"
                }]
            }) : SM.PaperBoy.axios.get("/api/v1/users/" + t + "/subscriptions", {
                params: e
            }).then(function(t) {
                a({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "getMessages",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "userId can't be blank"
                }]
            }) : SM.PaperBoy.axios.get("/api/v1/users/" + t + "/messages", {
                params: e
            }).then(function(t) {
                a({
                    status: t.status,
                    data: t.data
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "markMessageAsRead",
        value: function(t, e, a, s) {
            null == t || void 0 == t || 0 === t.length || null == e || void 0 == e || 0 === e.length ? s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "Neither userId or messageId can't be blank"
                }]
            }) : SM.PaperBoy.axios.put("/api/v1/users/" + t + "/messages/" + e).then(function(t) {
                a({
                    status: t.status
                })
            }).catch(function(t) {
                s({
                    status: t.response.status,
                    data: t.response.data
                })
            })
        }
    }, {
        key: "subscribe",
        value: function(t, e, a, s) {
            if (null == t || void 0 === t || 0 === t.length) throw s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "userId can't be blank"
                }]
            }), new SM.PaperBoy.SubscriptionException("userId can't be blank");
            if (null == e || void 0 == e || e < 1e4) throw s({
                status: 400,
                data: [{
                    code: 106,
                    detail: "interval must be informed and be greater than 10000ms"
                }]
            }), new SM.PaperBoy.SubscriptionException("interval must be informed and be greater than 10000ms");
            return new SM.PaperBoy.Subscription(t, e, a, s)
        }
    }]), t
}();
SM.PaperBoy.UserManager = UserManager;