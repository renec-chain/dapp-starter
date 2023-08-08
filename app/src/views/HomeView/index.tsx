import { FC } from "react";

import { useDemonAdapter } from "@renec-foundation/wallet-adapter-react";
import { DappStarterView } from "views";
import styles from "./index.module.css";

export const HomeView: FC = ({}) => {
  const {
    walletContext: { publicKey },
  } = useDemonAdapter();

  const onClick = () => {};

  return (
    <div className="container max-w-6xl p-8 mx-auto 2xl:px-0">
      <div className={styles.container}>
        <div className="pt-2 text-center">
          <div className="py-4 hero min-h-16">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl font-bold">Hello Renec World!</h1>
                <p className="mb-5">
                  This scaffold includes awesome tools for rapid development and
                  deploy dapps to Renec: Next.JS, TypeScript, TailwindCSS, Daisy
                  UI.
                </p>
                <p className="mb-5">
                  Daemon wallet adapter is connected and ready to use.
                </p>
                <p>
                  {publicKey ? <>Your address: {publicKey.toBase58()}</> : null}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <ul className="leading-10 text-left">
              <DappStarterView />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
