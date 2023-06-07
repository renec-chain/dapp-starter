#!/bin/bash

PROGRAM_FILE=$1
KEYPAIR_PATH=$2
PROGRAM_ID=$3

echo "deploy program file path: $PROGRAM_FILE"
echo "keypair path: $KEYPAIR_PATH"

solana program deploy $PROGRAM_FILE --keypair $KEYPAIR_PATH --program-id $PROGRAM_ID --url $CLUSTER_URL