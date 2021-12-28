import { readFileSync } from 'fs';
import * as path from 'path';

import { makeAndRunSimple } from '../utils/utils';

const TEST_DATA_DIR = path.join(__dirname, 'data/');

function getTestFile(name: string): string {
    return readFileSync(path.join(TEST_DATA_DIR, name), 'utf8');
}

describe('Test builtin support for library classes', () => {
    it('Angular File Upload - class defined with "class" declaration', () => {
        const angularFileUploadLib = getTestFile('afu.js');
        const code = [
            angularFileUploadLib,
            `
            function test() {
                var uploader = new g({
                    url: "./testing/file-upload",
                    authToken: "Medveder",
                    allowedMimeType: [
                        "application/pdf",
                        "application/xml",
                        "text/xml",
                        "application/zip",
                        "application/x-zip-compressed",
                        "multipart/x-zip"
                    ],
                    maxFileSize: 1e5
                });
                return uploader;
            }`
        ];
        const analyzer = makeAndRunSimple(code, false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            'funcName': 'ajax-file-upload.FileUploader',
            'args': [
                {
                    'url': './testing/file-upload',
                    'authToken': 'Medveder',
                    'allowedMimeType': [
                        'application/pdf',
                        'application/xml',
                        'text/xml',
                        'application/zip',
                        'application/x-zip-compressed',
                        'multipart/x-zip'
                    ],
                    'maxFileSize': 100000
                }
            ]
        });
    });
    it('Angular File Upload - class defined as "function"', () => {
        const angularFileUploadLib = getTestFile('afu-function.js');
        const code = [
            angularFileUploadLib,
            `
            function test() {
                var uploader = new l({
                    url: "./testing/file-upload",
                    authToken: "Medveder",
                    allowedMimeType: [
                        "application/pdf",
                        "application/xml",
                        "text/xml",
                        "application/zip",
                        "application/x-zip-compressed",
                        "multipart/x-zip"
                    ],
                    maxFileSize: 1e5
                  });
            }`
        ];
        const analyzer = makeAndRunSimple(code, false);
        const res = analyzer.results.map(el => ({
            funcName: el.funcName,
            args: el.args
        }));
        expect(res as object[]).toContain({
            'funcName': 'ajax-file-upload.FileUploader',
            'args': [
                {
                    'url': './testing/file-upload',
                    'authToken': 'Medveder',
                    'allowedMimeType': [
                        'application/pdf',
                        'application/xml',
                        'text/xml',
                        'application/zip',
                        'application/x-zip-compressed',
                        'multipart/x-zip'
                    ],
                    'maxFileSize': 100000
                }
            ]
        });
    });
});
