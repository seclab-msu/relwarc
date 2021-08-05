import { HAR, HTMLInfo } from './har';
import { getWrappedWindow } from './utils/window';
import { LoadType } from './load-type';
import { findCssSelector } from './browser/find-css-selector';
import { parse as parseSrcSet } from 'srcset';
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
    'script',
    'iframe',
    'audio'
];

type ElementWithSrc =
    | HTMLScriptElement
    | HTMLIFrameElement
    | HTMLAudioElement;


function isElementWithSrc(elem: Element): elem is ElementWithSrc {
    return elem instanceof HTMLScriptElement ||
    elem instanceof HTMLIFrameElement ||
    elem instanceof HTMLAudioElement;
}

function srcSetContainsURL(
    url: string,
    srcSet: string,
    originURL: string
): boolean {
    const parsedSrcSet = parseSrcSet(srcSet);
    for (const src of parsedSrcSet) {
        const fullURL = new URL(src.url, originURL);
        if (fullURL.toString() == url) {
            return true;
        }
    }
    return false;
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
            } else if (
                elem instanceof HTMLSourceElement ||
                elem instanceof HTMLImageElement
            ) {
                if (
                    elem.src === url ||
                    srcSetContainsURL(
                        url,
                        elem.srcset,
                        document.location.toString()
                    )
                ) {
                    return {
                        outerHTML: elem.outerHTML,
                        selector: findCssSelector(elem)
                    };
                }
            }
        }
    }
}

function getURLCandidateForElemWithSet(
    attribs: {[s: string]: string},
    url: string,
    originURL: string
): URL | undefined {
    let urlCandidate = new URL(attribs.src, originURL);
    if (urlCandidate.toString() === url) {
        return urlCandidate;
    }
    if (typeof attribs.srcset !== 'undefined') {
        const parsedSrcSet = parseSrcSet(attribs.srcset);
        for (const src of parsedSrcSet) {
            urlCandidate = new URL(src.url, originURL);
            if (urlCandidate.toString() === url) {
                return urlCandidate;
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

function setElementLocation(har: HAR, content: string, originURL:string): void {
    const initiator = har.initiator;
    if (!initiator) {
        return;
    }
    const parser = new htmlparser.Parser({
        onopentag(
            name: string,
            attribs: {[s: string]: string}
        ): void {
            let urlCandidate: URL | undefined;
            if (elemWithSrcNames.includes(name)) {
                urlCandidate = new URL(attribs.src, originURL);
            } else if (name === 'link') {
                urlCandidate = new URL(attribs.href, originURL);
            } else if (name === 'source' || name === 'img') {
                urlCandidate = getURLCandidateForElemWithSet(
                    attribs,
                    har.url,
                    originURL
                );
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
        setElementLocation(har, content, document.location.toString());
    }
    return har;
}
