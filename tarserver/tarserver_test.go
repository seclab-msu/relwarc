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

var (
	expected     HAR
	tarserverDir string
)

func init() {
	expected = HAR{
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
	ex, err := os.Executable()
	if err != nil {
		log.Panic(err)
	}
	tarserverDir = filepath.Dir(ex)
}

func TestHTTPServer(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-1.tar", analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected.URL = "http://test.com/example"

	assert.Contains(t, results, expected)
}

func TestHTTPSServer(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-2.tar", analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected.URL = "https://test.com/example"

	assert.Contains(t, results, expected)
}

func TestParamsInDifferentScripts(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-3.tar", analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected.URL = "http://test.com/test/test?example=example"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "example",
			Value: "example",
		},
	}

	assert.Contains(t, results, expected)
}

func TestTarWithoutRequiredScript(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-4.tar", analyzerArgs)
}

func TestScriptsWithQueryString(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-5.tar", analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected.URL = "http://test.com/test/url?q=123"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "q",
			Value: "123",
		},
	}

	assert.Contains(t, results, expected)
}

func TestScriptsWithSamePaths(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-6.tar", analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected.URL = "http://test.com/test/testing?s=1"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "s",
			Value: "1",
		},
	}

	assert.Contains(t, results, expected)

	expected.URL = "http://test.com/test/example?q=123"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "q",
			Value: "123",
		},
	}

	assert.Contains(t, results, expected)
}

func TestScriptsWithSamePathsButDifferentHosts(t *testing.T) {
	var buf bytes.Buffer
	var analyzerArgs []string

	run(&buf, os.Stderr, tarserverDir+"/testdata/test-tar-7.tar", analyzerArgs)
	var results []HAR
	json.Unmarshal(buf.Bytes(), &results)

	expected.URL = "http://test.com/test/testing?s=1"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "s",
			Value: "1",
		},
	}

	assert.Contains(t, results, expected)

	expected.URL = "http://test.com/test/example?q=123"
	expected.QueryString = []KeyValue{
		KeyValue{
			Name:  "q",
			Value: "123",
		},
	}

	assert.Contains(t, results, expected)
}
