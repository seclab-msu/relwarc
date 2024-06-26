import { SinkCall } from '../../../src/analyzer';
import { runSingleTestSinkCall } from '../utils/utils';
import { UNKNOWN } from '../../../src/types/unknown';
import { FormDataModel } from '../../../src/types/form-data';
import * as fs from 'fs';

describe('Analyzer finding args of DEPs in stands', () => {
    it('aldine.edu.in', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/aldine.edu.in.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        'type': 'POST',
                        'cache': false,
                        'url': '/urlAjax.php',
                        'data': 'content_type=announcement&nocache=0.8782736846632295&jxcall=cms-fetch-jx',
                        'dataType': 'json'
                    }
                ]
            } as SinkCall,
        );
    });

    it('asbilbayi.com', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/asbilbayi.com.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        'type': 'GET',
                        'url': '/sepete-ekle-hizli?islem=hizliekle',
                        'data': 'urunkodu=UNKNOWN&adet_lefkosa=0&adet_magosa=undefined',
                        'cache': false,
                        'success': UNKNOWN
                    }
                ]
            } as SinkCall,
        );
    });

    it('jaist.ac.jp', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/jaist.ac.jp.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'jQuery.ajax',
                'args': [
                    {
                        'url': '/contact/cgi-bin/aform_checker.cgi',
                        'dataType': 'jsonp',
                        'data': {
                            '__mode': 'rebuild_aform',
                            'aform_id': UNKNOWN
                        },
                        'success': UNKNOWN
                    }
                ]
            } as SinkCall,
        );
    });

    it('myporn.club', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/myporn.club.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.post',
                'args': [
                    '/api/v0.1/uniqcheck/uniqcheck.php',
                    {
                        'field': 'email',
                        'value': UNKNOWN
                    },
                    UNKNOWN
                ]
            } as SinkCall,
        );
    });

    it('neuvoo.co.in', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/neuvoo.co.in.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.get',
                'args': [
                    '/services/email-register-popup/email_side_v3.php',
                    {
                        'k': UNKNOWN,
                        'l': UNKNOWN,
                        'country': 'in',
                        'lang': 'en',
                        'source': 'email_registration'
                    },
                    UNKNOWN
                ]
            } as SinkCall,
        );
    });

    it('popco.net', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/popco.net.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.load',
                'args': [
                    'view_comment_list.php?id=event&no=97&c_page=1'
                ]
            } as SinkCall,
        );
    });

    it('zeebiz.com', () => {
        const scripts = [
            fs.readFileSync(__dirname + '/../data/zeebiz.com.js').toString()
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        'cache': false,
                        'url': 'http://zeebiz.com.stands.fuchsia/market/content_api/webmethod=index_markets_details&exchange=bse&securitycode=UNKNOWN',
                        'type': 'get',
                        'dataType': 'json',
                        'async': false,
                        'success': UNKNOWN
                    }
                ]
            } as SinkCall,
            'http://zeebiz.com.stands.fuchsia/market/stock-index-bse-sensex',
        );
    });

    it('superprof.es', () => {
        const scripts: string[] = [];
        fs.readdirSync(__dirname + '/../data/superprof.es').forEach(file => {
            scripts.push(fs.readFileSync(__dirname + '/../data/superprof.es/' + file).toString());
        });
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        'type': 'POST',
                        'url': '/blog/wp-admin/admin-ajax.php',
                        'data': new FormDataModel({
                            'action': 'wpdLoadMoreComments',
                            'offset': 1,
                            'orderBy': 'comment_date_gmt',
                            'order': 'desc',
                            'lastParentId': UNKNOWN,
                            'wpdiscuz_last_visit': UNKNOWN,
                            'postId': 48839,
                        }),
                        'contentType': false,
                        'processData': false
                    }
                ]
            } as SinkCall,
        );
    });

    it('baodautu.vn', () => {
        const scripts: string[] = [];
        fs.readdirSync(__dirname + '/../data/baodautu.vn').forEach(file => {
            scripts.push(fs.readFileSync(__dirname + '/../data/baodautu.vn/' + file).toString());
        });
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        'type': 'POST',
                        'url': 'index.php?mod=home&act=like_comment',
                        'data': {
                            'comment_id': UNKNOWN
                        },
                        'context': UNKNOWN,
                        'dataType': 'html',
                        'success': UNKNOWN
                    }
                ]
            } as SinkCall,
        );
    });

    it('akademus.es', () => {
        const scripts: string[] = [];
        fs.readdirSync(__dirname + '/../data/akademus.es').forEach(file => {
            scripts.push(fs.readFileSync(__dirname + '/../data/akademus.es/' + file).toString());
        });
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.ajax',
                'args': [
                    {
                        'url': '/api/user/forgot-password/',
                        'jsonp': 'callback',
                        'dataType': 'jsonp',
                        'data': {
                            'username': UNKNOWN,
                            'format': 'json'
                        },
                        'success': UNKNOWN,
                        'error': UNKNOWN
                    }
                ]
            } as SinkCall,
        );
    });
});
