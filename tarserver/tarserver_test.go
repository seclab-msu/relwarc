package main

import (
	"bytes"
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
)

type KeyValue struct {
	Name  string
	Value string
}

type PostData struct {
	Text     string
	Params   []KeyValue
	MimeType string
}

type HAR struct {
	Method      string
	URL         string
	HTTPVersion string
	Headers     []KeyValue
	QueryString []KeyValue
	BodySize    int
	PostData    PostData
}

var tarserverDir string
var backend = backends["chrome"]

func init() {
	ex, err := os.Executable()
	if err != nil {
		log.Panic(err)
	}
	tarserverDir = filepath.Dir(ex)
}

func newHAR() *HAR {
	return &HAR{
		Method:      "GET",
		HTTPVersion: "HTTP/1.1",
		Headers: []KeyValue{
			KeyValue{
				Name:  "Host",
				Value: "test.com",
			},
		},
		QueryString: []KeyValue{},
		BodySize:    0,
	}
}

func TestHTTPServer(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-1.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "http://test.com/example"

	assert.Contains(t, results, *expected)
}

func TestHTTPSServer(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-2.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "https://test.com/example"

	assert.Contains(t, results, *expected)
}

func TestParamsInDifferentScripts(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-3.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "http://test.com/test/test?example=example"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "example",
			Value: "example",
		},
	}

	assert.Contains(t, results, *expected)
}

func TestTarWithoutRequiredScript(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-4.tar", &backend, analyzerArgs)
}

func TestScriptsWithQueryString(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-5.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "http://test.com/test/url?q=123"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "q",
			Value: "123",
		},
	}

	assert.Contains(t, results, *expected)
}

func TestScriptsWithSamePaths(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-6.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "http://test.com/test/testing?s=1"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "s",
			Value: "1",
		},
	}

	assert.Contains(t, results, *expected)

	expected.URL = "http://test.com/test/example?q=123"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "q",
			Value: "123",
		},
	}

	assert.Contains(t, results, *expected)
}

func TestScriptsWithSamePathsButDifferentHosts(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-7.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "http://test.com/test/testing?s=1"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "s",
			Value: "1",
		},
	}

	assert.Contains(t, results, *expected)

	expected.URL = "http://test.com/test/example?q=123"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "q",
			Value: "123",
		},
	}

	assert.Contains(t, results, *expected)
}

func TestDefaultPortOnMainPage(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-8.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "https://test.com/example"

	assert.Contains(t, results, *expected)
}

func TestDefaultPortOnResource(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-9.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "https://test.com/example"

	assert.Contains(t, results, *expected)
}

func TestCrossoriginScripts(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-crossorigin.tar", &backend, analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected := newHAR()
	expected.URL = "https://test.com/test/test?example=example"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "example",
			Value: "example",
		},
	}

	assert.Contains(t, results, *expected)
}
