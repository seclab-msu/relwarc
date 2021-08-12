package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
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
	sslCrtPath = "%s/ssl/server.crt"
	sslKeyPath = "%s/ssl/server.key"
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
	for URL := range mapURLs {
		parsedURL, err := url.Parse(URL)
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
	srvHTTP := &http.Server{Addr: ":80"}
	srvHTTPS := &http.Server{Addr: ":443"}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		for URL, content := range mapURLs {
			u, err := url.Parse(URL)
			if err != nil {
				log.Panic(err)
			}

			path := u.EscapedPath()
			if path == "" {
				path = "/"
			}

			if r.URL.EscapedPath() == path && r.Host == u.Host {
				fmt.Fprintf(w, content)
			}
		}
	})

	srvHTTP.Handler = handler
	srvHTTPS.Handler = handler

	go func() {
		defer wg.Done()
		if err := srvHTTP.ListenAndServe(); err != http.ErrServerClosed {
			log.Panic(err)
		}
	}()

	go func() {
		defer wg.Done()
		if err := srvHTTPS.ListenAndServeTLS(sslCrtPath, sslKeyPath); err != http.ErrServerClosed {
			log.Panic(err)
		}
	}()

	return srvHTTP, srvHTTPS
}

func runAnalyzer(indexURL string) {
	analyzerArgs := append([]string{"./run-analyzer.js", indexURL}, os.Args[2:]...)
	cmd := exec.Command("./slimerjs", analyzerArgs...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Panic(err)
	}
}
