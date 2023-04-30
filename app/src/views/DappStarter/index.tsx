import { FC, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";



import styles from "./index.module.css";
import { initialize, getCounter} from "./methods";
import { useProgram } from "./useProgram";


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
          <div className="mr-4">Need some SOL on test wallet?</div>
          <div className="mr-4">
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={airdropToWallet}
            >
              Airdrop 1 SOL
            </button>
          </div>
          {isAirDropped ? <div className="opacity-50">Sent!</div> : null}
        </div>

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
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number>();

  

  useEffect(() => {
    fetchCounter();
  }, [wallet, lastUpdatedTime]);

  const fetchCounter = async () => {
    // pass 
  };  

  const handleClick = async () => {
    try {
      await initialize(program!);
      console.log('Counter initialized');
    } catch (error) {
      console.error('Error fail to initialize counter:', error);
    }
  };


  return (
    <button onClick={handleClick}>
          pressme
      </button>
    
  );
};
