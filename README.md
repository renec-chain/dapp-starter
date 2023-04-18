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

To use different version that compatible with `renec cluster`, set the `CLUSTER` and `ANCHOR_VERSION` environment variables and run the command
vd:

```
CLUSTER=mainnet ANCHOR_VERSION=0.20.1 make install-deps
```

`CLUSTER` can either be `mainnet`, `testnet` or `localnet`. By setting cluster correctly, the installer will set the correct `cli` for interaction

- To run a `localnet` that has the same version as `renec-mainnet`, run;

```
make localnet
```

- To run a `localnet` that has the same version as `renec-testnet`, run;

```
CLUSTER=testnet make localnet
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

### Build && Deploy

- To build program:

```
make build
```

This command will generate `program keypair`if needed, and replace it inside `programs/dapp-starter/src/lib.rs` file.
Then it will build the program and generate `program so` file.

- To deploy

```
CLUSTER=mainnet make deploy
```

This command deploy the program, under `.wallets/id.json` authority. The program will be deploy to `CLUSTER` env, which could either be `localnet`, `mainnet` or `testnet`
