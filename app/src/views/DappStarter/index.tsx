import { FC, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";

import styles from "./index.module.css";
import { initialize, getCounter, increment} from "./methods";
import { useProgram } from "./useProgram";
import useLocalStorage from "hooks/useLocalStorage";


export const DappStarterView: FC = ({}) => {
  const {connection} = useConnection();
  const [isAirDropped, setIsAirDropped] = useState(false);
  const wallet = useAnchorWallet();

  const airdropToWallet = async () => {
    if (wallet) {
      setIsAirDropped(false);
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        1000000000
      );

      console.log("signature: ", signature)
      const tx = await connection.confirmTransaction(signature);
      console.log(tx)
      setIsAirDropped(true);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
       
        <div className="flex mb-16">
          <div className="mr-4">Need some RENEC on test wallet?</div>
          <div className="mr-4">
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={airdropToWallet}
            >
              Airdrop 1 RENEC
            </button>
          </div>
          {isAirDropped ? <div className="opacity-50">Sent!</div> : null}
        </div>

        <h1 className="mb-5 pb-8 text-5xl">Counter</h1>

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
  const {connection} = useConnection();
  const wallet: any = useAnchorWallet();
  const { program } = useProgram({ connection, wallet });
  const [counter, setCounter] = useState<anchor.BN>();
  const [configPubkey, setConfigPubkey] = useLocalStorage<anchor.web3.PublicKey | null>('configPubkey', null)
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number>();

  useEffect(() => {
    fetchCounter();
  }, [wallet, lastUpdatedTime]);

  const fetchCounter = async () => {
    if (!program){
      return "program undefined"
    }
    if(!configPubkey){
      return "config pubkey undefined"
    }
    let counter = await getCounter(program, configPubkey);
    setCounter(counter)
  };  

  const handleIncrement = async () => {
    try {
      let tx=  await increment(program!, configPubkey!);
      console.log("tx: ", tx);

      // Update the counter after increment
      await fetchCounter();
    } catch (error) {
      console.error('Error fail to increment counter:', error);
    }
  };

  const handleClickInitialize = async () => {
    try {
      let configAddr = await initialize(program!);
      setConfigPubkey(configAddr);
      setCounter(new anchor.BN(0))
    } catch (error) {
      console.error('Error fail to initialize counter:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className="flex flex-col items-start">
        <div className="initialize flex items-center">
          <div className="mr-2">
            Counter Config: 
          </div>

          {configPubkey ? (
          <div>
           {configPubkey.toString()}
          </div>
        ) : (
          <button
            className="btn btn-primary normal-case btn-xs"
            onClick={handleClickInitialize}
          >
            Initialize Config
          </button>
        )}
        </div>

        <div className="value">
          {counter !== undefined && (
            <p className="counter text-xl mb-4">
              Counter: {counter.toNumber()}
            </p>
          )}
        </div>
        <div className="increment flex items-center">
          <div className="mr-2">
            Increment counter: 
          </div>
          {configPubkey ? (
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={handleIncrement}
            >
              Increment
            </button>
          ) : (
            <p>
              Please initialize the config first.
            </p>
          )}
        </div>

        {configPubkey && (
          <div>    <button
          className="btn btn-primary normal-case btn-xs"
          onClick={handleClickInitialize}
        >
          Reset
        </button></div>

         
          )}
        
      </div>
    </div>
  );
  
};
