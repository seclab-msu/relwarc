# relwarc

Crawlers discover HTTP requests by actively interacting with web pages. Relwarc
does the opposite: it refrains from page interaction as much as possible and
looks at the source code itself.

This is a client-side JavaScript code analyzer for discovering server HTTP endpoints.

## Dependencies and compilation

To analyze web pages, the analyzer uses a headless browser. It can run using SlimerJS.

To get analyzer running, several things should be done:

1. NPM dependencies (including TypeScript) should be installed.
```
npm install
```
2. TypeScript code should be compiled into JS. This can be done with
```
npx tsc
```

## Usage

Run using NodeJS - to analyze a single file (not a page).

```
node src/run-analyzer-node.js /tmp/test.js http://test.com/testing/
```


Run analyzer with SlimerJS on webpage given it's URL, get resulting HARs printed
to console:
```
./slimerjs/slimerjs ./src/run-analyzer.js http://secsem.ru/ctf/autumn_2013.html
```

## Publications

relwarc is an implementation of the JavaScript analysis presented in the following papers:

* [Finding server-side endpoints with static analysis of client-side JavaScript](https://link.springer.com/chapter/10.1007/978-3-031-54129-2_26)
* [Dead or alive: Discovering server HTTP endpoints in both reachable and dead client-side code](https://www.sciencedirect.com/science/article/abs/pii/S2214212624000498)
* [Обнаружение серверных точек взаимодействия в веб-приложениях на основе анализа клиентского JavaScript-кода](https://journals.tsu.ru/pdm/&journal_page=archive&id=2153&article_id=48226)
