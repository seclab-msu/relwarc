#!/usr/bin/env bash

unshare -mnr -- ../tarserver/tarserver $@
