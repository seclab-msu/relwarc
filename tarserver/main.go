package main

import (
	"context"
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
	"sync"
	"syscall"
)

const (
	hostsPath = "/etc/hosts"
	localhost = "127.0.0.1"
)

var (
	sslCrtPath   = "%s/ssl/server.crt"
	sslKeyPath   = "%s/ssl/server.key"
	slimerPath   = "%s/../src/slimerjs"
	analyzerPath = "%s/../src/run-analyzer.js"
)

func init() {
	ex, err := os.Executable()
	if err != nil {
		log.Panic(err)
	}
	exPath := filepath.Dir(ex)
	sslCrtPath = fmt.Sprintf(sslCrtPath, exPath)
	sslKeyPath = fmt.Sprintf(sslKeyPath, exPath)
	slimerPath = fmt.Sprintf(slimerPath, exPath)
	analyzerPath = fmt.Sprintf(analyzerPath, exPath)
}

func run(outStream, errStream io.Writer, tarPath string, args []string) {
	indexURL, mapURLs, err := readTar(tarPath)
	if err != nil {
		log.Panic(err)
	}

	tmpfile, err := ioutil.TempFile("", "")
	if err != nil {
		log.Panic(err)
	}

	used := make(map[string]struct{})
	for u := range mapURLs {
		parsedURL, err := url.Parse(u)
		if err != nil {
			log.Panic(err)
		}
		host := parsedURL.Hostname()
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

	srvHTTP, srvHTTPS := startServers(mapURLs, &httpServerExitDone)

	runCmd(indexURL, args, outStream, errStream)

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
	tarPath := os.Args[1]
	args := os.Args[2:]
	run(os.Stdout, os.Stderr, tarPath, args)
}

func startServers(mapURLs map[string][]byte, wg *sync.WaitGroup) (*http.Server, *http.Server) {
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
		for u, content := range mapURLs {
			parsedURL, err := url.Parse(u)
			if err != nil {
				log.Panic(err)
			}

			reqHost := normalizeHost(r.TLS != nil, r.Host)
			srvHost := normalizeHost(parsedURL.Scheme == "https", parsedURL.Host)

			if r.URL.RequestURI() == parsedURL.RequestURI() && reqHost == srvHost {
				n, err := w.Write(content)
				if n != len(content) || err != nil {
					log.Panic(err)
				}
				break
			}
		}
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

func runCmd(indexURL string, args []string, outStream, errStream io.Writer) {
	if _, ok := os.LookupEnv("TARSERVER_RAW_ARGS"); !ok {
		args = append([]string{slimerPath, analyzerPath, indexURL}, args...)
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
