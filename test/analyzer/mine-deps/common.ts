import { Analyzer } from "../../../src/analyzer/analyzer";

export function makeAndRunSimple(script: string, url='http://example.com/'): Analyzer {
    const analyzer = new Analyzer();
    analyzer.addScript(script);
    analyzer.analyze(url);
    return analyzer;
}
