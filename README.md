# dapp-starter

This repo provides a starting point for building a dapp on the `renec` blockchain.

## Prerequisite

- cargo / rust

## Scripts

### Setup environemnts

- To setup program dependencies, run:

```
make install-deps
```

This will install the `anchor` and `solana` cli if needed. Default `solana 1.14.6`, `anchor 0.25.0`

To use different version, set the `CLI_VERSION` and `ANCHOR_VERSION` environment variables and run the command
vd:

```
CLI_VERSION=1.9.29 ANCHOR_VERSION=0.20.1 make install-deps
```

- To setup cli cluster config, run:

```
CLUSTER=testnet make set-cluster-url
```

`CLUSTER` variables can be either `mainnet`, `testnet` or `localnet`, which corresponding to `RENEC cluster url`. Default `CLUSTER` is `testnet`.

### Setup wallets

- To gen new wallets, run:

```
make gen-wallet name=<wallet-name>
```

If not passing `name`, default name of the wallet will be `id`. The wallets' screte keys will be stored in `./wallets` folder.

- To request faucet token in `testnet` or `localnet`, run:

```
make faucet amount=3  name="kien"
```

If not passing `name`, default name of the wallet will be `id`.
