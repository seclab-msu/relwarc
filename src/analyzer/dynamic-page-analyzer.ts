import { Analyzer } from 'analyzer/analyzer';
import { HeadlessBot } from 'analyzer/headless-bot';

export class DynamicPageAnalyzer {
    readonly analyzer: Analyzer;
    readonly bot: HeadlessBot;

    constructor() {
        this.analyzer = new Analyzer();
        this.bot = new HeadlessBot();

        this.bot.onWindowCreated = (win: object) => {
            this.analyzer.attachDebugger(win);
        }
    }

    async run(url: string) {
        await this.bot.navigate(url);
    }
}