import { HAR, HTMLInfo } from './har';
import { getWrappedWindow } from './utils/window';
import { LoadType } from './load-type';
import { findCssSelector } from './browser/find-css-selector';
import * as htmlparser from 'htmlparser2';

const LoadTypeTagAssociation = {
    [LoadType.Img]: ['img'],
    [LoadType.Imageset]: ['img', 'source'],
    [LoadType.Script]: ['script'],
    [LoadType.Stylesheet]: ['link'],
    [LoadType.WebManifest]: ['link'],
    [LoadType.Font]: ['link'],
    [LoadType.Subdocument]: ['iframe'],
    [LoadType.Media]: ['source', 'audio']
};

const elemWithSrcNames = [
    'img',
    'script',
    'iframe',
    'audio'
];

type ElementWithSrc =
    | HTMLImageElement
    | HTMLScriptElement
    | HTMLIFrameElement
    | HTMLAudioElement;


function isElementWithSrc(elem: Element): elem is ElementWithSrc {
    return elem instanceof HTMLImageElement ||
    elem instanceof HTMLScriptElement ||
    elem instanceof HTMLIFrameElement ||
    elem instanceof HTMLAudioElement;
}

function getHTMLElementInfo(
    url: string,
    document: Document,
    loadType: LoadType
): HTMLInfo | undefined {
    for (const tagName of LoadTypeTagAssociation[loadType]) {
        for (const elem of document.querySelectorAll(tagName)) {
            if (isElementWithSrc(elem)) {
                if (elem.src === url) {
                    return {
                        outerHTML: elem.outerHTML,
                        selector: findCssSelector(elem)
                    };
                }
            } else if (elem instanceof HTMLLinkElement) {
                if (elem.href === url) {
                    return {
                        outerHTML: elem.outerHTML,
                        selector: findCssSelector(elem)
                    };
                }
            } else if (elem instanceof HTMLSourceElement) {
                if (elem.srcset === url || elem.src === url) {
                    return {
                        outerHTML: elem.outerHTML,
                        selector: findCssSelector(elem)
                    };
                }
            }
        }
    }
}

function startIndexToNumbers(
    index: number,
    content: string
): {lineNumber: number, columnNumber: number} {
    let lineNumber = 0,
        columnNumber = 0;
    for (let i = 0; i < index; i++) {
        const c = content.charAt(i);
        if (c === '\n') {
            lineNumber++;
            columnNumber = 0;
        } else {
            columnNumber++;
        }
    }
    return {
        lineNumber: lineNumber,
        columnNumber: columnNumber
    };
}

function setElementLocation(har: HAR, content: string): void {
    const initiator = har.initiator;
    if (!initiator) {
        return;
    }
    const parser = new htmlparser.Parser({
        onopentag(
            name: string,
            attribs: {[s: string]: string}
        ): void {
            let urlCandidate!: URL;
            if (elemWithSrcNames.includes(name)) {
                urlCandidate = new URL(attribs.src, har.url);
            } else if (name === 'link') {
                urlCandidate = new URL(attribs.href, har.url);
            } else if (name === 'source') {
                urlCandidate = new URL(attribs.src || attribs.srcset, har.url);
            }
            if (
                typeof urlCandidate !== 'undefined' &&
                urlCandidate.toString() === har.url
            ) {
                const {
                    lineNumber,
                    columnNumber
                } = startIndexToNumbers(parser.startIndex, content);
                initiator.lineNumber = lineNumber;
                initiator.columnNumber = columnNumber;
            }
        }
    });

    parser.write(content);
    parser.end();
}

export function trackHTMLDynamicDEP(
    har: HAR,
    webpage: object,
    content: string
): HAR {
    const window: Window = getWrappedWindow(webpage);
    const document = window.document;
    if (har.initiator?.type && har.initiator.type in LoadTypeTagAssociation) {
        har.initiator.htmlInfo = getHTMLElementInfo(
            har.url,
            document,
            har.initiator.type
        );
        setElementLocation(har, content);
    }
    return har;
}
