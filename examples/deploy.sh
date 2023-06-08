#!/bin/bash

RENEC_TESTNET_URL=https://api-testnet.renec.foundation:8899/
WALLET=./wallets/id.json

WALLET_ADDRESS=$(solana address -k "$WALLET")


echo "Fauceting wallet on $RENEC_TESTNET_URL..."
solana airdrop 10 "$WALLET_ADDRESS" --url $RENEC_TESTNET_URL

echo "Deploying program..."
solana program deploy target/deploy/dapp_starter.so --keypair $WALLET --url $RENEC_TESTNET_URL