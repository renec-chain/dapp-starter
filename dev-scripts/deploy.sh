if [[ -n $1 ]]; then
    WALLET_NAME=$1
else
    WALLET_NAME="id"
fi

PROGRAM_NAME_UNDERSCORE=${PROGRAM_NAME//-/_}
solana program deploy target/deploy/$PROGRAM_NAME_UNDERSCORE.so --keypair .wallets/$WALLET_NAME.json --url $CLUSTER_URL