#!/bin/bash

AMOUNT=""

# Parse the arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --name)
      WALLET_NAME="$2"
      shift 2
      ;;
    *)
      if [[ -z $AMOUNT ]]; then
        AMOUNT="$1"
        shift
      else
        echo "Invalid option: $1" >&2
        exit 1
      fi
      ;;
  esac
done

# Check if name is empty
if [[ -z $WALLET_NAME ]]; then
  echo "Please provide a wallet name"
  exit 1
fi

# Get wallet
WALLET_ADDRESS=$(solana address -k "$WALLET_PATH/$WALLET_NAME.json")


echo "Fauceting wallet on $CLUSTER_URL..."
solana airdrop $AMOUNT "$WALLET_ADDRESS" --url $CLUSTER_URL






