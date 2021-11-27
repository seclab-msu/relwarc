export interface HeadlessBotOptions {
    printPageErrors: boolean;
    printPageConsoleLog: boolean;
    logRequests: boolean;
    debugRequestLoading: boolean;
    recordRequestStackTraces?: boolean;
    loadTimeout?: number;
}