import { HAR } from '../har';

export { HeadlessBot } from '../backend';

export interface HeadlessBot {
    pageLoadingStopped: boolean;
    ignoreSSLError: boolean;

    navigate(url: string): Promise<void>;
    getPageLoadHTTPStatus(): number | null;
    triggerParsingOfEventHandlerAttributes(): void;
    extractBaseURI(): string;
    addHTMLDynamicDEPLocation(har: HAR): HAR;
    resetWindowCreatedListeners(): void;
    close(): void;
}
