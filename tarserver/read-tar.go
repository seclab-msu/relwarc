package main

import (
	"archive/tar"
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

func readTar(path string) (map[string]*Resource, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	bodies := make(map[string][]byte)
	resources := make(map[string]*Resource)

	tr := tar.NewReader(f)

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
