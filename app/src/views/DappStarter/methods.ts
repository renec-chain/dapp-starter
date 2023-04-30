import * as anchor from "@project-serum/anchor";
import { DappStarter } from "artifacts/dapp_starter";

export const getCounter = async (
  program: anchor.Program<DappStarter>,
  counterAddr: anchor.web3.PublicKey
) => {
  const accountData = await program.account.counter.fetch(counterAddr);
  return accountData.count;
};

export const initialize = async (
  program: anchor.Program<DappStarter>
): Promise<anchor.web3.PublicKey> => {
  let config = new anchor.web3.Keypair();

  let tx = await program.rpc.initialize({
    accounts: {
      config: config.publicKey,
      deployer: program.provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [config],
  });
  return config.publicKey;
};

export const increment = async (
  program: anchor.Program<DappStarter>,
  configPubkey: anchor.web3.PublicKey
) => {
  let tx = await program.rpc.increment({
    accounts: {
      config: configPubkey,
      user: program.provider.wallet.publicKey,
    },
    signers: [],
  });

  return tx;
};
