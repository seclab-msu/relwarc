import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";
import { FormDataModel } from "../../../src/analyzer/types/form-data";
import * as fs from 'fs';


function makeAndRunSimple(script: string, url='http://test.com/test'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.mineArgsForDEPCalls(url);
    return analyzer;
}

describe("Analyzer finding args of DEPs in combined stand", () => {
    it("DEP number 3 (just ajax request)", function() {
        const analyzer = makeAndRunSimple(`$.ajax({
            url: '/application/jie8Ye/interface/aesi9X/handle',
            data: {
                'Po3oom': "1",
            },
        });`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/application/jie8Ye/interface/aesi9X/handle",
                data: {
                    Po3oom: "1"
                }
            }]
        } as SinkCall);
    });

    it('DEP number 4 (function is called when an event "onclick" occurs)', function() {
        const analyzer = makeAndRunSimple(`function request4() {
            $.ajax({
                url: '/application/Yai0au/interface/Eikei0/handle',
                data: {
                    'Me1ii7': "1",
                },
            });
        }`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/application/Yai0au/interface/Eikei0/handle",
                data: {
                    Me1ii7: "1"
                }
            }]
        } as SinkCall);
    });

    it("DEP number 5 (addEventListener function)", function() {
        const analyzer = makeAndRunSimple(`function request5() {
            $.ajax({
                url: '/application/aeP2je/interface/aiH7io/handle',
                data: {
                    'ieW5ie': "1",
                },
            });
        }
        document.getElementById('req5').addEventListener('click', request5);`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/application/aeP2je/interface/aiH7io/handle",
                data: {
                    ieW5ie: "1"
                }
            }]
        } as SinkCall);
    });

    it("DEP number 6 (ajax request with string literals)", function() {
        const analyzer = makeAndRunSimple(`function request6() {
            $.ajax({
                url: '/application/aet0Mu/interface/MooS8u/handle',
                data: {
                    'veiw4I': "1",
                },
            });
        }`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/application/aet0Mu/interface/MooS8u/handle",
                data: {
                    veiw4I: "1"
                }
            }]
        } as SinkCall);
    });

    it("DEP number 7 (concat global variable and string literal in request)", function() {
        const analyzer = makeAndRunSimple(`var api = "/application/iuT6ei/";

        function request7() {
            $.post(api+"interface/Eek0Mu/handle", {'eeNgi6': "1"});
        }`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.post",
            "args": [
                "/application/iuT6ei/interface/Eek0Mu/handle",
                {
                    eeNgi6: "1"
                }]
        } as SinkCall);
    });

    it("DEP number 8 (params for ajax request are local variables)", function() {
        const analyzer = makeAndRunSimple(`function request8() {
            var url = "/application/gf32d2/interface/vcj442/handle";
            var param = "lkvo24=1";
            $.ajax({
                type: "GET",
                url: url,
                data: param
            });
        }`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                type: "GET",
                url: "/application/gf32d2/interface/vcj442/handle",
                data: "lkvo24=1"
            }]
        } as SinkCall);
    });

    it("DEP number 9 (url depends on global var, which is changed in other script)", () => {
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
        analyzer.mineArgsForDEPCalls('http://test.com/');
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                type: "GET",
                url: "/application/n3m1k2/interface/zgjj56/handle?lk90pj=1&control=asde11"
            }]
        } as SinkCall);
    });

    it("DEP number 10 (overlapping scopes of variables)", function() {
        const source = fs.readFileSync(__dirname + "/../data/10.js").toString();
        const analyzer = makeAndRunSimple(source);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                type: "GET",
                url: "/application/p0065n/interface/zbtghr/handle?hg3f2d=4&id=12"
            }]
        } as SinkCall);
    });

    /* DEP number 11 is skipped so far*/
    
    it("DEP number 12 (params for request taken from global config, which is literal object)", function() {
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
        analyzer.mineArgsForDEPCalls('http://combined.stands.fuchsia/');
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                type: "GET",
                url: "/application/thq019/interface/nhqmz8/handle",
                data: {
                    nba67x: 2
                }
            }]
        } as SinkCall);
    });

    it("DEP number 13 (params for request taken from global config, which is new Object)", function() {
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
        analyzer.mineArgsForDEPCalls('http://combined.stands.fuchsia/');
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                type: "GET",
                url: "/application/lm3b22/interface/b1nqjc/handle",
                data: "a09bku=5"
            }]
        } as SinkCall);
    });

    it("DEP number 14 (params for request taken from local config, which is new Object)", function() {
        const analyzer = makeAndRunSimple(`function request14() {
            var request = new Object();
            request.country = "country";
            request.lang = "language";
            request.phgoo9 = "1";
            url = "/application/nh3k21/interface/hd73h4/handle";
            $.get(url,request);
        }`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.get",
            "args": [
               "/application/nh3k21/interface/hd73h4/handle",
                {
                    country: "country",
                    lang: "language",
                    phgoo9: "1"
                }
            ]
        } as SinkCall);
    }); 

    it("DEP number 16 (IIFE and call-chain inside)", function() {
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
        analyzer.mineArgsForDEPCalls('http://combined.stands.fuchsia/');
        expect(analyzer.results).toContain({
            "funcName": "$.get",
            "args": [
               "/application/lfi32b/interface/bjfu93/handle",
                {
                    nv7: 91,
                    qng1f3: 2,
                    id: "1",
                    windowpane: 35129
                }
            ]
        } as SinkCall);
    });

    it("DEP number 17 (multipart request)", function() {
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
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                type: "POST",
                url: "/application/j4b2yh/interface/9fdh32/handle",
                data: new FormDataModel({
                    "ffdj3v": "1",
                    "action": "delete",
                    "tag": "rand"
                }),
                processData: false,
                contentType: false        
            }]
        } as SinkCall);
    });

    it("DEP number 18 (parse location for request params)", function() {
        const analyzer = makeAndRunSimple(`function request18() {
            var baseUrl = document.location.origin;
            var path = window.location.pathname;
            var path1 = path.split("/")[1];
            $.ajax({
              url: baseUrl + '/application/' + path1 + '/interface/Ua9xek/handle?abi1Lu=1',
          });
        }`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "http://test.com/application/test/interface/Ua9xek/handle?abi1Lu=1"        
            }]
        } as SinkCall);
    });

    it("DEP number 19 (new JS features)", function() {
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
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$.ajax",
            "args": [{
                url: "/application/to0Hei/interface/maM2uc/handle",
                data: {
                    Pue6Ee: "2"
                }
            }]
        } as SinkCall);
    });
});