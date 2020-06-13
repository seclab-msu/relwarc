'use strict';

const { Cu } = require('chrome');

Cu.import('resource://gre/modules/Services.jsm'); /* global Services */

const DOCUMENT_ELEMENT_INSERTED_EVENT = 'document-element-inserted';
const DOCUMENT_CREATED_EVENT = 'document-created';

const subscriptions = Object.create(null);

function on(eventType, cb) {
    subscriptions[eventType] = subscriptions[eventType] || [];
    subscriptions[eventType].push(cb);
}

function emit(eventType, data) {
    if (Object.prototype.hasOwnProperty.call(subscriptions, eventType)) {
        for (const cb of subscriptions[eventType]) {
            cb(data);
        }
    }
}

function eventListener(aSubject, aTopic) {
    if (
        aTopic === DOCUMENT_ELEMENT_INSERTED_EVENT &&
        aSubject instanceof HTMLDocument
    ) {
        emit(DOCUMENT_CREATED_EVENT, aSubject.defaultView, aSubject);
    }
}

Services.obs.addObserver(
    { observe: eventListener },
    DOCUMENT_ELEMENT_INSERTED_EVENT,
    false
);

exports.DOCUMENT_CREATED_EVENT = DOCUMENT_CREATED_EVENT;
exports.on = on;
