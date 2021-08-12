package main

import (
	"archive/tar"
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"os"
)

func readTar(path string) (string, map[string][]byte, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", nil, err
	}
	defer f.Close()
	resources := make(map[string][]byte)
	metainfo := make(map[string]interface{})

	tr := tar.NewReader(f)

	for {
		header, err := tr.Next()
		if err == io.EOF {
			indexURL, mapURLs := getMapURLs(metainfo, resources)
			return indexURL, mapURLs, nil
		}
		if err != nil {
			return "", nil, err
		}

		b, err := ioutil.ReadAll(tr)
		if err != nil {
			return "", nil, err
		}

		if header.Typeflag != tar.TypeReg {
			return "", nil, errors.New("Unexpected file in tar: " + header.Name)
		}

		if header.Name == "metainfo.json" {
			err := json.Unmarshal(b, &metainfo)
			if err != nil {
				return "", nil, err
			}
		} else {
			resources[header.Name] = b
		}
	}
}

func getMapURLs(
	metainfo map[string]interface{},
	resources map[string][]byte,
) (string, map[string][]byte) {
	var indexURL string
	mapURLs := make(map[string][]byte)
	for fname, content := range resources {
		u := metainfo[fname].(string)
		mapURLs[u] = content
		if fname == "index.html" {
			indexURL = u
		}
	}
	return indexURL, mapURLs
}
