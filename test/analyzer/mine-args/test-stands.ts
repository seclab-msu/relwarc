import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";
import { makeAndRunSimple } from './common';
import { UNKNOWN } from "../../../src/analyzer/types/unknown";
import { FormDataModel } from "../../../src/analyzer/types/form-data";
import * as fs from 'fs';

describe("Analyzer finding args of DEPs in stands", () => {
	it("aldine.edu.in", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/aldine.edu.in.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
		    "args": [
		        {
		            "type": "POST",
		            "cache": false,
		            "url": "/urlAjax.php",
		            "data": "content_type=announcement&nocache=0.8782736846632295&jxcall=cms-fetch-jx",
		            "dataType": "json"
		        }
		    ]
        } as SinkCall);
    });
    it("asbilbayi.com", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/asbilbayi.com.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
		    "args": [
		        {
		            "type": "GET",
		            "url": "/sepete-ekle-hizli?islem=hizliekle",
		            "data": "urunkodu=UNKNOWN&adet_lefkosa=0&adet_magosa=UNKNOWN",
		            "cache": false,
		            "success": UNKNOWN
		        }
		    ]
        } as SinkCall);
    });
    it("jaist.ac.jp", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/jaist.ac.jp.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "jQuery.ajax",
		    "args": [
		        {
		            "url": "/contact/cgi-bin/aform_checker.cgi",
		            "dataType": "jsonp",
		            "data": {
		                "__mode": "rebuild_aform",
		                "aform_id": UNKNOWN
		            },
		            "success": UNKNOWN
		        }
		    ]
        } as SinkCall);
    });
    it("myporn.club", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/myporn.club.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.post",
		    "args": [
		        "/api/v0.1/uniqcheck/uniqcheck.php",
		        {
		            "field": "email",
		            "value": UNKNOWN
		        },
		        UNKNOWN
		    ]
        } as SinkCall);
    });
    it("neuvoo.co.in", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/neuvoo.co.in.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.get",
		    "args": [
		        "/services/email-register-popup/email_side_v3.php",
		        {
		            "k": UNKNOWN,
		            "l": UNKNOWN,
		            "country": "in",
		            "lang": "en",
		            "source": "email_registration"
		        },
		        UNKNOWN
		    ]
        } as SinkCall);
    });
    it("popco.net", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/popco.net.js").toString();
        const analyzer = makeAndRunSimple(sourceCode);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.load",
		    "args": [
		        "view_comment_list.php?id=event&no=97&c_page=1"
		    ]
        } as SinkCall);
    });
    it("zeebiz.com", () => {
		const sourceCode = fs.readFileSync(__dirname + "/../data/zeebiz.com.js").toString();
        const analyzer = makeAndRunSimple(sourceCode, 'http://zeebiz.com.stands.fuchsia/market/stock-index-bse-sensex');
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
		    "args": [
		        {
		            "cache": false,
		            "url": "http://zeebiz.com.stands.fuchsia/market/content_api/webmethod=index_markets_details&exchange=bse&securitycode=UNKNOWN",
		            "type": "get",
		            "dataType": "json",
		            "async": false,
		            "success": UNKNOWN
		        }
		    ]
        } as SinkCall);
    });
    it("superprof.es", () => {
        const analyzer = new Analyzer();
        fs.readdirSync(__dirname + "/../data/superprof.es").forEach(file => {
          var sourceCode = fs.readFileSync(__dirname + '/../data/superprof.es/' + file).toString();
          analyzer.addScript(sourceCode);
        });
        analyzer.analyze("http://example.com/");
        expect(analyzer.results.length).toEqual(39);
        expect(analyzer.results[8]).toEqual({
            "funcName": "$.ajax",
		    "args": [
		        {
		            "type": "POST",
		            "url": "/blog/wp-admin/admin-ajax.php",
		            "data": new FormDataModel({
	                    "action": "wpdLoadMoreComments",
	                    "offset": 1,
	                    "orderBy": "comment_date_gmt",
	                    "order": "desc",
	                    "lastParentId": UNKNOWN,
	                    "wpdiscuz_last_visit": UNKNOWN,
	                    "postId": 48839,
		            }),
		            "contentType": false,
		            "processData": false
		        }
		    ]
        } as SinkCall);
    });
    it("baodautu.vn", () => {
        const analyzer = new Analyzer();
        fs.readdirSync(__dirname + "/../data/baodautu.vn").forEach(file => {
          var sourceCode = fs.readFileSync(__dirname + '/../data/baodautu.vn/' + file).toString();
          analyzer.addScript(sourceCode);
        });
        analyzer.analyze("http://example.com/");
        expect(analyzer.results.length).toEqual(4);
        expect(analyzer.results[2]).toEqual({
            "funcName": "$.ajax",
            "args": [
                {
                    "type": "POST",
                    "url": "index.php?mod=home&act=like_comment",
                    "data": {
                        "comment_id": UNKNOWN
                    },
                    "context": UNKNOWN,
                    "dataType": "html",
                    "success": UNKNOWN
                }
            ]
        } as SinkCall);
    });
});