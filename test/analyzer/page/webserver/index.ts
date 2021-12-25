import type {
    TestWebServer as SlimerJSWebServer,
    run as slimerRunFunc
} from './slimerjs-webserver';
import type {
    TestWebServer as ChromeWebServer,
    run as chromeRunFunc
} from './chrome-webserver';

type runFuncType =
    | typeof slimerRunFunc
    | typeof chromeRunFunc;

let runFunc: runFuncType;

try {
    runFunc = require('./slimerjs-webserver').run;
} catch {
    runFunc = require('./chrome-webserver').run;
}

export const run = runFunc;

export let testWS;

beforeAll(async (): Promise<void> => {
    testWS = await runFunc();
});