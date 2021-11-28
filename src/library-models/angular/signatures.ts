import type { SinkSignature } from '../signatures';

const signatures: SinkSignature[] = [
    {
        type: 'freeStanding',
        signature: '$http'
    },
    {
        type: 'bound',
        signature: {
            '$http': ['get', 'post', 'put', 'jsonp']
        }
    }
];

export default signatures;
