import { Analyzer } from 'analyzer/analyzer';
import { HeadlessBot } from 'analyzer/headless-bot';

export class DynamicPageAnalyzer {
    readonly analyzer: Analyzer;
    readonly bot: HeadlessBot;

    constructor() {
        const analyzer = new Analyzer();
        const bot = new HeadlessBot();

        bot.onWindowCreated = analyzer.attachDebugger.bind(analyzer);

        this.analyzer = analyzer;
        this.bot = bot;
    }

    async run(url: string) {
        await this.bot.navigate(url);
    }
}