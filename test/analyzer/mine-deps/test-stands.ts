import { runSingleTest } from '../utils';
import { UNKNOWN } from '../../../src/analyzer/types/unknown';
import * as fs from 'fs';

describe('Analyzer mining HARs for DEPs in stands', () => {
    it('aldine.edu.in', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/aldine.edu.in.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/urlAjax.php',
                queryString: [],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    },
                    {
                        name: 'Content-Length',
                        value: '72'
                    }
                ],
                bodySize: 72,
                method: 'POST',
                postData: {
                    text: 'content_type=announcement&nocache=0.8782736846632295&jxcall=cms-fetch-jx',
                    params: [
                        { name: 'content_type', value: 'announcement' },
                        { name: 'nocache', value: '0.8782736846632295' },
                        { name: 'jxcall', value: 'cms-fetch-jx' }
                    ],
                    mimeType: 'application/x-www-form-urlencoded'
                }
            },
            true,
            'http://example.com/'
        );
    });

    it('asbilbayi.com', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/asbilbayi.com.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/sepete-ekle-hizli?islem=hizliekle&urunkodu=UNKNOWN&adet_lefkosa=0&adet_magosa=UNKNOWN',
                queryString: [
                    { name: 'islem', value: 'hizliekle' },
                    { name: 'urunkodu', value: 'UNKNOWN' },
                    { name: 'adet_lefkosa', value: '0' },
                    { name: 'adet_magosa', value: 'UNKNOWN' }
                ],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            },
            true,
            'http://example.com/'
        );
    });

    it('jaist.ac.jp', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/jaist.ac.jp.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/contact/cgi-bin/aform_checker.cgi?__mode=rebuild_aform&aform_id=UNKNOWN&callback=jQuery111106567430573505544_1591529444128',
                queryString: [
                    { name: '__mode', value: 'rebuild_aform' },
                    { name: 'aform_id', value: 'UNKNOWN' },
                    { name: 'callback', value: 'jQuery111106567430573505544_1591529444128' }
                ],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            },
            true,
            'http://example.com/'
        );
    });

    it('myporn.club', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/myporn.club.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/api/v0.1/uniqcheck/uniqcheck.php',
                queryString: [],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    },
                    {
                        name: 'Content-Length',
                        value: '25'
                    }
                ],
                bodySize: 25,
                method: 'POST',
                postData: {
                    text: 'field=email&value=UNKNOWN',
                    params: [
                        { name: 'field', value: 'email' },
                        { name: 'value', value: 'UNKNOWN' }
                    ],
                    mimeType: 'application/x-www-form-urlencoded'
                }
            },
            true,
            'http://example.com/'
        );
    });

    it('neuvoo.co.in', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/neuvoo.co.in.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/services/email-register-popup/email_side_v3.php?k=UNKNOWN&l=UNKNOWN&country=in&lang=en&source=email_registration',
                queryString: [
                    { name: 'k', value: 'UNKNOWN' },
                    { name: 'l', value: 'UNKNOWN' },
                    { name: 'country', value: 'in' },
                    { name: 'lang', value: 'en' },
                    { name: 'source', value: 'email_registration' }
                ],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            },
            true,
            'http://example.com/'
        );
    });

    it('popco.net', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/popco.net.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/view_comment_list.php?id=event&no=97&c_page=1',
                queryString: [
                    { name: 'id', value: 'event' },
                    { name: 'no', value: '97' },
                    { name: 'c_page', value: '1' }
                ],
                headers: [
                    {
                        value: 'example.com',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            },
            true,
            'http://example.com/'
        );
    });

    it('zeebiz.com', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/zeebiz.com.js').toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://zeebiz.com.stands.fuchsia/market/content_api/webmethod=index_markets_details&exchange=bse&securitycode=UNKNOWN',
                queryString: [],
                headers: [
                    {
                        value: 'zeebiz.com.stands.fuchsia',
                        name: 'Host',
                    }
                ],
                bodySize: 0,
                method: 'GET'
            },
            true,
            'http://zeebiz.com.stands.fuchsia/market/stock-index-bse-sensex'
        );
    });

    it('superprof.es', () => {
        const scripts: string[] = [];
        fs.readdirSync(__dirname + '/../data/superprof.es').forEach(file => {
            scripts.push(fs.readFileSync(__dirname + '/../data/superprof.es/' + file).toString());
        });
        runSingleTest(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://example.com/blog/wp-admin/admin-ajax.php',
                queryString: [],
                headers: [
                    { name: 'Host', value: 'example.com' },
                    { name: 'Content-Type', value: 'multipart/form-data' },
                    { name: 'Content-Length', value: '0' }
                ],
                bodySize: 0,
                method: 'POST',
                postData: {
                    text: null,
                    mimeType: 'multipart/form-data',
                    params: [
                        { name: 'action', value: 'wpdLoadMoreComments' },
                        { name: 'offset', value: 1 },
                        { name: 'orderBy', value: 'comment_date_gmt' },
                        { name: 'order', value: 'desc' },
                        { name: 'lastParentId', value: UNKNOWN },
                        { name: 'wpdiscuz_last_visit', value: UNKNOWN },
                        { name: 'postId', value: 48839 }
                    ]
                }
            },
            true,
            'http://example.com/'
        );
    });

    it('baodautu.vn', () => {
        const scripts: string[] = [];
        fs.readdirSync(__dirname + '/../data/baodautu.vn').forEach(file => {
            scripts.push(fs.readFileSync(__dirname + '/../data/baodautu.vn/' + file).toString());
        });
        runSingleTest(
            scripts,
            {
                url: 'http://example.com/index.php?mod=home&act=like_comment',
                method: 'POST',
                httpVersion: 'HTTP/1.1',
                headers: [
                    { name: 'Host', value: 'example.com' },
                    { name: 'Content-Type', value: 'application/x-www-form-urlencoded' },
                    { name: 'Content-Length', value: '18' }
                ],
                queryString: [
                    { name: 'mod', value: 'home' },
                    { name: 'act', value: 'like_comment' }
                ],
                bodySize: 18,
                postData: {
                    text: 'comment_id=UNKNOWN',
                    mimeType: 'application/x-www-form-urlencoded',
                    params: [
                        { name: 'comment_id', value: 'UNKNOWN' },
                    ]
                }
            },
            true,
            'http://example.com/'
        );
    });
    it('akademus.es', () => {
        const scripts: string[] = [];
        fs.readdirSync(__dirname + '/../data/akademus.es').forEach(file => {
            scripts.push(fs.readFileSync(__dirname + '/../data/akademus.es/' + file).toString());
        });
        runSingleTest(
            scripts,
            {
                url: 'http://example.com/api/user/forgot-password/?username=UNKNOWN&format=json&callback=jQuery111106567430573505544_1591529444128',
                method: 'GET',
                httpVersion: 'HTTP/1.1',
                headers: [
                    { name: 'Host', value: 'example.com' }
                ],
                queryString: [
                    { name: 'username', value: 'UNKNOWN' },
                    { name: 'format', value: 'json' },
                    { name: 'callback', value: 'jQuery111106567430573505544_1591529444128' }
                ],
                bodySize: 0,
            },
            true,
            'http://example.com/'
        );
    });
});
