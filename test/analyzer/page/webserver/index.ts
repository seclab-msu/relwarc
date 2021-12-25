import type {
    TestWebServer as SlimerJSWebServer,
    run as slimerRunFunc
} from './slimerjs-webserver';

type runFuncType = typeof slimerRunFunc;

let runFunc: runFuncType;

runFunc = require('./slimerjs-webserver').run;

export const run = runFunc;

export let testWS;

beforeAll(async (): Promise<void> => {
    testWS = await runFunc();
});
