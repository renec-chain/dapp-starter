/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseMessageSignerWalletAdapter,
  WalletName,
  WalletNotReadyError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import {
  scopePollingDetectionStrategy,
  WalletAccountError,
  WalletDisconnectionError,
  WalletPublicKeyError,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import type { Transaction } from "@solana/web3.js";
import EventEmitter from "eventemitter3";

interface DemonWallet extends EventEmitter {
  isDemon?: boolean;
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

export interface DemonWindow extends Window {
  demon: {
    sol: DemonWallet;
  };
}

declare const window: DemonWindow;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DemonWalletAdapterConfig {}

export const DemonWalletName = "Demon" as WalletName<"Demon">;

export class DemonWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = DemonWalletName;
  url = "https://renec.foundation/";
  icon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOCSURBVHgB7ZpNbxJBGMefmQWKLcb1JYrWROrBa/FqtMFbb9rEe2vixcTEHv0I9UYTP0C9eWhSvfUmxmq8Fe8kYrQptRo3lhYouzPOM3RxoQuBWbYwib+EBma34f+f52VnmSXQBdPMmPRUfQEInQYOGTGUghOB5DnwIuXwxoF6zip9KnY8029QCh9nT4HzRfwIw8UCQrLsgC5bVs5qP3jMgDl5K02ZsQYnNts9U2S2M2ftfsx7B6n3gzk5My/Ev4XRE4+kaMTYNJMz897BZgSOZn4TRh9LROKuGwlpoFGsDopPgR4UWcW4iTUhU0gWrD7ikRSN29hggJjJTIoSOfvD7jb9YokoTFEDnAzoJx6R1yjKCL8HusLpNCV65X4rBDKiiEka9CVFQXO0NxABBaKzJsRmz0K/2Pl9qG/8AVaowqAg5y7f4aDA+LOr0ogKaKSytAWsdAhBUU6hg6XvUogKkfQEnH51A8YWLkJQlFLIpTGDE/K9I9IC06MTNBmVwmky1hyLHxmorfwAVQIZ8OIUKk0hJGHIl1+KYO3EnyTlcQRNOCKSqtEMpQuRBIWJ7FTLbLscrv+G8qMC8LLTHDsl6kmV0NoopkwnE6xUl0XsPRfTS+l7IER42ZYvPxNYL960Ue1ooRnAmthf/CLy/UrHSHgNRNIJUCEUA7zMmuJjYmY7pRMXqeSCdaNCSAacpnjP6NFrsIRiALuKVzy2U4wI88w4QkRk/p1TBxUGZgDTBulVPOJdT2HNqDAQA42L2E6f4hu14WJv7IEKgQ14u02v4rGY8Xzvud2WId0IthYq1KD6Yrsv8bEH58Xy4VJL1/Fe1PolkIHa6s9jaYNgf4+23S9gukRvnznWLnH9pLoOQgIZ8BOP9Hqzg9Grrf6CICgb6CS+F3DGg868i5IBnGFMiX4E4MUNbyXtAEtnP5RvKUeF/z+rDBs0UARN4WIzkIq/70Bb+Ffx6zTLg6ZwDq8pjEVXALcy9UNorueoVRR7r5wvg24IzbgBLrsQi0eyXKNiRq2sGsnie2kAo8CpMweapBJqdXftDXewuvetNJa4tkMI3IfRxWIcHlvbH9bdAd9HDQgz1kZt6wnTRs78VuujBkb7iRiJ+IXrL4nNakDk9lMchgs2mee8Gnlo7b4vth8k3f4T95DFTWOGNHYyU+Sk9tO4bCg5cY36DJXoit9TKi5/AS5nmrBU1kcEAAAAAElFTkSuQmCC";
  readonly supportedTransactionVersions = null;

  private _connecting: boolean;
  private _wallet: DemonWallet | null;
  private _publicKey: PublicKey | null;
  private _readyState: WalletReadyState =
    typeof window === "undefined" || typeof document === "undefined"
      ? WalletReadyState.Unsupported
      : WalletReadyState.NotDetected;

  constructor(config: DemonWalletAdapterConfig = {}) {
    super();
    this._connecting = false;
    this._wallet = null;
    this._publicKey = null;

    if (this._readyState !== WalletReadyState.Unsupported) {
      scopePollingDetectionStrategy(() => {
        if (window.demon?.sol) {
          this._readyState = WalletReadyState.Installed;
          this.emit("readyStateChange", this._readyState);
          return true;
        }
        return false;
      });
    }
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

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const wallet = window.demon!.sol!;

      let account: string;
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        account = await wallet.connect();
      } catch (error: any) {
        console.log(error);
        throw new WalletAccountError(error?.message, error);
      }

      let publicKey: PublicKey;
      try {
        publicKey = new PublicKey(account);
      } catch (error: any) {
        throw new WalletPublicKeyError(error?.message, error);
      }

      wallet.on("accountChanged", this._accountChanged);

      this._wallet = wallet;
      this._publicKey = publicKey;

      this.emit("connect", publicKey);
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

  async signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T> {
    if (!this._wallet || !this._publicKey) {
      throw new Error("Please connect app before sign transaction!");
    }
    try {
      return await this._wallet.signTransaction(transaction, this._publicKey);
    } catch (error: any) {
      this.emit("error", new WalletSignTransactionError(error?.message, error));
      throw error;
    }
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]> {
    if (!this._wallet || !this._publicKey) {
      throw new Error("Please connect app before sign transaction!");
    }
    try {
      return await this._wallet.signAllTransaction(
        transactions,
        this._publicKey
      );
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
