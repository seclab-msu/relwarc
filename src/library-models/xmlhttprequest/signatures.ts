import type { SinkSignature } from '../signatures';

const signatures: SinkSignature[] = [
    {
        type: 'callSequence',
        signature: {
            name: 'XMLHttpRequest',
            first: 'open',
            intermediate: ['setRequestHeader'],
            final: 'send'
        }
    }
];

export default signatures;
