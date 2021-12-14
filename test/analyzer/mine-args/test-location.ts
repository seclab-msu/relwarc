import { SinkCall } from '../../../src/analyzer';
import { runSingleTestSinkCall, makeAndRunSimple } from '../utils/utils';


describe('Analyzing code that uses location object', () => {
    it('does not fail on assigning', function () {
        const scripts = [
            `location = '/test';`,
            `document.location = '/test';`,
            `window.location = '/test';`
        ];
        makeAndRunSimple(
            scripts,
            false
        );
    });

    it('does not fail on assigning location property', function () {
        const scripts = [
            `location.href = '/test';`,
            `document.location.href = '/test';`
        ];
        makeAndRunSimple(
            scripts,
            false
        );
    });

    it('does not fail when prop is set on copy', function () {
        const scripts = [
            `let x = location;
            x.href = '/test';`
        ];
        makeAndRunSimple(
            scripts,
            false
        );
    });

    it('does not fail when prop is set on copy after assigning', function () {
        const scripts = [
            `let x = location;
            location = '/test';
            x.href = '/otherloc';`
        ];
        makeAndRunSimple(
            scripts,
            false
        );
    });

    it('assigning location does not terminate analysis', function () {
        const scripts = [
            `if (true) {
                location = '/testingtest';
            }
            fetch('/api/info.jsp');`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': ['/api/info.jsp']
            } as SinkCall,
        );
    });

    it('handles location.pathname usage', function () {
        const scripts = [
            `let path = location.pathname;
            let secondDir = path.split('/')[2];
            fetch('/root/' + secondDir + '/testin.jsp');`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': ['/root/dir2/testin.jsp']
            } as SinkCall,
            'http://test.com/dir1/dir2/dir3/page.html',
        );
    });

    // TODO: this does not work for now
    xit('handles location.pathname usage with immediate split', function () {
        const scripts = [
            `let secondDir = location.pathname.split('/')[2];
            fetch('/root/' + secondDir + '/testin.jsp');`
        ];
        runSingleTestSinkCall(
            scripts,
            {
                'funcName': 'fetch',
                'args': ['/root/dir2/testin.jsp']
            } as SinkCall,
            'http://test.com/dir1/dir2/dir3/page.html',
        );
    });
});
