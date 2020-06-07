"use strict"

const { isUnknown, UNKNOWN_FUNCTION } = require('analyzer/unknownvalues');

const { FormDataModel } = require('./form-data-model');

function getQueryNameValue(q) {
    const arr = q.split('=');
    const result = arr.slice(0, 1);

    result.push(arr.slice(1).join('='));
    return result;
}

function headersFromMap(headersMap) {
    const result = [];

    for (let k in headersMap) {
        if (headersMap.hasOwnProperty(k)) {
            result.push({
                'name': k,
                'value': headersMap[k]
            });
        }
    }
    return result;
}

function hasHeader(headers, name) {
    const n = name.toLowerCase();
    for (let h of headers) {
        if (h.name.toLowerCase() === n) {
            return true;
        }
    }
    return false;
}

function getHeader(headers, name) {
    const n = name.toLowerCase();
    for (let h of headers) {
        if (h.name.toLowerCase() === n) {
            return h.value;
        }
    }
    return false;
}

function HAR(url, baseURL) {
    if (!new.target) {
        throw new Error('HAR is a constructor and should be called with `new`');
    }
    const parsedURL = new URL(url, baseURL);

    this.method = 'GET';
    this.url = parsedURL.href;
    this.httpVersion = 'HTTP/1.1';
    this.headers = [{
        "name": "Host",
        "value": parsedURL.host
    }];
    this.queryString = [];
    this.parseQueryString(parsedURL);
    this.bodySize = 0;
}

HAR.prototype.reparseURL = function() {
    const parsedURL = new URL(this.url);
    this.queryString = [];
    this.parseQueryString(parsedURL);
}

HAR.prototype.parseQueryString = function(parsedURL) {
    if (parsedURL.search) {
        for (let part of parsedURL.search.substring(1).split('&')) {
            let [name, value] = getQueryNameValue(part);
            this.queryString.push({
                name,
                value
            });
        }
    }
};

HAR.prototype.setPostData = function(postData, isAngular=false, rawData=null) {
    this.postData = {
        "text": postData
    }
    this.bodySize = postData.length;
    this.headers.push({
        'name': 'Content-Length',
        'value': '' + postData.length
    })
    let ct, ctParts, ctType;
    if (hasHeader(this.headers, 'content-type')) {
        ct = getHeader(this.headers, 'content-type');
        if (isAngular && typeof ct === 'undefined') {
            ct = 'text/plain';
            for (let h of this.headers) {
                if (h.name.toLowerCase() === 'content-type') {
                    h.value = 'text/plain';
                    break;
                }
            }
        }
        this.postData.mimeType = ct;
        ctParts = ct.split('; ');
        ctType = ctParts[0];
    }
    if (ctType === 'application/x-www-form-urlencoded') {
        this.postData.params = [];
        for (let part of postData.split('&')) {
            let [name, value] = getQueryNameValue(part);
            this.postData.params.push({
                name,
                value
            });
        }
    } else if (ctType === 'multipart/form-data') {
        this.postData.text = null;
        this.postData.params = rawData;
    }
}

function queryStringFromObject(ob) {
    const resParts = [];

    let val;

    if (isUnknown(ob)) {
        return ob;
    }

    for (let k in ob) {
        if (ob.hasOwnProperty(k)) {
            val = ob[k];
            if (Array.isArray(val)) {
                if (!k.endsWith('[]')) {
                    k += '[]';
                }
            } else {
                val = [val];
            }
            for (let innerVal of val) {
                resParts.push(encodeURIComponent(k) + '=' + encodeURIComponent(innerVal));
            }
        }
    }
    return resParts.join('&');
}

function replaceQuery(url, qs) {
    if (!qs) {
        return url;
    }
    const parsed = new URL(url);

    parsed.search = parsed.search ? parsed.search + '&' + qs : qs;
    return parsed.href;
}

function makeHARFetch(args, baseURL) {
    const url = args[0];

    if (!url || isUnknown(url)) {
        return null;
    }

    const har = new HAR(url, baseURL);

    if (args.length > 1 || typeof args[1] === 'object') {
        const settings = args[1];
        har.method = settings.method || "GET";
        har.headers.push(...headersFromMap(settings.headers || {}));
        if (settings.body) {
            if (isUnknown(settings.body)) {
                return null;
            }
            har.setPostData(settings.body);
        }
    }
    return har;
}

function makeHARJQuery(funcName, args, baseURL) {
    let settings = {},
        url,
        method,
        data;

    if (typeof args[0] === 'object') {
        settings = args[0];
        url = settings.url;
    } else if (typeof args[0] === 'string') {
        url = args[0];
        if (funcName === 'ajax' && args.length > 1) {
            settings = args[1];
        } else if (args[1] === UNKNOWN_FUNCTION) {
            data = null;
        } else if (typeof args[1] === 'object') {
            data = args[1];
        }
    } else {
        throw new Error('Bad jQuery AJAX args: ' + funcName + ' ' + args)
    }

    if (!url || isUnknown(url)) {
        return null;
    }

    const har = new HAR(url, baseURL);

    data = data || settings.data;
    if (~['get', 'post'].indexOf(funcName)) {
        method = funcName.toUpperCase();
    } else if (funcName === 'getJSON') {
        method = 'GET';
    } else {
        method = settings.type || settings.method || 'GET';
    }

    method = method.toUpperCase();

    har.method = method;

    let isMultipart = false;

    if (data instanceof FormDataModel) {
        isMultipart = true;
    }

    let qs;

    if (!isMultipart) {
        qs = data || "";

        if (typeof qs === 'object') {
            qs = queryStringFromObject(data);
        }

        if (isUnknown(qs)) {
            return null;
        }
    } else {
        qs = '';
    }

    const explicitCt = settings.contentType;
    //har.EXPLICIT_CT = explicitCt;

    if (settings.dataType === 'jsonp') {
        const callbackParamName = settings.jsonp || 'callback';
        qs += (qs ? '&': '') + callbackParamName + '=jQuery111106567430573505544_1591529444128';
    }

    if (method === 'GET') {
        har.url = replaceQuery(har.url, qs);
        har.reparseURL();
    } else {
        if (explicitCt) {
            har.headers.push({
                'name': 'Content-Type',
                'value': explicitCt
            });
            //console.error('add explicit ct');
        } else if (isMultipart) {
            har.headers.push({
                'name': 'Content-Type',
                'value': 'multipart/form-data'
            });
        } else if (qs) {
            har.headers.push({
                'name': 'Content-Type',
                'value': 'application/x-www-form-urlencoded'
            });
        }
        har.setPostData(qs, false, isMultipart ? data.getData() : null);
    }
    return har;
}

function makeHARAxios(funcName, args, baseURL) {
    let url,
        settings = {},
        method,
        postData;

    if (funcName === 'axios') {
        if (typeof args[0] === 'object') {
            settings = args[0];
            url = settings.url;
        } else {
            url = args[0];
            settings = args[1] || {};
        }
        method = settings.method || 'GET';
        postData = settings.data;
    } else {
        url = args[0];
        method = funcName.toUpperCase();
        if (~['post', 'put'].indexOf(funcName)) {
            postData = args[1];
            settings = args[2] || {};
        } else {
            settings = args[1] || {};
        }
    }

    if (!url || isUnknown(url) || isUnknown(postData)) {
        return null;
    }

    const har = new HAR(url, baseURL);
    har.method = method.toUpperCase();

    if (settings.params) {
        har.url = replaceQuery(har.url, queryStringFromObject(settings.params));
        har.reparseURL();
    }

    const headers = settings.headers || {};

    har.headers.push(...headersFromMap(headers));

    if (method.toUpperCase() !== 'GET') {
        let ct,
            ctSet = false;
        if (headers['content-type']) {
            ct = headers['content-type'];
            ctSet = true;
        } else if (headers['Content-Type']) {
            ct = headers['Content-Type'];
            ctSet = true;
        }
        if (postData === null) {
            postData = '';
        }
        if (typeof postData === 'string') {
            ct = 'application/x-www-form-urlencoded';
        } else if (typeof postData === 'object') {
            ct = 'application/json';
        }
        if (ct === 'application/json' && typeof postData === 'object') {
            postData = JSON.stringify(postData);
        }
        if (ct && !ctSet) {
            har.headers.push({
                'name': 'Content-Type',
                'value': ct
            });
        }
        har.setPostData(postData || '');
    }

    return har;
}

function makeHARAngular(name, args, baseURL) {
    let settings,
        postData,
        method,
        params,
        url;

    if (name === '$http') {
        settings = args[0];
        url = settings.url;
        method = settings.method || 'GET';
        postData = settings.data || '';
    } else {
        url = args[0];
        if (~['post', 'put'].indexOf(name)) {
            postData = args[1] || '';
            settings = args[2] || {};
        } else {
            settings = args[1] || {};
        }
        if (name === 'jsonp') {
            method = 'GET';
        } else {
            method = name;
        }
    }


    if (!url || isUnknown(url) || isUnknown(postData)) {
        return null;
    }

    //console.log(url);

    const har = new HAR(url, baseURL);
    if (settings.params) {
        har.url = replaceQuery(har.url, queryStringFromObject(settings.params));
        har.reparseURL();
    }

    method = method.toUpperCase();

    har.method = method;
    const headers = settings.headers || {};

    har.headers.push(...headersFromMap(headers));

    if (method !== 'GET' && method !== 'HEAD') {
        if (!hasHeader(har.headers, 'Content-Type') && postData) {
            har.headers.push({
                'name': 'Content-Type',
                'value': 'application/json'
            });
        }
        if (typeof postData === 'object') {
            postData = JSON.stringify(postData);
        }
        har.setPostData(postData, true);
    }

    return har;
}

function makeHAR(name, args, baseURL) {
    if (name === 'fetch') {
        return makeHARFetch(args, baseURL);
    }
    if (name === '$http') {
        return makeHARAngular(name, args, baseURL);
    }
    if (name === 'axios') {
        return makeHARAxios(name, args, baseURL);
    }

    const [objectName, funcName] = name.split('.');


    if (objectName === '$' || objectName === 'jQuery') {
        return makeHARJQuery(funcName, args, baseURL);
    }

    if (objectName === 'axios') {
        return makeHARAxios(funcName, args, baseURL);
    }

    if (objectName === '$http') {
        return makeHARAngular(funcName, args, baseURL);
    }

    if ((objectName === 'window' || objectName === 'this') && funcName === 'fetch') {
        return makeHARFetch(args, baseURL);
    }

    throw Error('Function not supported: ' + name);
}

exports.makeHAR = makeHAR;