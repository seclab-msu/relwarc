import type { Signature } from '../signatures';

const signatures: Signature[] = [
    {
        type: 'bound',
        signature: {
            /* 'this': ['fetch'], TODO: reconsider whether it should be supported */
            'window': ['fetch', 'open']
        }
    }
];

export default signatures;
