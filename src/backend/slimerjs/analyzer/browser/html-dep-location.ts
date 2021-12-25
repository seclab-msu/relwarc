import { HAR } from '../../../../har';
import { getWrappedWindow } from '../utils/window';
import {
    LoadTypeTagAssociation,
    getHTMLElementInfo,
    setElementLocation
} from '../../../../html-dep-location';

export function addHTMLDynamicDEPLocation(
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
