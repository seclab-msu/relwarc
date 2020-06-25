import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";
import { FormDataModel } from "../../../src/analyzer/types/form-data";
import * as fs from 'fs';


function makeAndRunSimple(script: string, url='http://test.com/test'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.mineArgsForDEPCalls(url);
    return analyzer;
}

describe("Tests for AngularJS library's DEPs args", () => {
    it("$http get request as function", function() {
        const analyzer = makeAndRunSimple(`$http({
            method: 'GET',
            url: '/someUrl?id=12&param=delete'
          });`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$http",
            "args": [{
                method: 'GET',
                url: "/someUrl?id=12&param=delete"
            }]
        } as SinkCall);
    });

    it("$http post request as function", function() {
        const analyzer = makeAndRunSimple(`$http({
            method: 'POST',
            url: '/someUrl',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: { 'testparam': 'test'}
          });`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$http",
            "args": [{
                method: 'POST',
                url: "/someUrl",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: { 
                    'testparam': 'test' 
                }
            }]
        } as SinkCall);
    });

    it("$http put request as function", function() {
        const analyzer = makeAndRunSimple(`$http({
            method: 'PUT',
            url: '/someUrl',
            data: { testval: 'value' }
          });`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$http",
            "args": [{
                method: 'PUT',
                url: "/someUrl",
                data: { testval: 'value' }
            }]
        } as SinkCall);
    });

    it("$http jsonp request as function", function() {
        const analyzer = makeAndRunSimple(`$http({
            method: 'JSONP',
            url: '/someUrl?param=1234'
          });`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$http",
            "args": [{
                method: 'JSONP',
                url: "/someUrl?param=1234"
            }]
        } as SinkCall);
    });

    it("$http get request as object's method", function() {
        const analyzer = makeAndRunSimple(`$http.get(
            '/someUrl?param=123',
            {
                headers: {
                    "name": "X-Auth-Tok",
                    "value": "5fc2de39242922efd3"
                }
            }
        );`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$http.get",
            "args": [
                "/someUrl?param=123",
                {
                    headers: {
                        "name": "X-Auth-Tok",
                        "value": "5fc2de39242922efd3"
                    }
                }
        ]} as SinkCall);
    });

    it("$http post request as object's method", function() {
        const analyzer = makeAndRunSimple(`$http.post(
            '/someUrl',
            {
                "name": "username",
                "value": "Name"
            }
        );`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$http.post",
            "args": [
                "/someUrl",
                {
                    "name": "username",
                    "value": "Name"
                }
        ]} as SinkCall);
    });

    it("$http put request as object's method", function() {
        const analyzer = makeAndRunSimple(`$http.put(
            '/someUrl',
            {
                "name": "username",
                "value": "Name"
            }
        );`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$http.put",
            "args": [
                "/someUrl",
                {
                    "name": "username",
                    "value": "Name"
                }
        ]} as SinkCall);
    });

    it("$http jsonp request as object's method", function() {
        const analyzer = makeAndRunSimple(`$http.jsonp(
            '/someUrl?param=value'
        );`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "$http.jsonp",
            "args": [
                "/someUrl?param=value"
        ]} as SinkCall);
    });
});