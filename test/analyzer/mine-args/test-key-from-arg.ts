import { SinkCall } from '../../../src/analyzer/analyzer';
import { runSingleTestSinkCall } from '../utils/utils';

describe('Tests for FROM_ARG to UNKNOWN replacement in output', () => {
    it('replaces it in Object Keys', function () {
        const scripts = [
            `function abcde_md5(tarea_id) {
            abcde_tarea_id=tarea_id;
            var z = {};
            z['ajax'+tarea_id]=1;
            z['abcde'+tarea_id]=1;
            $.post("index.php", z);
            }`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.post',
                'args': ['index.php', { ajaxUNKNOWN: 1, abcdeUNKNOWN: 1 }]
            } as SinkCall,
        );
    });

    it('handles call-chain properly', () => {
        const scripts = [
            `function abcde_md5(tarea_id) {
                abcde_tarea_id=tarea_id;
                var z = {};
                z['ajax'+tarea_id]=1;
                z['abcde'+tarea_id]=1;
                $.post("index.php", z);
            }
            abcde_md5(1337);
            `
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': '$.post',
                'args': ['index.php', { ajax1337: 1, abcde1337: 1 }]
            } as SinkCall
        );
    });
});
