import { HAR } from '../har';

export { HeadlessBot } from '../backend';

export const DEFAULT_LOAD_TIMEOUT = 180; // 180 seconds = 3 min

export const LOADED_COOLDOWN = 250;

export interface HeadlessBot {
    pageLoadingStopped: boolean;
    ignoreSSLError: boolean;

    navigate(url: string): Promise<void>;
    getPageLoadHTTPStatus(): number | null;
    triggerParsingOfEventHandlerAttributes(): Promise<void>;
    extractBaseURI(): Promise<string>;
    addHTMLDynamicDEPLocation(har: HAR): Promise<HAR>;
    addWindowCreatedListener(cb: WindowCreatedListener): void;
    resetWindowCreatedListeners(): void;
    getEventHandlerAttrs(): string[];
    close(): Promise<void>;
}

export type WindowCreatedListener = (bot: HeadlessBot) => void;
