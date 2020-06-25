import { Analyzer, SinkCall } from "../../../src/analyzer/analyzer";


function makeAndRunSimple(script: string, url='http://test.com/test'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.mineArgsForDEPCalls(url);
    return analyzer;
}

describe("Tests for Axios library's DEPs args", () => {
    it("axios get request as function (without method)", function() {
        const analyzer = makeAndRunSimple(`axios('/user?id=12');`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "axios",
            "args": [
                '/user?id=12'      
            ]} as SinkCall);
    });

    it("axios get request as function", function() {
        const analyzer = makeAndRunSimple(`axios({
            method: 'get',
            url: '/user?id=12'
        });`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "axios",
            "args": [{
                method: 'get',
                url: '/user?id=12'
            }]
        } as SinkCall);
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
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "axios",
            "args": [{
                method: 'post',
                url: '/user/12345',
                data: {
                    firstName: 'Fred',
                    lastName: 'Flintstone'
                }
            }]
        } as SinkCall);
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
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "axios",
            "args": [{
                method: 'put',
                url: '/user/12345',
                data: {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            }]
        } as SinkCall);
    });

    it("axios get request as object's method", function() {
        const analyzer = makeAndRunSimple(`axios.get('/user?id=12')`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "axios.get",
            "args": [
                "/user?id=12"
        ]} as SinkCall);
    });

    it("axios post request as object's method", function() {
        const analyzer = makeAndRunSimple(`axios.post(
            '/user/12345',
            {
              firstName: 'Fred',
              lastName: 'Flintstone'
            }
        );`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "axios.post",
            "args": [
                '/user/12345',
                {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
        ]} as SinkCall);
    });

    it("axios put request as object's method", function() {
        const analyzer = makeAndRunSimple(`axios.put(
            '/user/12345',
            {
              firstName: 'Fred',
              lastName: 'Flintstone'
            }
        );`);
        expect(analyzer.results.length).toEqual(1);
        expect(analyzer.results[0]).toEqual({
            "funcName": "axios.put",
            "args": [
                '/user/12345',
                {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
        ]} as SinkCall);
    });
});