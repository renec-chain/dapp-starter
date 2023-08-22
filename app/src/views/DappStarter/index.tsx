import * as anchor from "@project-serum/anchor";
import { useDemonAdapter } from "@renec-foundation/wallet-adapter-react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useCheckingOnChain from "hooks/useCheckingOnChain";
import useLocalStorage from "hooks/useLocalStorage";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import { getCounter, increment, initialize } from "./methods";
import { useProgram } from "./useProgram";


export const DappStarterView: FC = ({}) => {
  const [isAirDropped, setIsAirDropped] = useState(false);
  const {
    anchorWallet: wallet,
    connectionContext: { connection },
  } = useDemonAdapter();

  const airdropToWallet = async () => {
    if (wallet) {
      setIsAirDropped(false);
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        1000000000
      );

      console.log("signature: ", signature);
      const tx = await connection.confirmTransaction(signature);
      console.log(tx);
      setIsAirDropped(true);
    }
  };

  return (
    <div className="container max-w-6xl p-8 mx-auto 2xl:px-0">
      <div className={styles.container}>
        <div className="flex mb-16">
          <div className="mr-4">Need some RENEC on test wallet?</div>
          <div className="mr-4">
            <button
              className="normal-case btn btn-primary btn-xs"
              onClick={airdropToWallet}
            >
              Airdrop 1 RENEC
            </button>
          </div>
          {isAirDropped ? <div className="opacity-50">Sent!</div> : null}
        </div>

        <h1 className="pb-8 mb-5 text-5xl">Counter</h1>

        <div>
          {!wallet ? (
            <h1> Please connect wallet to view the counter screen</h1>
          ) : (
            <DappStarterScreen />
          )}
        </div>
      </div>
    </div>
  );
};

const DappStarterScreen = () => {
  const {
    anchorWallet: wallet,
    connectionContext: { connection },
  } = useDemonAdapter();
  const { program } = useProgram({ connection, wallet });
  const [counter, setCounter] = useState<anchor.BN>();
  const [configPubkey, setConfigPubkey] =
    useLocalStorage<anchor.web3.PublicKey | null>("configPubkey", null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number>();
  const [helperKycMessage, setHelperKycMessage] = useState({
    message: "",
    color: "text-red-500",
  });
  const { fetchKycData, checkKYC } = useCheckingOnChain();

  useEffect(() => {
    fetchCounter();
  }, [wallet, lastUpdatedTime]);

  const fetchCounter = async () => {
    if (!program) {
      return "program undefined";
    }
    if (!configPubkey) {
      return "config pubkey undefined";
    }
    let counter = await getCounter(program, configPubkey);
    setCounter(counter);
  };

  const handleIncrement = async () => {
    try {
      let tx = await increment(program!, configPubkey!);
      console.log("tx: ", tx);

      // Update the counter after increment
      await fetchCounter();
    } catch (error) {
      console.error("Error fail to increment counter:", error);
    }
  };

  const handleClickInitialize = async () => {
    try {
      let configAddr = await initialize(program!);
      setConfigPubkey(configAddr);
      setCounter(new anchor.BN(0));
    } catch (error) {
      console.error("Error fail to initialize counter:", error);
    }
  };

  const handleFetchKycData = async () => {
    const result = await fetchKycData();
    if (!result.isSucceeded || result.error) {
      setHelperKycMessage({
        message: result.error,
        color: "text-red-500",
      });
      return
    }

    setHelperKycMessage({
      message: `Your hashed KYC Data: ${JSON.stringify(result.userKycData, null, 4)}`,
      color: "text-green-500",
    });
  };

  const handleCheckKyc = async () => {
    const result = await checkKYC();
    if (!result.isSucceeded || result.error) {
      setHelperKycMessage({
        message: result.error,
        color: "text-red-500",
      });
      return
    }

    setHelperKycMessage({
      message: `Your check KYC response: ${JSON.stringify(result.userKycData, null, 4)}`,
      color: "text-green-500",
    });
  };

  return (
    <div className="container max-w-6xl p-8 mx-auto 2xl:px-0">
      <div className="flex flex-col items-start">
        <div className="flex items-center initialize">
          <div className="mr-2">Counter Config:</div>

          {configPubkey ? (
            <div>{configPubkey.toString()}</div>
          ) : (
            <button
              className="normal-case btn btn-primary btn-xs"
              onClick={handleClickInitialize}
            >
              Initialize Config
            </button>
          )}
        </div>

        <div className="value">
          {counter !== undefined && (
            <p className="mb-4 text-xl counter">
              Counter: {counter.toNumber()}
            </p>
          )}
        </div>
        <div className="flex items-center increment">
          <div className="mr-2">Increment counter:</div>
          {configPubkey ? (
            <button
              className="normal-case btn btn-primary btn-xs"
              onClick={handleIncrement}
            >
              Increment
            </button>
          ) : (
            <p>Please initialize the config first.</p>
          )}
        </div>
        {configPubkey && (
          <div>
            {" "}
            <button
              className="normal-case btn btn-primary btn-xs"
              onClick={handleClickInitialize}
            >
              Reset
            </button>
          </div>
        )}
        <h2 className="my-5 text-5xl">Check KYC</h2>
        <div className="flex items-center gap-2 mb-1">
          <button
            className="normal-case btn btn-primary btn-xs"
            onClick={handleFetchKycData}
          >
            Get KYC Data
          </button>
          <button
            className="normal-case btn btn-primary btn-xs"
            onClick={handleCheckKyc}
          >
            Check KYC
          </button>
        </div>
        <p className="mb-2 text-xs italic text-gray-500">*You may contact {' '}
          <Link className="font-bold underline" href={`mailto:product@renec.foundation?subject=${encodeURIComponent("Request to become provider of RENECID")}&body=${encodeURIComponent("I want to request to become provider of RENECID")}`}>
          product@renec.foundation
          </Link> {' '} to request to become a new provider of RENECID.
        </p>
        {helperKycMessage.message && (
          <p className={`text-sm italic break-words ${helperKycMessage.color}`}>
            {helperKycMessage.message}
          </p>
        )}
      </div>
    </div>
  );
};
