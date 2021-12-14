import type { SinkSignature } from '../signatures';

const signatures: SinkSignature[] = [
    {
        type: 'freeStanding',
        signature: '$http'
    },
    {
        type: 'bound',
        signature: {
            '$http': ['get', 'post', 'put', 'jsonp'],
            'http': ['request', 'delete', 'get', 'head', 'jsonp', 'options', 'patch', 'post', 'put'],
        }
    }
];

export default signatures;
