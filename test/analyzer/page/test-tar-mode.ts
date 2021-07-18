import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';
import { readTar } from '../../../src/read-tar';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Analyzing DEPs from TAR', () => {
    it('params in different scripts', async () => {
        const [mapURLs, resources] = await readTar('test/analyzer/page/www/test-tar-1.tar');

        const url = mapURLs['index.html'];

        const dpa = new DynamicPageAnalyzer({mapURLs, resources});

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": 'http://test.com/test/test?example=example',
            "queryString": [
            	{
            		"name": "example",
            		"value": "example"
            	}
            ],
            "bodySize": 0,
        }));
    });
    it('one param in querystring js-script', async () => {
        const [mapURLs, resources] = await readTar('test/analyzer/page/www/test-tar-2.tar');

        const url = mapURLs['index.html'];

        const dpa = new DynamicPageAnalyzer({mapURLs, resources});

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": 'http://test.com/test/url?q=123',
            "queryString": [
                {
                    "name": "q",
                    "value": "123"
                }
            ],
            "bodySize": 0,
        }));
    });
    it('two params in querystring js-script', async () => {
        const [mapURLs, resources] = await readTar('test/analyzer/page/www/test-tar-3.tar');

        const url = mapURLs['index.html'];

        const dpa = new DynamicPageAnalyzer({mapURLs, resources});

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": 'http://test.com/test/url?q=123',
            "queryString": [
                {
                    "name": "q",
                    "value": "123"
                }
            ],
            "bodySize": 0,
        }));
    });
    it('two scripts with different querystring', async () => {
        const [mapURLs, resources] = await readTar('test/analyzer/page/www/test-tar-4.tar');

        const url = mapURLs['index.html'];

        const dpa = new DynamicPageAnalyzer({mapURLs, resources});

        await dpa.run(url);

        expect(dpa.analyzer.hars.length).toBeGreaterThan(0);

        const hars = dpa.analyzer.hars.map(JSONObjectFromHAR);

        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": 'http://test.com/test/testing?s=1',
            "queryString": [
                {
                    "name": "s",
                    "value": "1"
                }
            ],
            "bodySize": 0,
        }));
        expect(hars).toContain(jasmine.objectContaining({
            "method": "GET",
            "url": 'http://test.com/test/example?q=123',
            "queryString": [
                {
                    "name": "q",
                    "value": "123"
                }
            ],
            "bodySize": 0,
        }));
    });
    it('Tar without required js-script', async () => {
        const [mapURLs, resources] = await readTar('test/analyzer/page/www/test-tar-5.tar');

        const url = mapURLs['index.html'];

        const dpa = new DynamicPageAnalyzer({mapURLs, resources});

        await dpa.run(url)
    });
});
