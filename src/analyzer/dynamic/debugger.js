const {Cu} = require('chrome');
Cu.import("resource://gre/modules/jsdebugger.jsm");
module.exports.addDebuggerToGlobal = addDebuggerToGlobal;