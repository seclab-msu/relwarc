#!/usr/bin/env bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
exec unshare -mnr -- $SCRIPT_DIR/tarserver/tarserver $@
