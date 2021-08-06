import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';
import { readTar } from '../../../src/read-tar';
import { run as runTestWebServer } from './webserver';

const testWS = runTestWebServer();

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Tests for DEPs location on web page', () => {
    it('request in "<script>" tag on html page', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-dep-location1.html');

        await dpa.run(url);

        const hars = dpa.analyzerDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': testWS.getFullURL('/example'),
            'queryString': [],
            'bodySize': 0,
            'initiator': {
                'type': 'analyzer',
                'lineNumber': 4,
                'columnNumber': 8,
                'url': testWS.getFullURL('/test-dep-location1.html')
            }
        }));
        dpa.close();
    });

    it('request in JS file connected to html page', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-dep-location2.html');

        await dpa.run(url);

        const hars = dpa.analyzerDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': testWS.getFullURL('/test1'),
            'queryString': [],
            'bodySize': 0,
            'initiator': {
                'type': 'analyzer',
                'lineNumber': 0,
                'columnNumber': 0,
                'url': testWS.getFullURL('/test-dep-location2.js')
            }
        }));
        dpa.close();
    });

    it('correct initiator url in TAR-mode', async () => {
        const [url, mapURLs] = await readTar('test/analyzer/page/www/test-dep-location3.tar');

        const dpa = new DynamicPageAnalyzer({mapURLs});

        await dpa.run(url);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': 'http://test123.com/qwerty',
            'queryString': [],
            'bodySize': 0,
            'initiator': {
                'type': 'analyzer',
                'lineNumber': 1,
                'columnNumber': 0,
                'url': 'http://test123.com/example.js'
            }
        }));
        dpa.close();
    });

    it('dynamic evaled script', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/dynamic-evaled/test-dep-location4.html');

        await dpa.run(url);

        const hars = dpa.analyzerDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': testWS.getFullURL('/test'),
            'queryString': [],
            'bodySize': 0,
            'initiator': {
                'type': 'analyzer',
                'lineNumber': 3,
                'columnNumber': 12,
                'url': 'dynamically evaled code from script ' + testWS.getFullURL('/dynamic-evaled/jquery-2.2.3.js'),
            }
        }));
        dpa.close();
    });
});

