# tarserver

## Building
`go build`

## Test
`./run-tests-tar.sh`

## Usage (on a top-level)
`./run-analyzer-tar [-no-tarserver-logs] /path/to/tar [js-analyzer args]`

If you want to run another program on this page, you must specify the environment variable 'TARSERVER_RAW_ARGS', for example:

```T=/path/to/tar; TARSERVER_RAW_ARGS=1 ./run-analyzer-tar $T google-chrome --user-data-dir=/tmp/gg --no-sandbox --ignore-certificate-errors `tar xOf $T metainfo.json|jq -r '.["index.html"].url'` ```
