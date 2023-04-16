#!/bin/bash

# Check if the folder exists, if not, create it
FOLDER=".wallets"
if [ ! -d "$FOLDER" ]; then
  mkdir -p "$FOLDER"
fi

if [[ -n $1 ]]; then
    WALLET_NAME=$1
else
    WALLET_NAME="id"
fi

# Generate a new Solana wallet
solana-keygen new --outfile "$FOLDER/$WALLET_NAME.json" 

WALLET_ADDRESS=$(solana address -k "$FOLDER/$WALLET_NAME.json")

# faucet token on RENEC testnet
echo "Fauceting wallet on renec testnet..."
solana airdrop 10 "$WALLET_ADDRESS" --url $RENEC_TESTNET_URL


echo "New wallet created: $FOLDER/$WALLET_NAME.json"
echo "Wallet address: $WALLET_ADDRESS"
