package main

import (
	"context"
	"fmt"
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

func main() {
	indexURL, mapURLs, err := readTar(os.Args[1])
	if err != nil {
		log.Panic(err)
	}

	tmpfile, err := ioutil.TempFile("", "")
	if err != nil {
		log.Panic(err)
	}

	used := make(map[string]bool)
	for u := range mapURLs {
		parsedURL, err := url.Parse(u)
		if err != nil {
			log.Panic(err)
		}
		host := parsedURL.Hostname()
		if _, ok := used[host]; ok {
			continue
		}
		used[host] = true
		tmpfile.WriteString(fmt.Sprintf("%s %s\n", localhost, host))
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

	runAnalyzer(indexURL)

	if err := srvHTTP.Shutdown(context.Background()); err != nil {
		log.Panic(err)
	}
	if err := srvHTTPS.Shutdown(context.Background()); err != nil {
		log.Panic(err)
	}

	httpServerExitDone.Wait()
}

func startServers(mapURLs map[string]string, wg *sync.WaitGroup) (*http.Server, *http.Server) {
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

			path := parsedURL.EscapedPath()
			if path == "" {
				path = "/"
			}

			if r.URL.EscapedPath() == path && r.Host == parsedURL.Host {
				fmt.Fprintf(w, content)
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

func runAnalyzer(indexURL string) {
	analyzerArgs := append([]string{analyzerPath, indexURL}, os.Args[2:]...)
	cmd := exec.Command(slimerPath, analyzerArgs...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Panic(err)
	}
}
