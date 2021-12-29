import type {
    TestWebServer as ChromeWebServer,
    run as chromeRunFunc
} from './chrome-webserver';

type runFuncType = typeof chromeRunFunc;

let runFunc: runFuncType = require('./chrome-webserver').run;

export const run = runFunc;

export let testWS;

beforeAll(async (): Promise<void> => {
    testWS = await runFunc();
});