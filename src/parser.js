const {Cu} = require('chrome');

Cu.import("resource://gre/modules/reflect.jsm");

exports.parse = Reflect.parse;