import type { SinkSignature } from '../signatures';

const signatures: SinkSignature[] = [
    {
        type: 'freeStanding',
        signature: 'fetch'
    },
    {
        type: 'bound',
        signature: {
            /* 'this': ['fetch'], TODO: reconsider whether it should be supported */
            'window': ['fetch']
        }
    }
];

export default signatures;