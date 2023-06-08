# Getting started with dapp example

  First, run build & deploy program
  - Build program
  
  ```bash
  cd examples && ./build.sh
  ```
  - Deploy program
  ```bash
  ./deploy.sh
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
  
    ![daemonWallet](../public/connect_wallet.png)

  - The example `Counter` program, which allows users to `initialize a counter` and `increment` the count`.
  
    ![counter](../public/counter.png)

  ### Presequisites

  - [Node.js 16.8.0](https://nodejs.org/en) or newer
  - `build and deploy` the program to the `renec testnet`. Make sure that you've run `make build` and `CLUSTER=testnet make deploy` before running the frontend.
