"use strict";

const { Cc, Ci, Cu, Cr } = require('chrome');

Cu.import('resource://gre/modules/Services.jsm');

function getWrappedWindow(webpage) {
    const win = webpage.evaluate(function () {
        return window;
    });
    return new XPCNativeWrapper(win);
}

function wait(d) {
    return new Promise(resolve => setTimeout(resolve, d));
}

exports.getWrappedWindow = getWrappedWindow;
exports.wait = wait;