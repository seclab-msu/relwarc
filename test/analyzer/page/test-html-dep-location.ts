import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';

import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Testing HTML info of dynamic HTML DEPS', () => {
    it('Script nested in class unique div tags', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'script',
                'htmlInfo': {
                    'outerHTML': '<script src="/script1.js"></script>',
                    'selector': '.boo5 > script:nth-child(1)'
                },
                'lineNumber': 8,
                'columnNumber': 28
            }
        }));
    });

    it('Script nested in not class unique div tags', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'script',
                'htmlInfo': {
                    'outerHTML': '<script src="/script2.js"></script>',
                    'selector': 'div.boo:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > script:nth-child(1)'
                },
                'lineNumber': 20,
                'columnNumber': 28
            }
        }));
    });

    it('Subdocument via iframe tag', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'subdocument',
                'htmlInfo': {
                    'outerHTML': '<iframe src="/subdoc.html" width="300" height="200"></iframe>',
                    'selector': 'body > div:nth-child(3) > iframe:nth-child(1)'
                },
                'lineNumber': 28,
                'columnNumber': 12
            }
        }));
    });

    it('Media load type via audio tag', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'media',
                'htmlInfo': {
                    'outerHTML': '<audio controls="" src="/media/cc0-audio/t-rex-roar.mp3"></audio>',
                    'selector': 'body > figure:nth-child(4) > audio:nth-child(2)'
                },
                'lineNumber': 33,
                'columnNumber': 12
            }
        }));
    });

    it('Img load type via img tag', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'img',
                'htmlInfo': {
                    'outerHTML': '<img src="/img.png">',
                    'selector': 'body > div:nth-child(5) > div:nth-child(1) > img:nth-child(1)'
                },
                'lineNumber': 38,
                'columnNumber': 16
            }
        }));
    });

    it('Imageset load type via img tag', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'imageset',
                'htmlInfo': {
                    'outerHTML': '<img src="/img5.png" srcset="/img5.png 480w, /img5.png 800w">',
                    'selector': 'body > div:nth-child(5) > div:nth-child(1) > img:nth-child(2)'
                },
                'lineNumber': 39,
                'columnNumber': 16
            }
        }));
    });

    it('Imageset load type via source tag', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'imageset',
                'htmlInfo': {
                    'outerHTML': '<img src="/img.jpg" alt="Image">',
                    'selector': 'body > picture:nth-child(6) > img:nth-child(2)'
                },
                'lineNumber': 45,
                'columnNumber': 12
            }
        }));
    });

    it('Styleseet load type via link tag', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'stylesheet',
                'htmlInfo': {
                    'outerHTML': '<link rel="stylesheet" href="styles.css">',
                    'selector': 'body > link:nth-child(7)'
                },
                'lineNumber': 48,
                'columnNumber': 8
            }
        }));
    });

    it('Media load type via source tag', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'media',
                'htmlInfo': {
                    'outerHTML': '<source src="forrest_gump.ogg" type="video/ogg">',
                    'selector': 'body > video:nth-child(8) > source:nth-child(1)'
                },
                'lineNumber': 51,
                'columnNumber': 12
            }
        }));
    });

    it('Imageset load type, for resource from srcset attr', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/css-selectors.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'imageset',
                'htmlInfo': {
                    'outerHTML': '<img src="/img7.png" srcset="/img5x.png 480w, /img5x.png 800w">',
                    'selector': 'body > img:nth-child(9)'
                },
                'lineNumber': 54,
                'columnNumber': 8
            }
        }));
    });

    it('Img from page with bad encoding', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/bad-encoding.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'img',
                'htmlInfo': {
                    'outerHTML': '<img src="/bad-enc/img.png">',
                    'selector': 'body > div:nth-child(5) > img:nth-child(1)'
                },
                'lineNumber': 17,
                'columnNumber': 4
            }
        }));
    });

    it('Script from page with bad encoding', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/bad-encoding.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'script',
                'htmlInfo': {
                    'outerHTML': '<script src="/bad-enc/script1.js"></script>',
                    'selector': 'body > div:nth-child(6) > script:nth-child(1)'
                },
                'lineNumber': 19,
                'columnNumber': 33
            }
        }));
    });

    it('URL from imgsrc with relative path', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/relative_path_html_tracking/index.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'imageset',
                'htmlInfo': {
                    'outerHTML': '<img src="images/img7.png" srcset="images/img5x.png 480w, images/img5x.png 800w">',
                    'selector': 'body > img:nth-child(1)'
                },
                'lineNumber': 2,
                'columnNumber': 8
            }
        }));
    });

    it('URL from image with relative path', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/relative_path_html_tracking/index.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'img',
                'htmlInfo': {
                    'outerHTML': '<img src="images/img8.png">',
                    'selector': 'body > img:nth-child(2)'
                },
                'lineNumber': 3,
                'columnNumber': 8
            }
        }));
    });

    it('URL from style with relative path', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/relative_path_html_tracking/index.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'stylesheet',
                'htmlInfo': {
                    'outerHTML': '<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">',
                    'selector': 'body > link:nth-child(3)'
                },
                'lineNumber': 4,
                'columnNumber': 8
            }
        }));
    });

    it('URL from script with relative path', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/relative_path_html_tracking/index.html');
        await dpa.run(url, false, true, true);
        const hars = dpa.getAllDeps().map(JSONObjectFromHAR);
        expect(hars).toContain(jasmine.objectContaining({
            'initiator': {
                'type': 'script',
                'htmlInfo': {
                    'outerHTML': '<script src="js/script.js"></script>',
                    'selector': 'body > script:nth-child(4)'
                },
                'lineNumber': 5,
                'columnNumber': 8
            }
        }));
    });
});
