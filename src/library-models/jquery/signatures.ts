import type { SinkSignature } from '../signatures';

const jQueryAjaxFunctions = [
    'ajax',
    'get',
    'post',
    'load',
    'getJSON',
    'getScript'
];

const signatures: SinkSignature[] = [
    {
        type: 'bound',
        signature: {
            '$': jQueryAjaxFunctions,
            'jQuery': jQueryAjaxFunctions
        }
    },
    {
        type: 'boundToCall',
        signature: {
            '$': ['load'],
            'jQuery': ['load']
        }

    }
];

export default signatures;
