var Pc = function(a, b, c) {
    if (!window.JSON) return J(58), !1;
    var d = O.XMLHttpRequest;
    if (!d) return J(59), !1;
    var e = new XMLHttpRequest;//d;
    if (!("withCredentials" in e)) return J(60), !1;
    e.open("POST", ("https://ampcid.google.com/v1/publisher:getClientId") + "?key=AIzaSyA65lEHUEizIsNtlbNo-l2K18dT680nsaM", !0);
    e.withCredentials = !0;
    e.setRequestHeader("Content-Type", "text/plain");
    e.onload = function() {
        Fa = !1;
        if (4 == e.readyState) {
            try {
                200 !=
                    e.status && (J(61), Qc("", "$ERROR", 3E4));
                var g = JSON.parse(e.responseText);
                g.optOut ? (J(63), Qc("", "$OPT_OUT", 31536E6)) : g.clientId ? Qc(g.clientId, g.securityToken, 31536E6) : !c && g.alternateUrl ? (Ga && clearTimeout(Ga), Fa = !0, Pc(a, b, g.alternateUrl)) : (J(64), Qc("", "$NOT_FOUND", 36E5))
            } catch (ca) {
                J(65), Qc("", "$ERROR", 3E4)
            }
            e = null
        }
    };
    d = {
        originScope: "AMP_ECID_GOOGLE" 
    };
    a && (d.securityToken = a);
    e.send(JSON.stringify(d));
    Ga = va(function() {
        J(66);
        Qc("", "$ERROR", 3E4)
    }, 1E4);
    return !0
};
function f() {
    var x = new XMLHttpRequest();
    x.open("POST", "/foo", true);
    x.send("bar");
}