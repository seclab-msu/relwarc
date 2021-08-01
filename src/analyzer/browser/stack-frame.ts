export interface StackFrame {
    name: string;
    lineNumber: string;
    columnNumber: number;
    sourceLine: number;
    pretty: string;
    fileURI: string;
}
