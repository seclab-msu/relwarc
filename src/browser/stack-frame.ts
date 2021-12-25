export interface StackFrame {
    name: string|null;
    lineNumber: number;
    columnNumber: number;
    sourceLine: string;
    pretty: string;
    fileURI: string;
}
