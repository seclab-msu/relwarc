#!/usr/bin/env bash

exec unshare -mnr -- $1 ${@:2}
