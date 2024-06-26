const { create: createWebpage } = require('webpage');

import * as WindowEvents from '../../../../src/backend/slimerjs/analyzer/browser/window-events';
import { getWrappedWindow } from '../../../../src/backend/slimerjs/analyzer/utils/window';

import { testWS } from '../../page/webserver';

describe('Test window-events', () => {
    it('test on off', async () => {
        const url = testWS.getFullURL('/');
        const webpage = createWebpage();

        let callCount = 0;

        function callback(win) {
            expect(win).toBe(getWrappedWindow(webpage));
            callCount += 1;
        }

        WindowEvents.on(WindowEvents.DOCUMENT_CREATED_EVENT, callback);

        await webpage.open(url);

        expect(callCount).toBe(1);

        WindowEvents.off(WindowEvents.DOCUMENT_CREATED_EVENT, callback);

        await webpage.open(url);

        expect(callCount).toBe(1);

        webpage.close();
    });
});
