import { runSingleTest } from "../run-tests-helper"
import * as fs from 'fs';

describe("Analyzer finding HARs of DEPs in combined stand", () => {
    it("DEP number 3 har (just ajax request)", function() {
        const scripts  = [
            `$.ajax({
                url: '/application/jie8Ye/interface/aesi9X/handle',
                data: {
                    'Po3oom': "1",
                },
            });`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/jie8Ye/interface/aesi9X/handle?Po3oom=1",
                queryString: new Set([
                    {
                        name: "Po3oom",
                        value: "1",
                    },
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    },
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true);
    });

    it('DEP number 4 har (function is called when an event "onclick" occurs)', function() {
        const scripts  = [
            `function request4() {
                $.ajax({
                    url: '/application/Yai0au/interface/Eikei0/handle',
                    data: {
                        'Me1ii7': "1",
                    },
                });
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/Yai0au/interface/Eikei0/handle?Me1ii7=1",
                queryString: new Set([
                    {
                        name: "Me1ii7",
                        value: "1",
                    },
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    },
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });

    it("DEP number 5 har (addEventListener function)", function() {
        const scripts  = [
            `function request5() {
                $.ajax({
                    url: '/application/aeP2je/interface/aiH7io/handle',
                    data: {
                        'ieW5ie': "1",
                    },
                });
            }
            document.getElementById('req5').addEventListener('click', request5);`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/aeP2je/interface/aiH7io/handle?ieW5ie=1",
                queryString: new Set([
                    {
                        name: "ieW5ie",
                        value: "1",
                    },
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    },
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });

    it("DEP number 6 har (ajax request with string literals)", function() {
        const scripts  = [
            `function request6() {
                $.ajax({
                    url: '/application/aet0Mu/interface/MooS8u/handle',
                      data: {
                          'veiw4I': "1",
                      },
                });
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/aet0Mu/interface/MooS8u/handle?veiw4I=1",
                queryString: new Set([
                    {
                        name: "veiw4I",
                        value: "1",
                    },
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    },
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });
    
    it("DEP number 7 har (concat global variable and string literal in request)", function() {
        const scripts  = [
            `var api = "/application/iuT6ei/";

            function request7() {
                $.post(api+"interface/Eek0Mu/handle", {'eeNgi6': "1"});
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/iuT6ei/interface/Eek0Mu/handle",
                queryString: new Set([]),
                postData: { 
                    text: 'eeNgi6=1', 
                    mimeType: 'application/x-www-form-urlencoded',
                    params: new Set([
                        { 
                            name: 'eeNgi6', 
                            value: '1' 
                        }
                    ])
                },
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    },
                    { 
                        name: 'Content-Type', 
                        value: 'application/x-www-form-urlencoded'
                    },
                    { 
                        name: 'Content-Length', 
                        value: '8' 
                    }
                ]),
                bodySize: 8,
                method: "POST"   
            },
            true
        );
    });

    it("DEP number 8 har (params for ajax request are local variables)", function() {
        const scripts  = [
            `function request8() {
                var url = "/application/gf32d2/interface/vcj442/handle";
                var param = "lkvo24=1";
                $.ajax({
                    type: "GET",
                    url: url,
                    data: param
                });
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/gf32d2/interface/vcj442/handle?lkvo24=1",
                queryString: new Set([
                    {
                        name: "lkvo24",
                        value: "1"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });
 
    it("DEP number 9 (url depends on global var, which is changed in other script)", () => {
        const scripts  = [
            `var param9 = "";

            function request9() {
                var url = "/application/n3m1k2/interface/zgjj56/handle?lk90pj=1";
                    url = url + "&" + param9;
                $.ajax({
                    type: "GET",
                    url: url
                });
            }`,
            `param9 = "control=" + "asde11";`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/n3m1k2/interface/zgjj56/handle?lk90pj=1&control=asde11",
                queryString: new Set([
                    {
                        name: "lk90pj",
                        value: "1"
                    },
                    {
                        name: "control",
                        value: "asde11"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });

    it("DEP number 10 har (overlapping scopes of variables)", function() {
        const scripts  = [
            fs.readFileSync(__dirname + "/../data/10.js").toString()
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/p0065n/interface/zbtghr/handle?hg3f2d=4&id=12",
                queryString: new Set([
                    {
                        name: "hg3f2d",
                        value: "4"
                    },
                    {
                        name: "id",
                        value: "12"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });

    it("DEP number 11 har (template strings)", function() {
        const scripts  = [
            fs.readFileSync(__dirname + "/../data/11.js").toString()
        ];
        runSingleTest(
            scripts,
            {
                url: "http://test.com/application/kl3j5h/interface/32nhj4/handle?qh44j3=1&surveiller=po89uo",
                method: "GET",
                httpVersion: "HTTP/1.1",
                headers: new Set([
                    {
                        name: "Host",
                        value: "test.com"
                    }
                ]),
                queryString: new Set([
                    {
                        name: "qh44j3",
                        value: "1"
                    },
                    {
                        name: "surveiller",
                        value: "po89uo"
                    }
                ]),
                bodySize: 0  
            },
            true
        );
    });

    it("DEP number 12 har (params for request taken from global config, which is literal object)", function() {
        const scripts  = [
            `function request12() {
                var request_args = {
                    "nba67x": configUn1.ssx46
                };
                $.ajax({
                    type: "GET",
                    url: configUn1.url,
                    data: request_args
                });
            }`,
            `var configUn1 = {
                id: "1",
                url: "/application/thq019/interface/nhqmz8/handle",
                isActive: "0",
                ssx46: 2
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/thq019/interface/nhqmz8/handle?nba67x=2",
                queryString: new Set([
                    {
                        name: "nba67x",
                        value: "2"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true);
    });
    
    it("DEP number 13 har (params for request taken from global config, which is new Object)", function() {
        const scripts  = [
            `function request13() {
                $.ajax({
                    type: "GET",
                    url: configUn2.url,
                    data: "a09bku=" + configUn2.a09bku
                });
            }`,
            `var configUn2 = new Object;
            configUn2.id = "1",
            configUn2.url = "/application/lm3b22/interface/b1nqjc/handle",
            configUn2.isActive = "0";
            configUn2.a09bku = 5;`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/lm3b22/interface/b1nqjc/handle?a09bku=5",
                queryString: new Set([
                    {
                        name: "a09bku",
                        value: "5"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });

    it("DEP number 14 har (params for request taken from local config, which is new Object)", function() {
        const scripts  = [
            `function request14() {
                var request = new Object();
                request.country = "country";
                request.lang = "language";
                request.phgoo9 = "1";
                url = "/application/nh3k21/interface/hd73h4/handle";
                $.get(url,request);
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/nh3k21/interface/hd73h4/handle?country=country&lang=language&phgoo9=1",
                queryString: new Set([
                    {
                        name: "country",
                        value: "country"
                    },
                    {
                        name: "lang",
                        value: "language"
                    },
                    {
                        name: "phgoo9",
                        value: "1"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });

    it("DEP number 16 har (IIFE and call-chain inside)", function() {
        const scripts  = [
            `(function () {
                var entity = 91,
                    hand = 2,
                    enapwodniw = configUn3.x956;
                
                function setParams() {
                    var z = {
                        "nv7": entity,
                        "qng1f3": hand,
                        "id": "1"
                    }
                    request16(z);
                }
                function request16(params){
                    params.windowpane = enapwodniw;
                    $.get(configUn3.url, params);
                }
            })();`,
            `var configUn3 = {
                id: "1",
                url: "/application/lfi32b/interface/bjfu93/handle",
                isActive: "0",
                x956: 35129
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/lfi32b/interface/bjfu93/handle?nv7=91&qng1f3=2&id=1&windowpane=35129",
                queryString: new Set([
                    {
                        name: "nv7",
                        value: "91"
                    },
                    {
                        name: "qng1f3",
                        value: "2"
                    },
                    {
                        name: "id",
                        value: "1"
                    },
                    {
                        name: "windowpane",
                        value: "35129"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    }); 

    it("DEP number 17 har (multipart request)", function() {
        const scripts  = [
            `function request17() {
                var data = new FormData();
                data.append('ffdj3v', '1');
                data.append('action', 'delete');
                data.append('tag', 'rand');
                $.ajax({
                    type: 'POST',
                    url: "/application/j4b2yh/interface/9fdh32/handle",
                    data: data,
                    processData: false,
                    contentType: false
                });
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/j4b2yh/interface/9fdh32/handle",
                queryString: new Set([]),
                postData: { 
                    text: null, 
                    mimeType: 'multipart/form-data',
                    params: new Set([
                        {
                            name: 'ffdj3v', 
                            value: '1' 
                        },
                        { 
                            name: 'action', 
                            value: 'delete' 
                        },
                        { 
                            name: 'tag', 
                            value: 'rand' 
                        }
                    ])
                },
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    },
                    { 
                        name: 'Content-Type', 
                        value: 'multipart/form-data'
                    },
                    { 
                        name: 'Content-Length', 
                        value: '0' 
                    }
                ]),
                bodySize: 0,
                method: "POST"   
            },
            true
        );
    });

    it("DEP number 18 har (parse location for request params)", function() {
        const scripts  = [
            `function request18() {
                var baseUrl = document.location.origin;
                var path = window.location.pathname;
                var path1 = path.split("/")[1];
                $.ajax({
                  url: baseUrl + '/application/' + path1 + '/interface/Ua9xek/handle?abi1Lu=1',
                });
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/test/interface/Ua9xek/handle?abi1Lu=1",
                queryString: new Set([
                    {
                        name: "abi1Lu",
                        value: "1"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });

    it("DEP number 19 har (new JS features)", function() {
        const scripts  = [
            `request19 = () => {
                const url = '/application/to0Hei/interface/maM2uc/handle';
                let data = '2';
                try {
                  $.ajax({
                    'url': url,
                    'data': {
                      'Pue6Ee': data
                    }
                  });
                } catch {
                  console.log('request error');
                }
            }`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/application/to0Hei/interface/maM2uc/handle?Pue6Ee=2",
                queryString: new Set([
                    {
                        name: "Pue6Ee",
                        value: "2"
                    }
                ]),
                headers: new Set([
                    {
                        value: "test.com",
                        name: "Host",
                    }
                ]),
                bodySize: 0,
                method: "GET"   
            },
            true
        );
    });
});