# Dapp-starter

This repo provides a starting point for building a dapp on the `renec` blockchain.

# Overview

- [Project Structure](#project-structure)
- [Prerequiresites](#prerequisite)
- [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Setup wallet](#setup-wallets)
- [How to use ?](#how-to-use-)
  - [Rpc Endpoint](#rpc-endpoint)
  - [Generate new program](#generate-new-program)
  - [Build & Deploy](#build--deploy)
  - [Port Dapp from Solana](#port-dapp-from-solana)
- [Example](#example)
  - [Build & Deploy](#build--deploy-program)
  - [Run Dapp](#build--deploy-program)
- [Notes](#notes)

# Project Structure
- `examples`: Contains a example for `program` & `dapp`
  - `programs`: An example `Counter program`
  - `app`: Implemented of `dapp` for `Counter progrram`.
- `dev-scripts`: List of scripts support to install deps, build and deploy the program. Support running on `Unix` environemnt.

# Prerequisite

- For Linux user:

```bash
 sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev
 sudo apt install libssl-dev
```

- For Mac user:

```bash
brew install openssl
```

## Dependencies
- For Windows user:
  Prerequisite for window
    - [make](https://www.gnu.org/software/make/manual/make.html)
    - [Chocolatey](https://chocolatey.org/install)
 - Then run
  ```bash
  choco install make
  ```
  from a fresh terminal.

## Program Scripts

  ### Installation

  - To setup program dependencies, run:

  ```bash
  make install-deps
  ```

  This will install the `anchor` and `solana` cli if needed. Default `solana 1.14.6`, `anchor 0.25.0`

  To use different version compatible with `renec cluster`, set the `CLUSTER` and `ANCHOR_VERSION` environment variables and run the command
  </br>
  For example:

  ```bash
  CLUSTER=mainnet ANCHOR_VERSION=0.20.1 make install-deps
  ```

  `CLUSTER` can either be `mainnet`, `testnet` or `localnet`. By setting the cluster correctly, the installer will set the corresponding     `cli` for program's interaction.

  - To run a `localnet` that has the same version as `renec-mainnet`, run;

  ```
  make localnet
  ```

  ### Setup wallets

  - To gen a new wallet, run:

  ```bash
  make gen-wallet name="<wallet-name>"
  ```

  The wallets' screte keys will be stored in `./wallets` folder.

  - To import an existing wallet, run:

  ```bash
  make import-wallet name="<wallet-name>"
  ```

  - To request faucet token in `testnet` or `localnet`, run:

  ```bash
  make faucet amount=1  name="<wallet-name>"
  ```

# How to use ?

  ## Rpc Endpoint

  - Some free RPC providers:
    - Mainnet
      - https://api-mainnet-beta.renec.foundation:8899/
    - Testnet
      - https://api-testnet.renec.foundation:8899/
  ## Generate new program
   We have used [hygen](https://www.hygen.io/) to support generate new program inside `dapp-starter`. You also use your custom program by [Anchor]() in another case that fit with your development process.
   - To generate new program
      ```bash
        ./init-program program-name
      ```
  ## Build & Deploy
   - Build program
  ```bash
  PROGRAM_NAME=program-name make build
  ```
  - Deploy program:
  ```bash
  PROGRAM_NAME=program-name CLUSTER=<cluster> make deploy name="<wallet-name>"
  ```
  Notes:
  This command deploy the program, under `.wallets/<wallet-name>.json` authority. The program will be deploy to `CLUSTER` env, which could either be `localnet`, `mainnet` or `testnet`

  ## Port Dapp from Solana
   To reduce the time to convert and rebuild programs from solana. We have supported scripts to quickly re-deploy programs to renc from previously built programs.

   Bash script params annotation:
     - `program_file_path`: Path to the program file used to deploy on Solana
     - `keypair_path`: Path to the keypair used to deploy on Solana
     - `program_id_keypair`: Path to the program id keypair used to deploy on Solana
   Deploy on Renec-Testnet
   ```bash
      CLUSTER=testnet make port-dapp program_file_path=path/to/program_file.so keypair_path=path/to/wallet.json program_id_keypair=path/tp/program-id/keypair.json
   ```

   Deploy on Renec-Mainnet
   ```bash
      CLUSTER=mainnet make port-dapp program_file_path=path/to/program_file.so keypair_path=path/to/wallet.json progran_id_keypair=path/tp/program-id/keypair.json
   ```


# Example
  ## Build & Deploy Program
  - Build program
  
  ```bash
  cd examples && ./build
  ```
  - Deploy program
  ```bash
  ./deploy
  ```
  
  Notes: Sometime, you need to allowing execute the script
  ```sudo chmod +x script.sh```
  
  ## Run dapp
  ```bash
  cd app && yarn && yarn dev
  ```
  - The dapp is built by `next-js` and `typescript`. It used `@project-serum/anchor` to interact with the program.
    </br>

  - [Daemon-Wallet](https://renec.foundation/en/support/how-to-create-a-new-demon-wallet) has used to connect with `renec-blockchain`.
  
    ![daemonWallet](public/connect_wallet.png)

  - The example `Counter` program, which allows users to `initialize a counter` and `increment` the count`.
  
    ![counter](public/counter.png)

  ### Presequisites

  - [Node.js 16.8.0](https://nodejs.org/en) or newer
  - `build and deploy` the program to the `renec testnet`. Make sure that you've run `make build` and `CLUSTER=testnet make deploy` before running the frontend.
# Notes
