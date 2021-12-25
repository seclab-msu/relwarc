import type { Signature } from '../signatures';

import { matchAST } from './ast-matcher';

const jQueryAjaxFunctions = [
    'ajax',
    'get',
    'post',
    'load',
    'getJSON',
    'getScript'
];

const signatures: Signature[] = [
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

    },
    {
        type: 'libAST',
        baseNodeType: 'FunctionExpression',
        matcher: matchAST,
        excludeFromAnalysis: true
    }
];

export default signatures;
