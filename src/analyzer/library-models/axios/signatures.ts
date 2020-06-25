import type { SinkSignature } from '../signatures';

const signatures: SinkSignature[] = [
    {
        type: 'freeStanding',
        signature: 'axios'
    },
    {
        type: 'bound',
        signature: {
            'axios': ['get', 'post', 'put']
        }
    }
];

export default signatures;