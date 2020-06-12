import { Analyzer } from './analyzer';
import { HeadlessBot } from './browser/headless-bot';
import { DynamicAnalyzer } from './dynamic/analyzer';

export class DynamicPageAnalyzer {
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
    }

    async run(url: string) {
        await this.bot.navigate(url);
        this.analyzer.analyze(url);
    }
}