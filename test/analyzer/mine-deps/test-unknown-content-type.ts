import { runSingleTestHAR } from '../utils/utils';

describe('Case with UNKNOWN Content-Type', () => {
    it('processed properly', () => {
        const scripts = [
            `const know = {about: "javascript"}
            let me = know
            fetch("http://2girls1cup.su/download", {
                headers: {
                    "Content-Type": get_ct(me)
                }
            })`
        ];
        runSingleTestHAR(
            scripts,
            {
                httpVersion: 'HTTP/1.1',
                url: 'http://2girls1cup.su/download',
                queryString: [],
                headers: [
                    {
                        value: '2girls1cup.su',
                        name: 'Host',
                    },
                    {
                        name: 'Content-Type',
                        value: 'UNKNOWN',
                    }
                ],
                bodySize: 0,
                method: 'GET',
            }
        );
    });
});
