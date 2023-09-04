import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";

import { AnchorProvider, Program } from "@project-serum/anchor";
import config from "artifacts/config.json";
import { DappStarter } from "artifacts/dapp_starter";
import idl from "artifacts/dapp_starter.json";

const programID = new PublicKey(config.programId);

export interface Wallet {
  signTransaction(
    tx: Transaction
  ): Promise<Transaction>;
  signAllTransactions(
    txs: Transaction[]
  ): Promise<Transaction[]>;
  publicKey: PublicKey;
}

type ProgramProps = {
  connection: Connection;
  wallet: Wallet | undefined;
};

export const useProgram = ({ connection, wallet }: ProgramProps) => {
  const [program, setProgram] = useState<Program<DappStarter>>();

  useEffect(() => {
    updateProgram();
  }, [connection, wallet]);

  const updateProgram = () => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "recent",
        commitment: "processed",
      });
      console.log("provider", provider);
  
      //   const idl = await anchor.Program.fetchIdl(programID, provider);
      //   console.log("idl", idl);
  
      const program = new Program(idl as DappStarter, programID, provider);
  
      setProgram(program);
    }
  };

  return {
    program,
  };
};
