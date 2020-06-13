const { Cc, Ci, Cu, Cr } = require('chrome');

Cu.import('resource://gre/modules/Services.jsm');

module.exports.getWrappedWindow = function(webpage) {
    const win = webpage.evaluate(function () {
        return window;
    });
    return new XPCNativeWrapper(win);
}
