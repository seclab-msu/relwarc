import { DynamicPageAnalyzer } from '../../../src/analyzer/dynamic-page-analyzer';
import { readTar } from '../../../src/read-tar';

function JSONObjectFromHAR(har: object): object {
    return JSON.parse(JSON.stringify(har));
}

describe('Analyzing DEPs from TAR', () => {
    it('params in different scripts', async () => {
    	const [mapURLs, contentURLs] = await readTar('test/analyzer/page/www/example.tar');

        const url = mapURLs['index.html'];

        const dpa = new DynamicPageAnalyzer(mapURLs, contentURLs);

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
});