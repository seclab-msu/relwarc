const { Cu } = require('chrome');

Cu.import('resource://gre/modules/Services.jsm'); /* global XPCNativeWrapper */

module.exports.getWrappedWindow = function (webpage) {
    const win = webpage.evaluate(function () {
        return window;
    });
    return new XPCNativeWrapper(win);
};
