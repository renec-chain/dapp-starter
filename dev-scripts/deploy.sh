if [[ -n $1 ]]; then
    WALLET_NAME=$1
else
    WALLET_NAME="id"
fi

solana program deploy target/deploy/dapp_starter.so --keypair .wallets/$WALLET_NAME.json --url $CLUSTER_URL