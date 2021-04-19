import * as tar from 'tar-stream';
const fs = require('fs');

export function readTar(path: string): Promise<object[]> {
    return new Promise((resolve, reject) => {
        const tarFileStream = fs.createReadStream(path);

        let mapURLs: object = {};
        const contentURLs: object = {};

        const extract = tar.extract();

        extract.on('entry', function (header, stream, next) {
            if (header.type === 'file') {
                const contentParts: string[] = [];

                stream.setEncoding('utf8');
                stream.on('data', data => {
                    contentParts.push(data);
                });
                stream.on('end', function () {
                    const content = contentParts.join('');
                    if (header.name == 'metainfo.json') {
                        mapURLs = JSON.parse(content);
                    } else {
                        contentURLs[header.name] = content;
                    }
                    next();
                });
            } else if (header.type === 'directory') {
                stream.resume(); // just auto drain the stream
                next();
            } else {
                reject(new Error('Unexpected file in tar: ' + header.type));
            }
        });

        extract.on('error', err => {
            reject(new Error('extract error : ' + err + ' ' + err.stack));
        });

        extract.on('finish', () => resolve([mapURLs, contentURLs]));

        tarFileStream.pipe(extract);
    });
}
