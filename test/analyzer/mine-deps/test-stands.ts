import { Analyzer } from "../../../src/analyzer/analyzer";
import { makeAndRunSimple } from './common';
import * as fs from 'fs';

describe("Analyzer mining HARs for DEPs in stands", () => {
	it("aldine.edu.in", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/aldine.edu.in.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://example.com/urlAjax.php");
        expect(dep.method).toEqual("POST");
        expect(dep.getHeader('host')).toEqual("example.com");
        const expectedPostBody = 'content_type=announcement&nocache=0.8782736846632295&jxcall=cms-fetch-jx';
        const expectedPostData = {
            text: expectedPostBody,
            params: [
                { name: 'content_type', value: 'announcement' },
                { name: 'nocache', value: '0.8782736846632295' },
                { name: 'jxcall', value: 'cms-fetch-jx'}
            ],
            mimeType: "application/x-www-form-urlencoded"
        };
        
        expect(dep.bodySize).toEqual(expectedPostBody.length);

        const postData = dep.getPostData();

        expect(postData).toBeDefined();

        if (typeof postData !== 'undefined') {
            expect(postData).toEqual(expectedPostData);
        }
    });
    it("asbilbayi.com", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/asbilbayi.com.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://example.com/sepete-ekle-hizli?islem=hizliekle&urunkodu=UNKNOWN&adet_lefkosa=0&adet_magosa=UNKNOWN");
        expect(dep.method).toEqual("GET");
        expect(dep.getHeader('host')).toEqual("example.com");
        expect(dep.queryString).toEqual([
            { name: "islem", value: "hizliekle" },
            { name: "urunkodu", value: "UNKNOWN" },
            { name: "adet_lefkosa", value: "0" },
            { name: "adet_magosa", value: "UNKNOWN" }
        ]);
        expect(dep.bodySize).toEqual(0);
    });
    it("jaist.ac.jp", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/jaist.ac.jp.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://example.com/contact/cgi-bin/aform_checker.cgi?__mode=rebuild_aform&aform_id=UNKNOWN&callback=jQuery111106567430573505544_1591529444128");
        expect(dep.method).toEqual("GET");
        expect(dep.getHeader('host')).toEqual("example.com");
        expect(dep.queryString).toEqual([
            { name: "__mode", value: "rebuild_aform" },
            { name: "aform_id", value: "UNKNOWN" },
            { name: "callback", value: "jQuery111106567430573505544_1591529444128" }
        ]);
        expect(dep.bodySize).toEqual(0);
    });
    it("myporn.club", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/myporn.club.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://example.com/api/v0.1/uniqcheck/uniqcheck.php");
        expect(dep.method).toEqual("POST");
        expect(dep.getHeader('host')).toEqual("example.com");
        const expectedPostBody = 'field=email&value=UNKNOWN';
        const expectedPostData = {
            text: expectedPostBody,
            params: [
                { name: 'field', value: 'email' },
                { name: 'value', value: 'UNKNOWN' }
            ],
            mimeType: "application/x-www-form-urlencoded"
        };
        
        expect(dep.bodySize).toEqual(expectedPostBody.length);

        const postData = dep.getPostData();

        expect(postData).toBeDefined();

        if (typeof postData !== 'undefined') {
            expect(postData).toEqual(expectedPostData);
        }
    });
    it("neuvoo.co.in", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/neuvoo.co.in.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://example.com/services/email-register-popup/email_side_v3.php?k=UNKNOWN&l=UNKNOWN&country=in&lang=en&source=email_registration");
        expect(dep.method).toEqual("GET");
        expect(dep.getHeader('host')).toEqual("example.com");
        expect(dep.queryString).toEqual([
            { name: "k", value: "UNKNOWN" },
            { name: "l", value: "UNKNOWN" },
            { name: "country", value: "in" },
            { name: "lang", value: "en" },
            { name: "source", value: "email_registration" }
        ]);
        expect(dep.bodySize).toEqual(0);
    });
    it("popco.net", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/popco.net.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://example.com/view_comment_list.php?id=event&no=97&c_page=1");
        expect(dep.method).toEqual("GET");
        expect(dep.getHeader('host')).toEqual("example.com");
        expect(dep.queryString).toEqual([
            { name: "id", value: "event" },
            { name: "no", value: "97" },
            { name: "c_page", value: "1" }
        ]);
        expect(dep.bodySize).toEqual(0);
    });
    it("zeebiz.com", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/zeebiz.com.js").toString();
        const analyzer = makeAndRunSimple(sourceCode, 'http://zeebiz.com.stands.fuchsia/market/stock-index-bse-sensex');
        expect(analyzer.hars.length).toEqual(1);

        const dep = analyzer.hars[0];

        expect(dep.url).toEqual("http://zeebiz.com.stands.fuchsia/market/content_api/webmethod=index_markets_details&exchange=bse&securitycode=UNKNOWN");
        expect(dep.method).toEqual("GET");
        expect(dep.getHeader('host')).toEqual("zeebiz.com.stands.fuchsia");
        expect(dep.queryString).toEqual([]);
        expect(dep.bodySize).toEqual(0);
    });
});