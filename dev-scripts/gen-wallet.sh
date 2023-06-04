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

# Generate a new Solana wallet
solana-keygen new --outfile "$WALLET_PATH/$WALLET_NAME.json" 

WALLET_ADDRESS=$(solana address -k "$WALLET_PATH/$WALLET_NAME.json")

# faucet token on RENEC testnet
echo "Fauceting wallet on renec testnet..."
solana airdrop 10 "$WALLET_ADDRESS" --url $RENEC_TESTNET_URL


echo "New wallet created: $WALLET_PATH/$WALLET_NAME.json"
echo "Wallet address: $WALLET_ADDRESS"
