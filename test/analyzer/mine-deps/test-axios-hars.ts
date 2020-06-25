import { Analyzer } from "../../../src/analyzer/analyzer";
import { HAR } from "../../../src/analyzer/har";


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


describe("Tests for Axios library's DEPs hars", () => {
    it("axios get request as function (without method)", function() {
        const analyzer = makeAndRunSimple(`axios('/user?id=12');`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/user?id=12",
            queryString: [
                {
                    name: "id",
                    value: "12",
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

    it("axios get request as function", function() {
        const analyzer = makeAndRunSimple(`axios({
            method: 'get',
            url: '/user?id=12'
        });`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/user?id=12",
            queryString: [
                {
                    name: "id",
                    value: "12",
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

    it("axios post request as function", function() {
        const analyzer = makeAndRunSimple(`axios({
            method: 'post',
            url: '/user/12345',
            data: {
              firstName: 'Fred',
              lastName: 'Flintstone'
            }
        });`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);
        
        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/user/12345",
            headers: [
                { 
                    name: 'Host', 
                    value: 'test.com' 
                },
                { 
                    name: 'Content-Type', 
                    value: 'application/json' 
                },
                { 
                    name: 'Content-Length', 
                    value: '44' 
                }
            ],
            queryString: [],
            bodySize: 44,
            postData: {
              text: '{\"firstName\":\"Fred\",\"lastName\":\"Flintstone\"}',
              mimeType: 'application/json'
            },
            method: "POST"   
        });
    });

    it("axios put request as function", function() {
        const analyzer = makeAndRunSimple(`axios({
            method: 'put',
            url: '/user/12345',
            data: {
              firstName: 'Fred',
              lastName: 'Flintstone'
            }
        });`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);
        
        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/user/12345",
            headers: [
                { 
                    name: 'Host', 
                    value: 'test.com' 
                },
                { 
                    name: 'Content-Type', 
                    value: 'application/json' 
                },
                { 
                    name: 'Content-Length', 
                    value: '44' 
                }
            ],
            queryString: [],
            bodySize: 44,
            postData: {
              text: '{\"firstName\":\"Fred\",\"lastName\":\"Flintstone\"}',
              mimeType: 'application/json'
            },
            method: "PUT"   
        });
    });

    it("axios get request as object's method", function() {
        const analyzer = makeAndRunSimple(`axios.get('/user?id=12')`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);

        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/user?id=12",
            queryString: [
                {
                    name: "id",
                    value: "12",
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

    it("axios post request as object's method", function() {
        const analyzer = makeAndRunSimple(`axios.post(
            '/user/12345',
            {
              firstName: 'Fred',
              lastName: 'Flintstone'
            }
        );`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);
        
        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/user/12345",
            headers: [
                { 
                    name: 'Host', 
                    value: 'test.com' 
                },
                { 
                    name: 'Content-Type', 
                    value: 'application/json' 
                },
                { 
                    name: 'Content-Length', 
                    value: '44' 
                }
            ],
            queryString: [],
            bodySize: 44,
            postData: {
              text: '{\"firstName\":\"Fred\",\"lastName\":\"Flintstone\"}',
              mimeType: 'application/json'
            },
            method: "POST"   
        });
    });

    it("axios put request as object's method", function() {
        const analyzer = makeAndRunSimple(`axios.put(
            '/user/12345',
            {
              firstName: 'Fred',
              lastName: 'Flintstone'
            }
        );`);
        expect(analyzer.hars.length).toEqual(1);

        const dep = makeHar(analyzer.hars[0]);
        
        expect(dep).toEqual({
            httpVersion: "HTTP/1.1",
            url:
                "http://test.com/user/12345",
            headers: [
                { 
                    name: 'Host', 
                    value: 'test.com' 
                },
                { 
                    name: 'Content-Type', 
                    value: 'application/json' 
                },
                { 
                    name: 'Content-Length', 
                    value: '44' 
                }
            ],
            queryString: [],
            bodySize: 44,
            postData: {
              text: '{\"firstName\":\"Fred\",\"lastName\":\"Flintstone\"}',
              mimeType: 'application/json'
            },
            method: "PUT"   
        });
    });
});