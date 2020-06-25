import { Analyzer } from './analyzer';
import { HeadlessBot } from './browser/headless-bot';
import { DynamicAnalyzer } from './dynamic/analyzer';
import { mineDEPsFromHTML } from './html-deps';
import { HAR } from './har';

export class DynamicPageAnalyzer {
    htmlDEPs: HAR[];

    readonly analyzer: Analyzer;
    readonly bot: HeadlessBot;

    constructor() {
        const analyzer = new Analyzer();
        const bot = new HeadlessBot(false, false);
        const dynamicAnalyzer = new DynamicAnalyzer();

        dynamicAnalyzer.newScriptCallback = analyzer.addScript.bind(analyzer);
        bot.onWindowCreated = dynamicAnalyzer.addWindow.bind(dynamicAnalyzer);

        this.analyzer = analyzer;
        this.bot = bot;
        this.htmlDEPs = [];
    }

    async run(url: string): Promise<void> {
        await this.bot.navigate(url);
        this.analyzer.analyze(url);
        this.htmlDEPs = mineDEPsFromHTML(this.bot.webpage);
    }
}
