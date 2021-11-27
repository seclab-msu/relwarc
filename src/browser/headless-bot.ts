import { HAR } from '../har';

export { HeadlessBot } from '../backend';

export interface HeadlessBot {
    pageLoadingStopped: boolean;
    ignoreSSLError: boolean;

    navigate(url: string): Promise<void>;
    getPageLoadHTTPStatus(): number | null;
    triggerParsingOfEventHandlerAttributes(): Promise<void>;
    extractBaseURI(): Promise<string>;
    addHTMLDynamicDEPLocation(har: HAR): HAR;
    addWindowCreatedListener(cb: WindowCreatedListener): void;
    resetWindowCreatedListeners(): void;
    close(): Promise<void>;
}

export type WindowCreatedListener = (bot: HeadlessBot) => void;
