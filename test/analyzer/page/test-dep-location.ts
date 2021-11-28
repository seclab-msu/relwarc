import { DynamicPageAnalyzer } from '../../../src/dynamic-page-analyzer';
import { readTar } from '../../../src/read-tar';
import { testWS } from './webserver'

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

    it('Mark on commented DEP', async () => {
        const dpa = new DynamicPageAnalyzer();
        const url = testWS.getFullURL('/test-dep-location5.html');

        await dpa.run(url, true);

        const hars = dpa.analyzerDEPs.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': testWS.getFullURL('/example'),
            'queryString': [],
            'bodySize': 0,
            'initiator': {
                'type': 'analyzer',
                'url': testWS.getFullURL('/test-dep-location5.html'),
                'lineNumber': 3,
                'columnNumber': 1,
                'commented': true
            }
        }));
        expect(hars).toContain(jasmine.objectContaining({
            'method': 'GET',
            'url': testWS.getFullURL('/test'),
            'queryString': [],
            'bodySize': 0,
            'initiator': {
                'type': 'analyzer',
                'url': testWS.getFullURL('/test-dep-location5.html'),
                'lineNumber': 5,
                'columnNumber': 8
            }
        }));
    });
});

