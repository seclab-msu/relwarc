import { Analyzer } from './analyzer';
import { HeadlessBot } from './browser/headless-bot';
import { DynamicAnalyzer } from './dynamic/analyzer';
import { mineDEPsFromHTML } from './html-deps';
import { DynamicDEPMiner } from './dynamic-deps';
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
import { filterStaticDEPs } from './static-filter';

const MAX_LOAD_ATTEMPTS = 5;

export class DynamicPageAnalyzer {
    htmlDEPs: HAR[];
    dynamicDEPs: HAR[];
    analyzerDEPs: HAR[];

    readonly analyzer: Analyzer;
    readonly bot: HeadlessBot;

    private readonly dynamicAnalyzer: DynamicAnalyzer;

    private readonly domainFilteringMode: DomainFilteringMode;
    private readonly filterStatic: boolean;
    private readonly dynamicDEPMiner: DynamicDEPMiner | null;
    /* eslint max-lines-per-function: "off" */
    constructor({
        logRequests=false,
        debugRequestLoading=false,
        domainFilteringMode=DomainFilteringMode.Any,
        mineDynamicDEPs=true,
        onlyJSDynamicDEPs=false,
        recordRequestStackTraces=false,
        loadTimeout=(undefined as number | undefined),
        filterStatic=true,
        proxy=undefined,
    }={}) {
        const bot = new HeadlessBot({
            printPageErrors: false,
            printPageConsoleLog: false,
            logRequests,
            debugRequestLoading,
            loadTimeout,
            recordRequestStackTraces,
            proxy,
        });

        const dynamicAnalyzer = new DynamicAnalyzer();
        const analyzer = new Analyzer(dynamicAnalyzer);

        this.dynamicAnalyzer = dynamicAnalyzer;

        bot.addWindowCreatedListener((bot: HeadlessBot) => {
            return dynamicAnalyzer.close().then(() => {
                analyzer.resetScripts();
                return dynamicAnalyzer.addWindow(bot);
            });
        });

        this.analyzer = analyzer;
        this.bot = bot;
        this.htmlDEPs = [];
        this.analyzerDEPs = [];
        this.dynamicDEPs = [];
        this.filterStatic = filterStatic;

        if (mineDynamicDEPs) {
            this.dynamicDEPMiner = new DynamicDEPMiner(
                this.bot,
                onlyJSDynamicDEPs,
                recordRequestStackTraces
            );
            this.dynamicDEPs = this.dynamicDEPMiner.getDEPs();
        } else {
            this.dynamicDEPMiner = null;
        }

        this.domainFilteringMode = domainFilteringMode;
    }

    /* eslint-disable-next-line max-params */
    async run(
        url: string,
        uncomment=true,
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

        await this.bot.triggerParsingOfEventHandlerAttributes();

        this.analyzer.adjustScripts(scr => {
            if (scr.sourceType === 'script-or-event-handler') {
                const ehAttrs = this.bot.getEventHandlerAttrs();

                if (ehAttrs.includes(scr.sourceText)) {
                    const t = 'eventHandler';
                    scr.sourceType = t;
                    scr.url = DynamicAnalyzer.adjustURL(
                        scr.url || 'unknown',
                        t,
                        'unknown'
                    );
                }
            }
            return scr;
        });

        // this.bot.webpage.render("/tmp/page.png");

        const status = this.bot.getPageLoadHTTPStatus();

        // NOTE: status can actually indicate load of different URL due to JS redirect (see #5283)
        log(`Opened URL ${url} with http status ${status}, now run analyzer`);

        const baseURI = await this.bot.extractBaseURI();
        this.analyzer.analyze(url, uncomment, baseURI);

        this.analyzerDEPs = this.analyzer.hars;

        if (mineHTMLDEPs) {
            log('Analyzer done, now mine HTML DEPs');

            this.htmlDEPs = await mineDEPsFromHTML(this.bot);
        }

        this.filterDEPsByDomain(url);

        if (addHtmlDynamicDEPsLocation) {
            log('HTML DEPs mining done, now build CSS Selectors for html dynamic DEPs');
            this.dynamicDEPs = await Promise.all(this.dynamicDEPs.map(
                har => this.bot.addHTMLDynamicDEPLocation(har)
            ));
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

    async close(): Promise<void> {
        this.bot.resetWindowCreatedListeners();

        if (this.dynamicDEPMiner !== null) {
            this.dynamicDEPMiner.close();
        }

        await this.dynamicAnalyzer.close();

        await this.bot.close();
    }
}
