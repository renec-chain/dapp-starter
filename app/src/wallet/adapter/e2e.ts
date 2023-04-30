/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseWalletAdapter,
  WalletName,
  WalletNotReadyError,
  WalletSignMessageError,
  WalletSignTransactionError,
  SendTransactionOptions,
} from "@solana/wallet-adapter-base";
import {
  WalletAccountError,
  WalletDisconnectionError,
  WalletPublicKeyError,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import type { Transaction, Connection } from "@solana/web3.js";
import EventEmitter from "eventemitter3";

interface E2EWallet extends EventEmitter {
  isE2E?: boolean;
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T,
    publicKey?: PublicKey
  ): Promise<T>;
  signAllTransaction<T extends Transaction | VersionedTransaction>(
    txs: T[],
    publicKey?: PublicKey
  ): Promise<T[]>;
  signMessage(msg: Uint8Array, publicKey?: PublicKey): Promise<Uint8Array>;
  isConnected: boolean;
}

export interface E2EWalletAdapterConfig {
  keypair?: Keypair;
}

export const E2EWalletName = "E2E" as WalletName<"E2E">;

export class E2EWalletAdapter extends BaseWalletAdapter {
  name = E2EWalletName;
  url = "http://2e2.renec.foundation/";
  icon = "E2E";
  readonly supportedTransactionVersions = null;

  private _connecting: boolean;
  private _wallet: E2EWallet | null;
  private _publicKey: PublicKey | null;
  private _underlyingWallet: Keypair;
  private _readyState: WalletReadyState = WalletReadyState.Installed;

  constructor(config: E2EWalletAdapterConfig = {}) {
    super();
    this._connecting = false;
    this._wallet = null;
    this._publicKey = null;
    this._underlyingWallet = config.keypair || Keypair.generate();
  }

  get publicKey() {
    return this._publicKey;
  }

  get connecting() {
    return this._connecting;
  }

  get connected() {
    return !!this._wallet?.isConnected;
  }

  get readyState() {
    return this._readyState;
  }

  get wallet() {
    return this._wallet;
  }

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      if (this._readyState !== WalletReadyState.Installed)
        throw new WalletNotReadyError();

      this._connecting = true;

      if (this._underlyingWallet) {
        this._publicKey = this._underlyingWallet?.publicKey;
      } else {
        throw new WalletAccountError("No account found");
      }

      this.emit("connect", this._publicKey);
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    if (wallet) {
      this._wallet = null;
      this._publicKey = null;
      wallet.off("accountChanged", this._accountChanged);

      try {
        await wallet.disconnect();
      } catch (error: any) {
        this.emit("error", new WalletDisconnectionError(error?.message, error));
      }
    }

    this.emit("disconnect");
  }

  async sendTransaction(
    transaction: Transaction,
    connection: Connection,
    options: SendTransactionOptions
  ) {
    transaction = await this.prepareTransaction(transaction, connection);
    const signature = await connection.sendTransaction(transaction, [
      this._underlyingWallet,
    ]);
    return signature;
  }

  signTransaction<T extends Transaction>(transaction: T) {
    transaction.partialSign(this._underlyingWallet);
    return transaction;
  }

  async signAllTransactions<T extends Transaction>(
    transactions: T[]
  ): Promise<T[]> {
    try {
      for (const tx of transactions) {
        tx.partialSign(this._underlyingWallet);
      }
      return transactions;
    } catch (error: any) {
      this.emit("error", new WalletSignTransactionError(error?.message, error));
      throw error;
    }
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this._wallet || !this._publicKey) {
      throw new Error("Please connect app before sign transaction!");
    }
    try {
      return await this._wallet.signMessage(message, this._publicKey);
    } catch (error: any) {
      this.emit("error", new WalletSignMessageError(error?.message, error));
      throw error;
    }
  }

  private _accountChanged = (newPublicKeyStr?: string) => {
    if (!newPublicKeyStr) return;

    const publicKey = this._publicKey;
    if (!publicKey) return;

    let newPublicKey;
    try {
      newPublicKey = new PublicKey(newPublicKeyStr);
    } catch (error: any) {
      this.emit("error", new WalletPublicKeyError(error?.message, error));
      return;
    }

    if (!newPublicKey || publicKey.equals(newPublicKey)) return;

    this._publicKey = newPublicKey;
    this.emit("connect", newPublicKey);
  };
}
