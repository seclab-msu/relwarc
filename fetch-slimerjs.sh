#!/bin/bash -e

git clone https://github.com/seclab-msu/slimerjs
rm -fr ./slimerjs/.git
mv ./slimerjs/* src/backend/slimerjs/
rmdir slimerjs