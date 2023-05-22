import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DappStarter } from "../target/types/dapp_starter";

describe("dapp-starter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.DappStarter as Program<DappStarter>;

  it("Is initialized!", async () => {
    // Add your test here.
    const config = anchor.web3.Keypair.generate();

    const tx = await program.rpc.initialize({
      accounts: {
        config: config.publicKey,
        deployer: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [config],
    });
    console.log("Your transaction signature", tx);
  });
});
