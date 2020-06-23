import { Analyzer } from "../../../src/analyzer/analyzer";
import { makeAndRunSimple } from './common';
import { HAR } from "../../../src/analyzer/hars";
import { UNKNOWN } from "../../../src/analyzer/types/unknown";
import * as fs from 'fs';

function makeHar(harIn: HAR): any {
    interface KeyValue {
        name: string;
        value: string;
    }

    interface HARForCheck {
        url: string;
        method: string;
        httpVersion: string;
        headers: KeyValue[];
        queryString: KeyValue[];
        bodySize: number;
        postData?: any;
    }

    const harOut: HARForCheck = {
        url: harIn.url,
        method: harIn.method,
        httpVersion: harIn.httpVersion,
        headers: harIn.headers,
        queryString: harIn.queryString,
        bodySize: harIn.bodySize,
        postData: harIn.getPostData() ? harIn.getPostData() : null,
    };
    if (harOut.postData == null) {
        delete harOut.postData;
    }

    return harOut;
}

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
    it("superprof.es", () => {
        const analyzer = new Analyzer();
        fs.readdirSync(__dirname + "/../data/superprof.es").forEach(file => {
          var sourceCode = fs.readFileSync(__dirname + '/../data/superprof.es/' + file).toString();
          analyzer.addScript(sourceCode);
        });
        analyzer.analyze("http://example.com/");
        let deps: any[] = [];
        analyzer.hars.forEach((dep) => deps.push(makeHar(dep)));
        expect(deps).toContain({
            url: "http://example.com/blog/wp-admin/admin-ajax.php",
            method: "POST",
            httpVersion: "HTTP/1.1",
            headers: [
                { name: "Host", value: "example.com" },
                { name: "Content-Type", value: "multipart/form-data"},
                { name: "Content-Length", value: "0" }
            ],
            queryString: [],
            bodySize: 0,
            postData: {
                text: null,
                mimeType: "multipart/form-data",
                params: [ 
                    { name: "action", value: "wpdLoadMoreComments" },
                    { name: "offset", value: 1 },
                    { name: "orderBy", value: "comment_date_gmt" },
                    { name: "order", value: "desc" },
                    { name: "lastParentId", value: UNKNOWN },
                    { name: "wpdiscuz_last_visit", value: UNKNOWN },
                    { name: "postId", value: 48839 }
                ]
            }
        });
    });
    it("baodautu.vn", () => {
        const analyzer = new Analyzer();
        fs.readdirSync(__dirname + "/../data/baodautu.vn").forEach(file => {
          var sourceCode = fs.readFileSync(__dirname + '/../data/baodautu.vn/' + file).toString();
          analyzer.addScript(sourceCode);
        });
        analyzer.analyze("http://example.com/");
        let deps: any[] = [];
        analyzer.hars.forEach((dep) => deps.push(makeHar(dep)));
        expect(deps).toContain({
            url: "http://example.com/index.php?mod=home&act=like_comment",
            method: "POST",
            httpVersion: "HTTP/1.1",
            headers: [
                { name: "Host", value: "example.com" },
                { name: "Content-Type", value: "application/x-www-form-urlencoded"},
                { name: "Content-Length", value: "18" }
            ],
            queryString: [
                { name: 'mod', value: 'home' },
                { name: 'act', value: 'like_comment' }
            ],
            bodySize: 18,
            postData: {
                text: "comment_id=UNKNOWN",
                mimeType: "application/x-www-form-urlencoded",
                params: [ 
                    { name: "comment_id", value: "UNKNOWN" },
                ]
            }
        });
    });
    it("akademus.es", () => {
        const analyzer = new Analyzer();
        fs.readdirSync(__dirname + "/../data/akademus.es").forEach(file => {
          var sourceCode = fs.readFileSync(__dirname + '/../data/akademus.es/' + file).toString();
          analyzer.addScript(sourceCode);
        });
        analyzer.analyze("http://example.com/");
        let deps: any[] = [];
        analyzer.hars.forEach((dep) => deps.push(makeHar(dep)));
        expect(deps).toContain({
            url: "http://example.com/api/user/forgot-password/?username=UNKNOWN&format=json&callback=jQuery111106567430573505544_1591529444128",
            method: "GET",
            httpVersion: "HTTP/1.1",
            headers: [
                { name: "Host", value: "example.com" }
            ],
            queryString: [
                { name: 'username', value: "UNKNOWN" },
                { name: 'format', value: 'json' },
                { name: 'callback', value: 'jQuery111106567430573505544_1591529444128' }
            ],
            bodySize: 0,
        });
    });
});