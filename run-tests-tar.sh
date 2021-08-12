#!/usr/bin/env bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
. $SCRIPT_DIR/src/run-tar.sh $SCRIPT_DIR/tarserver/tarserver.test -test.v
