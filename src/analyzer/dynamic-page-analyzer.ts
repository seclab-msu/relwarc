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

export class DynamicPageAnalyzer {
    htmlDEPs: HAR[];
    dynamicDEPs: HAR[];
    analyzerDEPs: HAR[];

    readonly analyzer: Analyzer;
    readonly bot: HeadlessBot | OfflineHeadlessBot;

    private readonly domainFilteringMode: DomainFilteringMode;

    constructor({
        logRequests=false,
        mapURLs=(null as object | null),
        resources=(null as object | null),
        domainFilteringMode=DomainFilteringMode.Any,
        mineDynamicDEPs=true
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
        this.dynamicDEPs = [];
        this.analyzerDEPs = [];

        if (mineDynamicDEPs) {
            bot.dynamicDEPsCallback = (req => {
                this.dynamicDEPs.push(requestToHar(req));
            });
        }

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

        this.analyzerDEPs = this.analyzer.hars;

        if (mineHTMLDEPs) {
            log('Analyzer done, now mine HTML DEPs');

            this.htmlDEPs = mineDEPsFromHTML(this.bot.webpage);
        }

        const bot = this.bot;
        if (bot instanceof OfflineHeadlessBot) {
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

        this.dynamicDEPs = this.dynamicDEPs.filter(har => {
            return filterByDomain(har.url, url, this.domainFilteringMode);
        });

        this.htmlDEPs = this.htmlDEPs.filter(har => {
            return filterByDomain(har.url, url, this.domainFilteringMode);
        });
    }

    private changeLocalURL(har: HAR, baseURL: string, port: number): HAR {
        const parsedURL = new URL(har.url);

        if (parsedURL.hostname === '127.0.0.1' && Number(parsedURL.port) === port) {
            const parsedBaseURL = new URL(baseURL);
            parsedURL.protocol = parsedBaseURL.protocol;
            parsedURL.hostname = parsedBaseURL.hostname;
            parsedURL.port = parsedBaseURL.port;
            har.url = parsedURL.href;

            const hostPos = har.headers.findIndex((obj => obj.name == 'Host'));
            har.headers[hostPos].value = parsedBaseURL.host;
        }
        return har;
    }

    getAllDeps(): HAR[] {
        return this.analyzerDEPs.concat(this.dynamicDEPs).concat(this.htmlDEPs);
    }
}
