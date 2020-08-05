import { runSingleTest } from "../run-tests-helper";

describe("Tests for Axios library's DEPs hars", () => {
    it("axios get request as function (without method)", function() {
        const scripts = [
            `axios('/user?id=12');`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/user?id=12",
                queryString: new Set([
                    {
                        name: "id",
                        value: "12",
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

    it("axios get request as function", function() {
        const scripts = [
            `axios({
                method: 'get',
                url: '/user?id=12'
            });`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/user?id=12",
                queryString: new Set([
                    {
                        name: "id",
                        value: "12",
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

    it("axios post request as function", function() {
        const scripts = [
            `axios({
                method: 'post',
                url: '/user/12345',
                data: {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            });`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/user/12345",
                headers: new Set([
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
                ]),
                queryString: new Set([]),
                bodySize: 44,
                postData: {
                  text: '{\"firstName\":\"Fred\",\"lastName\":\"Flintstone\"}',
                  mimeType: 'application/json'
                },
                method: "POST"   
            },
            true
        );
    });

    it("axios put request as function", function() {
        const scripts = [
            `axios({
                method: 'put',
                url: '/user/12345',
                data: {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            });`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/user/12345",
                headers: new Set([
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
                ]),
                queryString: new Set([]),
                bodySize: 44,
                postData: {
                  text: '{\"firstName\":\"Fred\",\"lastName\":\"Flintstone\"}',
                  mimeType: 'application/json'
                },
                method: "PUT"   
            },
            true
        );
    });

    it("axios get request as object's method", function() {
        const scripts = [
            `axios.get('/user?id=12')`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/user?id=12",
                queryString: new Set([
                    {
                        name: "id",
                        value: "12",
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

    it("axios post request as object's method", function() {
        const scripts = [
            `axios.post(
                '/user/12345',
                {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            );`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/user/12345",
                headers: new Set([
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
                ]),
                queryString: new Set([]),
                bodySize: 44,
                postData: {
                  text: '{\"firstName\":\"Fred\",\"lastName\":\"Flintstone\"}',
                  mimeType: 'application/json'
                },
                method: "POST"   
            },
            true
        );
    });

    it("axios put request as object's method", function() {
        const scripts = [
            `axios.put(
                '/user/12345',
                {
                  firstName: 'Fred',
                  lastName: 'Flintstone'
                }
            );`
        ];
        runSingleTest(
            scripts,
            {
                httpVersion: "HTTP/1.1",
                url:
                    "http://test.com/user/12345",
                headers: new Set([
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
                ]),
                queryString: new Set([]),
                bodySize: 44,
                postData: {
                  text: '{\"firstName\":\"Fred\",\"lastName\":\"Flintstone\"}',
                  mimeType: 'application/json'
                },
                method: "PUT"   
            },
            true
        );
    });
});