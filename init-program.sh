#!/bin/bash

if [[ -n $1 ]]; then
    PROGRAM_NAME=$1
else
    echo "[ERROR] Please provide a program name"
    exit 1
fi
hygen dapp new $PROGRAM_NAME