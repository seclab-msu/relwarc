package main

import (
	"archive/tar"
	"bufio"
	"compress/gzip"
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"net/http"
	"os"
)

type Resource struct {
	URL     string
	Type    string
	Headers http.Header
	Body    []byte
}

func getCorrectReader(r io.Reader) (io.Reader, error) {
	bReader := bufio.NewReader(r)

	magickBytes, err := bReader.Peek(2)
	if err != nil {
		return nil, err
	}

	if magickBytes[0] == 31 && magickBytes[1] == 139 {
		return gzip.NewReader(bReader)
	}

	return bReader, nil
}

func readTar(path string) (map[string]*Resource, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	bodies := make(map[string][]byte)
	resources := make(map[string]*Resource)

	reader, err := getCorrectReader(f)
	if err != nil {
		return nil, err
	}

	tr := tar.NewReader(reader)

	for {
		header, err := tr.Next()
		if err == io.EOF {
			for fn := range resources {
				resources[fn].Body = bodies[fn]
			}
			return resources, nil
		}
		if err != nil {
			return nil, err
		}

		b, err := ioutil.ReadAll(tr)
		if err != nil {
			return nil, err
		}

		if header.Typeflag != tar.TypeReg {
			return nil, errors.New("Unexpected file in tar: " + header.Name)
		}

		if header.Name == "metainfo.json" {
			err := json.Unmarshal(b, &resources)
			if err != nil {
				return nil, err
			}
		} else {
			bodies[header.Name] = b
		}
	}
}
