import { HAR } from './har';
import { LoadType } from './load-type';

const STATIC_LOAD_TYPES: LoadType[] = [
    LoadType.Script,
    LoadType.Img,
    LoadType.Stylesheet,
    LoadType.Object,
    LoadType.Font,
    LoadType.Imageset
];

const SERVED_STATIC_CONTENT_EXTENSIONS = [
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'rtf',
    'pdf',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'tif',
    'svg',
    'zip',
    'rar',
    'avi',
    'mp4',
    'mp3',
    'exe'
];

export function filterStaticDEPs(hars: HAR[]): HAR[] {
    return hars.filter((h: HAR): boolean => !isStatic(h));
}

function hasParams(h: HAR): boolean {
    if (h.queryString.length === 0) {
        return false;
    }
    if (h.queryString.length > 1) {
        return true;
    }
    const param = h.queryString[0];
    const hasValue = !(
        param.value === null ||
        param.value === '' ||
        typeof param.value === 'undefined'
    );

    if (!Number.isNaN(Number(param.name)) && !hasValue) {
        return false;
    }

    return true;
}

function hasServedStaticFileExtension(url: string): boolean {
    const path = (new URL(url)).pathname;
    const ext = (path.split('.').pop() as string).toLowerCase();

    if (SERVED_STATIC_CONTENT_EXTENSIONS.includes(ext)) {
        return true;
    }
    return false;
}

function isStatic(h: HAR): boolean {
    if (h.method.toUpperCase() !== 'GET') {
        return false;
    }
    if (hasParams(h)) {
        return false;
    }
    const initiator = h.initiator;

    if (typeof initiator !== 'undefined') {
        if (STATIC_LOAD_TYPES.includes(initiator.type)) {
            return true;
        } else {
            return false;
        }
    }

    // undefined initiator currently means that DEP was mined from HTML
    // we would like to filter out links to static files like .docx, .pdf, etc.

    if (hasServedStaticFileExtension(h.url)) {
        return true;
    }
    return false;
}

