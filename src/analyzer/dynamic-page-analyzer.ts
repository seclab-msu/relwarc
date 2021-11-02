import { Analyzer } from './analyzer';
import { HeadlessBot } from './browser/headless-bot';
import { OfflineHeadlessBot } from './browser/offline-headless-bot';
import { DynamicAnalyzer } from './dynamic/analyzer';
import { mineDEPsFromHTML } from './html-deps';
import { requestToHar } from './dynamic-deps';
import { HAR } from './har';
import { log } from './logging';
import {
    DomainFilteringMode,
    filterByDomain
} from './domain-filtering';
import {
    deduplicateDEPs,
    DeduplicationMode
} from './dep-comparison';
import { addHTMLDynamicDEPLocation } from './html-dep-location';
import { filterStaticDEPs } from './static-filter';

const MAX_LOAD_ATTEMPTS = 5;

export class DynamicPageAnalyzer {
    htmlDEPs: HAR[];
    dynamicDEPs: HAR[];
    analyzerDEPs: HAR[];

    readonly analyzer: Analyzer;
    readonly bot: HeadlessBot | OfflineHeadlessBot;

    private readonly dynamicAnalyzer: DynamicAnalyzer;

    private readonly domainFilteringMode: DomainFilteringMode;
    private readonly filterStatic: boolean;
    /* eslint max-lines-per-function: "off" */
    constructor({
        logRequests=false,
        debugRequestLoading=false,
        mapURLs=(null as object | null),
        domainFilteringMode=DomainFilteringMode.Any,
        mineDynamicDEPs=true,
        onlyJSDynamicDEPs=false,
        recordRequestStackTraces=false,
        loadTimeout=(undefined as number | undefined),
        filterStatic=true
    }={}) {
        let bot: HeadlessBot | OfflineHeadlessBot;
        if (mapURLs) {
            bot = new OfflineHeadlessBot(mapURLs, {
                printPageErrors: false,
                printPageConsoleLog: false,
                logRequests,
                debugRequestLoading,
                loadTimeout,
                recordRequestStackTraces
            });
        } else {
            bot = new HeadlessBot({
                printPageErrors: false,
                printPageConsoleLog: false,
                logRequests,
                debugRequestLoading,
                loadTimeout,
                recordRequestStackTraces
            });
        }

        const dynamicAnalyzer = new DynamicAnalyzer();
        const analyzer = new Analyzer(dynamicAnalyzer);

        this.dynamicAnalyzer = dynamicAnalyzer;

        bot.onWindowCreated = (win: object) => {
            dynamicAnalyzer.close();
            analyzer.resetScripts();
            dynamicAnalyzer.addWindow(win);
        };

        this.analyzer = analyzer;
        this.bot = bot;
        this.htmlDEPs = [];
        this.dynamicDEPs = [];
        this.analyzerDEPs = [];
        this.filterStatic = filterStatic;

        if (mineDynamicDEPs) {
            this.setRequestHandler(onlyJSDynamicDEPs, recordRequestStackTraces);
        }

        this.domainFilteringMode = domainFilteringMode;
    }

    private setRequestHandler(
        onlyJSDynamicDEPs: boolean,
        recordRequestStackTraces: boolean
    ) {
        this.bot.requestCallback = req => {
            if (onlyJSDynamicDEPs && (!req.isXHR && !req.isFetch)) {
                return;
            }
            const har = requestToHar(req);
            if (har === null) {
                log('dynamic-page-analyzer: can not create har');
                return;
            }
            if (recordRequestStackTraces) {
                if (typeof har.initiator == 'undefined') {
                    throw new Error('initiator not set by requestToHar');
                }
                const stacktrace = req.stacktrace;
                if (stacktrace !== null) {
                    har.initiator.stack = stacktrace;
                }
            }
            this.dynamicDEPs.push(har);
        };
    }

    /* eslint-disable-next-line max-params */
    async run(
        url: string,
        uncomment=false,
        mineHTMLDEPs=true,
        addHtmlDynamicDEPsLocation=false,
        reloadPage=true
    ): Promise<void> {
        this.analyzer.harFilter = (har: HAR): boolean => {
            return filterByDomain(har.url, url, this.domainFilteringMode);
        };

        log(`Navigating to URL: ${url}`);

        for (let i = 0; i <= MAX_LOAD_ATTEMPTS; i++) {
            if (!reloadPage || i === MAX_LOAD_ATTEMPTS) {
                this.bot.ignoreSSLError = true;
            }
            await this.bot.navigate(url);
            if (!this.bot.pageLoadingStopped) {
                break;
            }
            log(`Page loading was stopped, will retry: ${i+1}`);
        }

        this.bot.triggerParsingOfEventHandlerAttributes();

        // this.bot.webpage.render("/tmp/page.png");

        const status = this.bot.getPageLoadHTTPStatus();

        // NOTE: status can actually indicate load of different URL due to JS redirect (see #5283)
        log(`Opened URL ${url} with http status ${status}, now run analyzer`);

        this.analyzer.analyze(url, uncomment);

        this.analyzerDEPs = this.analyzer.hars;

        if (mineHTMLDEPs) {
            log('Analyzer done, now mine HTML DEPs');

            this.htmlDEPs = mineDEPsFromHTML(this.bot.webpage);
        }

        const bot = this.bot;
        if (bot instanceof OfflineHeadlessBot) {
            this.fixLocalURLForOfflineMode(url, bot);
        }

        this.filterDEPsByDomain(url);

        if (addHtmlDynamicDEPsLocation) {
            log('HTML DEPs mining done, now build CSS Selectors for html dynamic DEPs');
            this.dynamicDEPs = this.dynamicDEPs.filter(har => {
                return addHTMLDynamicDEPLocation(
                    har,
                    this.bot.webpage,
                    this.bot.getDecodedInitialContent()
                );
            });
        }
    }

    private filterDEPsByDomain(url: string): void {
        this.dynamicDEPs = this.dynamicDEPs.filter(har => {
            return filterByDomain(har.url, url, this.domainFilteringMode);
        });

        this.htmlDEPs = this.htmlDEPs.filter(har => {
            return filterByDomain(har.url, url, this.domainFilteringMode);
        });
    }

    private fixLocalURLForOfflineMode(
        url: string,
        bot: OfflineHeadlessBot
    ): void {
        this.analyzerDEPs = this.analyzerDEPs.filter(har => {
            return this.changeLocalURL(har, url, bot.getServerPort());
        });

        this.dynamicDEPs = this.dynamicDEPs.filter(har => {
            return this.changeLocalURL(har, url, bot.getServerPort());
        });

        this.htmlDEPs = this.htmlDEPs.filter(har => {
            return this.changeLocalURL(har, url, bot.getServerPort());
        });
    }

    private changeLocalURL(har: HAR, baseURL: string, port: number): HAR {
        const parsedURL = new URL(har.url);
        if (
            parsedURL.hostname === '127.0.0.1' &&
            Number(parsedURL.port) === port
        ) {
            har.url = this.replaceOrigin(har.url, baseURL);
            const hostPos = har.headers.findIndex((obj => obj.name == 'Host'));
            har.headers[hostPos].value = new URL(har.url).host;
        }

        if (har.initiator && har.initiator.url) {
            const parsedInitiatorURL = new URL(har.initiator.url);
            if (
                parsedInitiatorURL.hostname === '127.0.0.1' &&
                Number(parsedInitiatorURL.port) === port
            ) {
                har.initiator.url = this.replaceOrigin(
                    har.initiator.url,
                    baseURL
                );
            }
        }

        return har;
    }

    private replaceOrigin(baseURL: string, replaceURL: string): string {
        const parsedBaseURL = new URL(baseURL);
        const parsedReplaceURL = new URL(replaceURL);

        parsedBaseURL.protocol = parsedReplaceURL.protocol;
        parsedBaseURL.hostname = parsedReplaceURL.hostname;
        parsedBaseURL.port = parsedReplaceURL.port;

        return parsedBaseURL.href;
    }

    getAllDeps(deduplicationMode = DeduplicationMode.None): HAR[] {
        let hars = deduplicateDEPs(
            this.analyzerDEPs.concat(this.dynamicDEPs, this.htmlDEPs),
            deduplicationMode
        );
        if (this.filterStatic) {
            hars = filterStaticDEPs(hars);
        }
        return hars;
    }

    close(): void {
        this.bot.onWindowCreated = null;
        this.bot.requestCallback = null;

        this.dynamicAnalyzer.close();

        this.bot.close();
    }
}
