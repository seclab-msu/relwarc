'use strict';

/* eslint quotes: "off" */

const { Ci } = require('chrome');

const { loadTypeFromString } = require('../load-type');
const { hasattr } = require('../utils/common');

// Taken from 'devtools/server/actors/network-monitor/network-observer.js'
// from Firefox Source
/**
 * Convert a nsIContentPolicy constant to a display string
 */
const LOAD_CAUSE_STRINGS = {
    [Ci.nsIContentPolicy.TYPE_INVALID]: "invalid",
    [Ci.nsIContentPolicy.TYPE_OTHER]: "other",
    [Ci.nsIContentPolicy.TYPE_SCRIPT]: "script",
    [Ci.nsIContentPolicy.TYPE_IMAGE]: "img",
    [Ci.nsIContentPolicy.TYPE_STYLESHEET]: "stylesheet",
    [Ci.nsIContentPolicy.TYPE_OBJECT]: "object",
    [Ci.nsIContentPolicy.TYPE_DOCUMENT]: "document",
    [Ci.nsIContentPolicy.TYPE_SUBDOCUMENT]: "subdocument",
    [Ci.nsIContentPolicy.TYPE_PING]: "ping",
    [Ci.nsIContentPolicy.TYPE_XMLHTTPREQUEST]: "xhr",
    [Ci.nsIContentPolicy.TYPE_OBJECT_SUBREQUEST]: "objectSubdoc",
    [Ci.nsIContentPolicy.TYPE_DTD]: "dtd",
    [Ci.nsIContentPolicy.TYPE_FONT]: "font",
    [Ci.nsIContentPolicy.TYPE_MEDIA]: "media",
    [Ci.nsIContentPolicy.TYPE_WEBSOCKET]: "websocket",
    [Ci.nsIContentPolicy.TYPE_CSP_REPORT]: "csp",
    [Ci.nsIContentPolicy.TYPE_XSLT]: "xslt",
    [Ci.nsIContentPolicy.TYPE_BEACON]: "beacon",
    [Ci.nsIContentPolicy.TYPE_FETCH]: "fetch",
    [Ci.nsIContentPolicy.TYPE_IMAGESET]: "imageset",
    [Ci.nsIContentPolicy.TYPE_WEB_MANIFEST]: "webManifest",
};


function decodeLoadType(loadTypeCode) {
    if (!hasattr(LOAD_CAUSE_STRINGS, loadTypeCode)) {
        throw new Error(
            'Got load type not present in LOAD_CAUSE_STRINGS: ' + loadTypeCode
        );
    }
    return loadTypeFromString(LOAD_CAUSE_STRINGS[loadTypeCode]);
}

exports.decodeLoadType = decodeLoadType;
