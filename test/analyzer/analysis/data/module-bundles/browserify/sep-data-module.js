(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { main } = require('./main.js');

main();
},{"./main.js":2}],2:[function(require,module,exports){
const { reqData } = require('./req-data');

exports.main = function() {
    function f() {
        const u = reqData.base + '?par1=' + reqData.p1 + '&par2=' + reqData.p2;
        fetch(u);
    }

    window.__specialHook = f;
}
},{"./req-data":3}],3:[function(require,module,exports){
exports.reqData = {
    base: '/api/data',
    p1: '123',
    p2: 'abc'
};
},{}]},{},[2,3,1]);
