package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
)

const (
	hostsPath = "/etc/hosts"
	localhost = "127.0.0.1"
)

type analyzerBackend struct {
	runnerPath         string
	analyzerScriptPath string
}

var backends = map[string]analyzerBackend{
	"slimerjs": analyzerBackend{
		runnerPath:         "%s/../src/backend/slimerjs/slimerjs",
		analyzerScriptPath: "%s/../src/backend/slimerjs/run-analyzer.js",
	},
	"chrome": analyzerBackend{
		runnerPath:         "node",
		analyzerScriptPath: "%s/../src/backend/chrome/run-analyzer.js",
	},
}

func formatPath(p string) string {
	if !strings.Contains(p, "%s") {
		return p
	}
	ex, err := os.Executable()
	if err != nil {
		log.Panic(err)
	}
	exPath := filepath.Dir(ex)
	return fmt.Sprintf(p, exPath)
}

func (a *analyzerBackend) getRunnerPath() string {
	return formatPath(a.runnerPath)
}

func (a *analyzerBackend) getAnalyzerScriptPath() string {
	return formatPath(a.analyzerScriptPath)
}

var (
	sslCrtPath     = "%s/ssl/server.crt"
	sslKeyPath     = "%s/ssl/server.key"
	excludeHeaders = map[string]struct{}{
		"age":               struct{}{},
		"alt-svc":           struct{}{},
		"cache-control":     struct{}{},
		"content-encoding":  struct{}{},
		"date":              struct{}{},
		"etag":              struct{}{},
		"expect-ct":         struct{}{},
		"last-modified":     struct{}{},
		"report-to":         struct{}{},
		"vary":              struct{}{},
		"content-length":    struct{}{},
		"transfer-encoding": struct{}{},
	}
	tarserverLogs = flag.Bool("no-tarserver-logs", false, "Disable tarserver logs")
	chosenBackend = flag.String("backend", "chrome", "Analyzer backend")
)

func init() {
	ex, err := os.Executable()
	if err != nil {
		log.Panic(err)
	}
	exPath := filepath.Dir(ex)
	sslCrtPath = fmt.Sprintf(sslCrtPath, exPath)
	sslKeyPath = fmt.Sprintf(sslKeyPath, exPath)
}

func run(outStream, errStream io.Writer, tarPath string, backend *analyzerBackend, args []string) {
	resources, err := readTar(tarPath)
	if err != nil {
		log.Panic(err)
	}

	tmpfile, err := ioutil.TempFile("", "")
	if err != nil {
		log.Panic(err)
	}

	used := make(map[string]struct{})
	for _, info := range resources {
		u, err := url.Parse(info.URL)
		if err != nil {
			log.Panic(err)
		}
		host := u.Hostname()
		if _, ok := used[host]; ok {
			continue
		}
		used[host] = struct{}{}
		if _, err := fmt.Fprintf(tmpfile, "%s %s\n", localhost, host); err != nil {
			log.Panic(err)
		}

	}

	if err := syscall.Mount(tmpfile.Name(), hostsPath, "", syscall.MS_BIND, ""); err != nil {
		log.Panic(err)
	}
	os.Remove(tmpfile.Name())

	err = exec.Command("ip", "link", "set", "dev", "lo", "up").Run()
	if err != nil {
		log.Panic(err)
	}

	var httpServerExitDone sync.WaitGroup
	httpServerExitDone.Add(2)

	srvHTTP, srvHTTPS := startServers(resources, &httpServerExitDone)

	runCmd(resources["index.html"].URL, args, outStream, errStream, backend)

	if err := srvHTTP.Shutdown(context.Background()); err != nil {
		log.Panic(err)
	}
	if err := srvHTTPS.Shutdown(context.Background()); err != nil {
		log.Panic(err)
	}

	if err := syscall.Unmount(hostsPath, 0); err != nil {
		log.Panic(err)
	}
	httpServerExitDone.Wait()
}

func main() {
	flag.Parse()
	tarPath := flag.Args()[0]
	args := flag.Args()[1:]
	backend, ok := backends[*chosenBackend]
	if !ok {
		log.Panicf("Bad backend: %q", *chosenBackend)
	}
	run(os.Stdout, os.Stderr, tarPath, &backend, args)
}

func startServers(resources map[string]*Resource, wg *sync.WaitGroup) (*http.Server, *http.Server) {
	var srvHTTP, srvHTTPS http.Server

	lHTTP, err := net.Listen("tcp", ":80")
	if err != nil {
		log.Panic(err)
	}

	lHTTPS, err := net.Listen("tcp", ":443")
	if err != nil {
		log.Panic(err)
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.Header().Add("Access-Control-Allow-Origin", "*")
			w.Header().Add("Access-Control-Allow-Methods", "*")
			w.Header().Add("Access-Control-Allow-Headers", "*")
			w.WriteHeader(http.StatusOK)
			return
		}
		for _, info := range resources {
			parsedURL, err := url.Parse(info.URL)
			if err != nil {
				log.Panic(err)
			}

			reqHost := normalizeHost(r.TLS != nil, r.Host)
			srvHost := normalizeHost(parsedURL.Scheme == "https", parsedURL.Host)

			if r.URL.RequestURI() == parsedURL.RequestURI() && reqHost == srvHost {
				for h, values := range info.Headers {
					if _, ok := excludeHeaders[strings.ToLower(h)]; ok {
						continue
					}
					for _, v := range values {
						w.Header().Add(h, v)
					}
				}

				w.WriteHeader(http.StatusOK)

				n, err := w.Write(info.Body)
				if n != len(info.Body) || err != nil {
					log.Panic(err)
				}

				return
			}
		}
		if !*tarserverLogs {
			log.Printf("Tarserver: 404 Not Found: %s", r.Host+r.URL.RequestURI())
		}
		w.WriteHeader(http.StatusNotFound)
	})

	srvHTTP.Handler = handler
	srvHTTPS.Handler = handler

	go func() {
		defer wg.Done()
		if err := srvHTTP.Serve(lHTTP); err != http.ErrServerClosed {
			log.Panic(err)
		}
	}()

	go func() {
		defer wg.Done()
		if err := srvHTTPS.ServeTLS(lHTTPS, sslCrtPath, sslKeyPath); err != http.ErrServerClosed {
			log.Panic(err)
		}
	}()

	return &srvHTTP, &srvHTTPS
}

func runCmd(indexURL string, args []string, outStream, errStream io.Writer, backend *analyzerBackend) {
	if _, ok := os.LookupEnv("TARSERVER_RAW_ARGS"); !ok {
		args = append([]string{
			backend.getRunnerPath(),
			backend.getAnalyzerScriptPath(),
			indexURL,
		}, args...)
	}
	cmd := exec.Command(args[0], args[1:]...)
	cmd.Stdout = outStream
	cmd.Stderr = errStream
	if err := cmd.Run(); err != nil {
		log.Panic(err)
	}
}

func normalizeHost(secure bool, host string) string {
	hostname, port, err := net.SplitHostPort(host)
	if err != nil {
		return host
	}
	if secure && port == "443" || !secure && port == "80" {
		return hostname
	}
	return host
}
