import { Analyzer } from "../../../src/analyzer/analyzer";
import { HAR } from "../../../src/analyzer/har";
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


describe("Tests for AngularJS library's DEPs hars", () => {
    it("$http get request as function", function() {
        const analyzer = makeAndRunSimple(`$http({
            method: 'GET',
            url: '/someUrl?id=12&param=delete'
          });`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/someUrl?id=12&param=delete",
            queryString: [
                {
                    name: "id",
                    value: "12",
                },
                {
                    name: "param",
                    value: "delete",
                }
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

    it("$http post request as function", function() {
        const analyzer = makeAndRunSimple(`$http({
            method: 'POST',
            url: '/someUrl',
            data: { 
                'name': 'testparam', 
                'value': 'test' 
            }
        });`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/someUrl",
            headers: [
                { 
                    name: 'Host', 
                    value: 'test.com' 
                },
                { 
                    name: 'Content-Type', value: 
                    'application/json' 
                },
                { 
                    name: 'Content-Length', 
                    value: '35' 
                }
            ],
            queryString: [],
            bodySize: 35,
            postData: {
              text: '{"name":"testparam","value":"test"}',
              mimeType: 'application/json'
            },
            method: "POST"   
        });
    });

    it("$http put request as function", function() {
        const analyzer = makeAndRunSimple(`$http({
            method: 'PUT',
            url: '/someUrl',
            data: { 
                'name': 'testparam', 
                'value': 'test' 
            }
        });`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/someUrl",
            headers: [
                { 
                    name: 'Host', 
                    value: 'test.com' 
                },
                { 
                    name: 'Content-Type', value: 
                    'application/json' 
                },
                { 
                    name: 'Content-Length', 
                    value: '35' 
                }
            ],
            queryString: [],
            bodySize: 35,
            postData: {
              text: '{"name":"testparam","value":"test"}',
              mimeType: 'application/json'
            },
            method: "PUT"   
        });
    });

    it("$http get request as object's method", function() {
        const analyzer = makeAndRunSimple(`$http.get(
            '/someUrl?param=123'
        );`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);
        
        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/someUrl?param=123",
            queryString: [
                {
                    name: "param",
                    value: "123",
                }
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
       
    it("$http post request as object's method", function() {
        const analyzer = makeAndRunSimple(`$http.post(
            '/someUrl',
            {
                "name": "username",
                "value": "Name"
            }
        );`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/someUrl",
            headers: [
                { 
                    name: 'Host', 
                    value: 'test.com' 
                },
                { 
                    name: 'Content-Type', value: 
                    'application/json' 
                },
                { 
                    name: 'Content-Length', 
                    value: '34' 
                }
            ],
            queryString: [],
            bodySize: 34,
            postData: {
              text: '{"name":"username","value":"Name"}',
              mimeType: 'application/json'
            },
            method: "POST"   
        });
    });

    it("$http put request as object's method", function() {
        const analyzer = makeAndRunSimple(`$http.put(
            '/someUrl',
            {
                "name": "username",
                "value": "Name"
            }
        );`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/someUrl",
            headers: [
                { 
                    name: 'Host', 
                    value: 'test.com' 
                },
                { 
                    name: 'Content-Type', value: 
                    'application/json' 
                },
                { 
                    name: 'Content-Length', 
                    value: '34' 
                }
            ],
            queryString: [],
            bodySize: 34,
            postData: {
              text: '{"name":"username","value":"Name"}',
              mimeType: 'application/json'
            },
            method: "PUT"   
        });
    });

    it("$http jsonp request as object's method", function() {
        const analyzer = makeAndRunSimple(`$http.jsonp(
            '/someUrl?param=123'
        );`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);
        
        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/someUrl?param=123",
            queryString: [
                {
                    name: "param",
                    value: "123",
                }
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
});