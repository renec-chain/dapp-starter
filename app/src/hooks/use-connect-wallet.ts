import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { DemonWalletName } from "../wallet/adapter";
import type { DemonWindow } from "../wallet/adapter";

declare const window: DemonWindow;

export const useConnectWallet = () => {
  const { connect, select } = useWallet();

  const connectWallet = useCallback(() => {
    if (!window?.demon?.sol) {
      return window.open(
        `https://renec.foundation/en/support/how-to-create-a-new-demon-wallet`,
        "_blank"
      );
    }
    select(DemonWalletName);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    connect().catch(() => {});
  }, [connect, select]);

  return connectWallet;
};
