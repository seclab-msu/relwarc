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
3. **SlimerJS** should be downloaded:
```
./fetch-slimerjs.sh
```
Also, Firefox 59 is required for SlimerJS. It can be downloaded
[here](https://ftp.mozilla.org/pub/firefox/releases/59.0/). Environment variable
`SLIMERJSLAUNCHER` may be set pointing to location of Firefox 59 binary.
Otherwise, it should be accessible in `PATH` as `firefox`.

## Usage

Run analyzer with SlimerJS on webpage given it's URL, get resulting HARs printed
to console:
```
./run http://secsem.ru/ctf/autumn_2013.html
```

Do the same, but print only discovered arguments, not HARs:

```
./run http://secsem.ru/ctf/autumn_2013.html --args
```

Also, it is possible to run analyzer without a headless browser, using pure
NodeJS - to analyze a single file (not a page).

```
./nrun /tmp/test.js http://test.com/testing/
```

Here, `http://test.com/testing/` is a base url for discovered requests
(it is optional).

### Proxy

Analyze the code via HTTP or SOCKS proxy with SlimerJS:
```
./run --proxy=host:port --proxy-type=http|socks5 http://secsem.ru/ctf/autumn_2013.html
```

### Tar mode

It is possible to analyze the code using a **local tar copy** of the page with
it's resources. Script `run-analyzer-tar` is used for that, it requires
compiled `tarserver`. See it's docs [here](tarserver/README.md).


## HAR tools

Run hars-deduplication module separate from analyzer:
```
node src/filter-hars.js
```
Receives array of hars to `stdin`.

Pretty-printing HARS:
```
./ppdeps path/to/file
```
(use `/dev/stdin` as `path/to/file` to pipe HARs to the tool)

## Tests

To run tests on SlimerJS:
```
./run-tests
```

On NodeJS:
```
./nrun-tests
```
Run tests on SlimerJS, ensuring that SlimerJS-specific tests are included:
```
./run-tests --ensure-slimer
```
Test runner accepts patterns of test files as command-line arguments. This
allows to run tests from only particular test files:
```
./nrun-tests mine-deps/test-basic.js
```
```
./run-tests 'mine-args/test*.js' page/test-basic.js
```

## Publications

relwarc is an implementation of the JavaScript analysis presented in the following papers:

* [Finding server-side endpoints with static analysis of client-side JavaScript](https://link.springer.com/chapter/10.1007/978-3-031-54129-2_26)
* [Dead or alive: Discovering server HTTP endpoints in both reachable and dead client-side code](https://www.sciencedirect.com/science/article/abs/pii/S2214212624000498)
* [Обнаружение серверных точек взаимодействия в веб-приложениях на основе анализа клиентского JavaScript-кода](https://journals.tsu.ru/pdm/&journal_page=archive&id=2153&article_id=48226)
