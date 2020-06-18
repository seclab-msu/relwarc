import { Analyzer } from "../../../src/analyzer/analyzer";
import { HAR } from "../../../src/analyzer/hars";
import * as fs from 'fs';


function makeAndRunSimple(script: string, url = "http://test.com/test"): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.analyze(url);
    return analyzer;
}

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


describe("Analyzer finding HARs of DEPs in combined stand", () => {
    it("DEP number 3 (har)", function() {
        const analyzer = makeAndRunSimple(`$.ajax({
            url: '/application/jie8Ye/interface/aesi9X/handle',
            data: {
                'Po3oom': "1",
            },
        });`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/jie8Ye/interface/aesi9X/handle?Po3oom=1",
            queryString: [
                {
                    name: "Po3oom",
                    value: "1",
                },
            ],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                },
            ],
            bodySize: 0,
            method: "GET"   
        });
    });

    it("DEP number 4 (har)", function() {
        const analyzer = makeAndRunSimple(`function request4() {
            $.ajax({
                url: '/application/Yai0au/interface/Eikei0/handle',
                data: {
                    'Me1ii7': "1",
                },
            });
        }`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/Yai0au/interface/Eikei0/handle?Me1ii7=1",
            queryString: [
                {
                    name: "Me1ii7",
                    value: "1",
                },
            ],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                },
            ],
            bodySize: 0,
            method: "GET"   
        });
    });

    it("DEP number 5 (har)", function() {
        const analyzer = makeAndRunSimple(`function request5() {
            $.ajax({
                url: '/application/aeP2je/interface/aiH7io/handle',
                data: {
                    'ieW5ie': "1",
                },
            });
        }
        document.getElementById('req5').addEventListener('click', request5);`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/aeP2je/interface/aiH7io/handle?ieW5ie=1",
            queryString: [
                {
                    name: "ieW5ie",
                    value: "1",
                },
            ],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                },
            ],
            bodySize: 0,
            method: "GET"   
        });
    });

    it("DEP number 6 (har)", function() {
        const analyzer = makeAndRunSimple(`function request6() {
            $.ajax({
                url: '/application/aet0Mu/interface/MooS8u/handle',
                  data: {
                      'veiw4I': "1",
                  },
            });
        }`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/aet0Mu/interface/MooS8u/handle?veiw4I=1",
            queryString: [
                {
                    name: "veiw4I",
                    value: "1",
                },
            ],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                },
            ],
            bodySize: 0,
            method: "GET"   
        });
    });
    
    it("DEP number 7 (har)", function() {
        const analyzer = makeAndRunSimple(`var api = "/application/iuT6ei/";

        function request7() {
            $.post(api+"interface/Eek0Mu/handle", {'eeNgi6': "1"});
        }`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/iuT6ei/interface/Eek0Mu/handle",
            queryString: [],
            postData: { 
                text: 'eeNgi6=1', 
                mimeType: 'application/x-www-form-urlencoded',
                params: 
                [
                    { 
                        name: 'eeNgi6', 
                        value: '1' 
                    }
                ]
            },
            headers: [
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
            ],
            bodySize: 8,
            method: "POST"   
        });
    });

    it("DEP number 8 (har)", function() {
        const analyzer = makeAndRunSimple(`function request8() {
            var url = "/application/gf32d2/interface/vcj442/handle";
            var param = "lkvo24=1";
            $.ajax({
                type: "GET",
                url: url,
                data: param
            });
        }`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/gf32d2/interface/vcj442/handle?lkvo24=1",
            queryString: [{
                name: "lkvo24",
                value: "1"
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    });
 
    it("DEP number 9 (har)", function() {
        const analyzer = new Analyzer();
        analyzer.addScript(`var param9 = "";

        function request9() {
            var url = "/application/n3m1k2/interface/zgjj56/handle?lk90pj=1";
                url = url + "&" + param9;
            $.ajax({
                type: "GET",
                url: url
            });
        }`);
        analyzer.addScript(`param9 = "control=" + "asde11";`);
        analyzer.analyze("http://test.com/");
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/n3m1k2/interface/zgjj56/handle?lk90pj=1&control=asde11",
            queryString: [{
                name: "lk90pj",
                value: "1"
            },
            {
                name: "control",
                value: "asde11"
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    });

    it("DEP number 10 (har)", function() {
        const source = fs.readFileSync(__dirname + "/../data/10.js").toString();
        const analyzer = makeAndRunSimple(source);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/p0065n/interface/zbtghr/handle?hg3f2d=4&id=12",
            queryString: [{
                name: "hg3f2d",
                value: "4"
            },
            {
                name: "id",
                value: "12"
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    });

    /* DEP number 11 is skipped so far*/

    it("DEP number 12 (har)", function() {
        const analyzer = new Analyzer();
        analyzer.addScript(`function request12() {
            var request_args = {
                "nba67x": configUn1.ssx46
            };
            $.ajax({
                type: "GET",
                url: configUn1.url,
                data: request_args
            });
        }`);
        analyzer.addScript(`var configUn1 = {
            id: "1",
            url: "/application/thq019/interface/nhqmz8/handle",
            isActive: "0",
            ssx46: 2
        }`);
        analyzer.analyze("http://test.com/");
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/thq019/interface/nhqmz8/handle?nba67x=2",
            queryString: [{
                name: "nba67x",
                value: "2"
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    });
    
    it("DEP number 13 (har)", function() {
        const analyzer = new Analyzer();
        analyzer.addScript(`function request13() {
            $.ajax({
                type: "GET",
                url: configUn2.url,
                data: "a09bku=" + configUn2.a09bku
            });
        }`);
        analyzer.addScript(`var configUn2 = new Object;
            configUn2.id = "1",
            configUn2.url = "/application/lm3b22/interface/b1nqjc/handle",
            configUn2.isActive = "0";
            configUn2.a09bku = 5;`);
        analyzer.analyze("http://test.com/");
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/lm3b22/interface/b1nqjc/handle?a09bku=5",
            queryString: [{
                name: "a09bku",
                value: "5"
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    });

    it("DEP number 14 (har)", function() {
        const analyzer = makeAndRunSimple(`function request14() {
            var request = new Object();
            request.country = "country";
            request.lang = "language";
            request.phgoo9 = "1";
            url = "/application/nh3k21/interface/hd73h4/handle";
            $.get(url,request);
        }`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/nh3k21/interface/hd73h4/handle?country=country&lang=language&phgoo9=1",
            queryString: [{
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
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    });

    it("DEP number 16 (har)", function() {
        const analyzer = new Analyzer();
        analyzer.addScript(`(function () {
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
        })();`);
        analyzer.addScript(`var configUn3 = {
            id: "1",
            url: "/application/lfi32b/interface/bjfu93/handle",
            isActive: "0",
            x956: 35129
        }`);
        analyzer.analyze("http://test.com/");
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/lfi32b/interface/bjfu93/handle?nv7=91&qng1f3=2&id=1&windowpane=35129",
            queryString: [{
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
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    }); 

    it("DEP number 17 (har)", function() {
        const analyzer = makeAndRunSimple(`function request17() {
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
        }`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/j4b2yh/interface/9fdh32/handle",
            queryString: [],
            postData: { 
                text: null, 
                mimeType: 'multipart/form-data',
                params: 
                [
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
                ]
            },
            headers: [
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
            ],
            bodySize: 0,
            method: "POST"   
        });
    });

    it("DEP number 18 (har)", function() {
        const analyzer = makeAndRunSimple(`function request18() {
            var baseUrl = document.location.origin;
            var path = window.location.pathname;
            var path1 = path.split("/")[1];
            $.ajax({
              url: baseUrl + '/application/' + path1 + '/interface/Ua9xek/handle?abi1Lu=1',
          });
        }`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/test/interface/Ua9xek/handle?abi1Lu=1",
            queryString: [{
                name: "abi1Lu",
                value: "1"
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    });

    it("DEP number 19 (har)", function() {
        const analyzer = makeAndRunSimple(`request19 = () => {
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
          }`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/application/to0Hei/interface/maM2uc/handle?Pue6Ee=2",
            queryString: [{
                name: "Pue6Ee",
                value: "2"
            }],
            headers: [
                {
                    value: "test.com",
                    name: "Host",
                }
            ],
            bodySize: 0,
            method: "GET"   
        });
    });
});