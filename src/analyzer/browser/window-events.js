"use strict"

const {Cc, Ci, Cu} = require('chrome');
Cu.import('resource://gre/modules/Services.jsm');

const eventListenerService = Cc["@mozilla.org/eventlistenerservice;1"].getService(Ci.nsIEventListenerService);

const DOCUMENT_ELEMENT_INSERTED_EVENT = 'document-element-inserted';
const DOCUMENT_CREATED_EVENT = 'document-created';

const subscriptions = {};

function on(eventType, cb) {
    subscriptions[eventType] = subscriptions[eventType] || [];
    subscriptions[eventType].push(cb);
}

function emit(eventType, data) {
    if (subscriptions.hasOwnProperty(eventType)) {
        for (let cb of subscriptions[eventType]) {
            cb(data);
        }
    }
}

function eventListener(aSubject, aTopic, aData) {
    if (aTopic === DOCUMENT_ELEMENT_INSERTED_EVENT && aSubject instanceof HTMLDocument) {
        emit(DOCUMENT_CREATED_EVENT, aSubject.defaultView, aSubject);
    }
}

Services.obs.addObserver({observe:eventListener}, DOCUMENT_ELEMENT_INSERTED_EVENT, false);

exports.DOCUMENT_CREATED_EVENT = DOCUMENT_CREATED_EVENT;
exports.on = on;