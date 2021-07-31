import { HAR, HTMLInfo } from './har';
import { getWrappedWindow } from './utils/window';
import { LoadType } from './load-type';
import { findCssSelector } from './browser/find-css-selector';

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

export function trackHTMLDynamicDEP(har: HAR, webpage: object): HAR {
    const window: Window = getWrappedWindow(webpage);
    const document = window.document;
    if (har.initiator?.type && har.initiator.type in LoadTypeTagAssociation) {
        har.initiator.htmlInfo = getHTMLElementInfo(
            har.url,
            document,
            har.initiator.type
        );
    }
    return har;
}
