import * as fs from 'fs';

import type { SinkSignature } from '../signatures';

const constructorBodySignature = JSON.parse(fs.readFileSync(
    __dirname + '/ctor-body.json',
    'utf8'
));

const signatures: SinkSignature[] = [
    {
        type: 'classAST',
        signature: {
            'ajax-file-upload.FileUploader': {
                isAJAXCall: true,
                methods: {
                    constructor: {
                        params: [{ type: 'Identifier' }],
                        body: constructorBodySignature
                    }
                }
            }
        }
    }
];

export default signatures;
