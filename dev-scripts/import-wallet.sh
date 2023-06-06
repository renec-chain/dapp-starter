#!/bin/bash

# Check if the WALLET_PATH exists, if not, create it
if [ ! -d "$WALLET_PATH" ]; then
  mkdir -p "$WALLET_PATH"
fi

if [[ -n $1 ]]; then
    WALLET_NAME=$1
else
    echo "Please provide a wallet name"
    exit 1
fi

KEYPATH="$WALLET_PATH/$WALLET_NAME.json"

# Import a new Solana wallet
solana-keygen recover 'prompt:?key=0/0' --outfile $KEYPATH

WALLET_ADDRESS=$(solana address -k "$KEYPATH")

# faucet token on RENEC testnet
echo "Fauceting wallet on renec testnet..."
solana airdrop 10 "$WALLET_ADDRESS" --url $RENEC_TESTNET_URL

echo "New wallet created: $KEYPATH"
echo "Wallet address: $WALLET_ADDRESS"
