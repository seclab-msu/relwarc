import { Analyzer } from './analyzer';
import { HeadlessBot } from './browser/headless-bot';
import { OfflineHeadlessBot } from './browser/offline-headless-bot';
import { DynamicAnalyzer } from './dynamic/analyzer';
import { mineDEPsFromHTML } from './html-deps';
import { HAR } from './har';
import { log } from './logging';
import {
    DomainFilteringMode,
    filterByDomain
} from './domain-filtering';

export class DynamicPageAnalyzer {
    htmlDEPs: HAR[];

    readonly analyzer: Analyzer;
    readonly bot: HeadlessBot | OfflineHeadlessBot;

    private readonly domainFilteringMode: DomainFilteringMode;

    constructor({
        logRequests=false,
        mapURLs=(null as object | null),
        resources=(null as object | null),
        domainFilteringMode=DomainFilteringMode.Any
    }={}) {
        let bot: HeadlessBot | OfflineHeadlessBot;
        if (mapURLs && resources) {
            bot = new OfflineHeadlessBot(mapURLs, resources, {
                printPageErrors: false,
                printPageConsoleLog: false,
                logRequests
            });
        } else {
            bot = new HeadlessBot({
                printPageErrors: false,
                printPageConsoleLog: false,
                logRequests
            });
        }

        const dynamicAnalyzer = new DynamicAnalyzer();
        const analyzer = new Analyzer(dynamicAnalyzer);

        bot.onWindowCreated = dynamicAnalyzer.addWindow.bind(dynamicAnalyzer);

        this.analyzer = analyzer;
        this.bot = bot;
        this.htmlDEPs = [];

        this.domainFilteringMode = domainFilteringMode;
    }

    async run(
        url: string,
        uncomment?: boolean,
        mineHTMLDEPs=true
    ): Promise<void> {
        this.analyzer.harFilter = (har: HAR): boolean => {
            return filterByDomain(har.url, url, this.domainFilteringMode);
        };


        log(`Navigating to URL: ${url}`);

        await this.bot.navigate(url);

        // this.bot.webpage.render("/tmp/page.png");

        log(`Opened URL ${url}, now run analyzer`);

        this.analyzer.analyze(url, uncomment);

        if (mineHTMLDEPs) {
            log('Analyzer done, now mine HTML DEPs');

            this.htmlDEPs = mineDEPsFromHTML(this.bot.webpage).filter(har => {
                return filterByDomain(har.url, url, this.domainFilteringMode);
            });
        }
    }
}
