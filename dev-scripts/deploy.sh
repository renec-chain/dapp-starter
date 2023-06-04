#!/bin/bash

if [[ -n $1 ]]; then
    WALLET_NAME=$1
else
    echo "Please provide a wallet name"
    exit 1
fi

PROGRAM_NAME_UNDERSCORE=${PROGRAM_NAME//-/_}
solana program deploy target/deploy/$PROGRAM_NAME_UNDERSCORE.so --keypair $WALLET_PATH/$WALLET_NAME.json --url $CLUSTER_URL