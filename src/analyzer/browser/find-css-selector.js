'use strict';

// Taken from 'devtools/shared/inspector/css-logic.js'
// from Firefox Source

function positionInNodeList(element, nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
        if (element === nodeList[i]) {
            return i;
        }
    }
    return -1;
}

function findNodeAndContainer(node) {
    const shadowRoot = node.containingShadowRoot;
    while (node.isNativeAnonymous) {
        node = node.parentNode;
    }
    if (shadowRoot) {
        // If the node is under a shadow root, the shadowRoot contains the node and
        // we can find the node via shadowRoot.querySelector(path).
        return {
            containingDocOrShadow: shadowRoot,
            node,
        };
    }
    // Otherwise, get the root binding parent to get a non anonymous element that
    // will be accessible from the ownerDocument.
    return {
        containingDocOrShadow: node.ownerDocument,
        node,
    };
}

// eslint-disable-next-line complexity
function findCssSelector(ele) {
    const { node, containingDocOrShadow } = findNodeAndContainer(ele);
    ele = node;
    if (!containingDocOrShadow || !containingDocOrShadow.contains(ele)) {
        // findCssSelector received element not inside container.
        return '';
    }
    const cssEscape = ele.ownerGlobal.CSS.escape;
    // document.querySelectorAll("#id") returns multiple if elements share an ID
    if (
        ele.id &&
        containingDocOrShadow.querySelectorAll('#' + cssEscape(ele.id)).length === 1
    ) {
        return '#' + cssEscape(ele.id);
    }
    const tagName = ele.localName;
    if (tagName === 'html') {
        return 'html';
    }
    if (tagName === 'head') {
        return 'head';
    }
    if (tagName === 'body') {
        return 'body';
    }
    // We might be able to find a unique class name
    let selector, index, matches;
    for (let i = 0; i < ele.classList.length; i++) {
        // Is this className unique by itself?
        selector = '.' + cssEscape(ele.classList.item(i));
        matches = containingDocOrShadow.querySelectorAll(selector);
        if (matches.length === 1) {
            return selector;
        }
        // Maybe it's unique with a tag name?
        selector = cssEscape(tagName) + selector;
        matches = containingDocOrShadow.querySelectorAll(selector);
        if (matches.length === 1) {
            return selector;
        }
        // Maybe it's unique using a tag name and nth-child
        index = positionInNodeList(ele, ele.parentNode.children) + 1;
        selector = selector + ':nth-child(' + index + ')';
        matches = containingDocOrShadow.querySelectorAll(selector);
        if (matches.length === 1) {
            return selector;
        }
    }
    index = positionInNodeList(ele, ele.parentNode.children) + 1;
    selector = cssEscape(tagName) + ':nth-child(' + index + ')';
    if (ele.parentNode !== containingDocOrShadow) {
        selector = findCssSelector(ele.parentNode) + ' > ' + selector;
    }
    return selector;
}

exports.findCssSelector = findCssSelector;
