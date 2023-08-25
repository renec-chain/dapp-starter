import { Token, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { GetProgramAccountsFilter, PublicKey, Transaction } from "@solana/web3.js";
import { generateAssociatedTokenAccountAddress } from "utils/helpers";
import { DemonWalletAdapter } from "wallet/adapter";

interface MintData {
  mintAccountAddress: string;
  amount: number;
  decimals: number;
}

const useDemonWallet = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const mintToken = async ({
    mintAccountAddress,
    amount,
    decimals,
  }: MintData) => {
    if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
      return {
        mintSucceeded: false,
        error: "Need connect wallet first",
      };
    }

    try {
      const mintAddress = new PublicKey(mintAccountAddress);
      const userProgramAddressSync =
        await generateAssociatedTokenAccountAddress(
          mintAddress,
          wallet.publicKey
        );

      const transaction = new Transaction();

      const amountSupply = new u64(`${amount * Math.pow(10, decimals)}`);
      transaction.add(
        Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          mintAddress,
          userProgramAddressSync,
          wallet.publicKey,
          [],
          amountSupply
        )
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      const signature = await (
        wallet.wallet?.adapter as DemonWalletAdapter
      ).sendTransactionWithSigners(transaction, connection, []);

      return {
        mintSucceeded: true,
        tx: signature,
      };
    } catch (error) {
      console.error(error);
      return { mintSucceeded: false, error };
    }
  };

  const getTokenAccountData = async (
    tokenAddress: string
  ) => {
    try {
      if (wallet && wallet.publicKey) {
        
        const filters: GetProgramAccountsFilter[] = [
          {
            dataSize: 165, //size of account (bytes)
          },
          {
            memcmp: {
              offset: 32, //location of our query in the account (bytes)
              bytes: wallet.publicKey.toBase58(), //our search criteria, a base58 encoded string
            },
          },
          {
            memcmp: {
              offset: 0, //number of bytes
              bytes: tokenAddress, //base58 encoded string
            },
          },
        ];

        const accounts = await connection.getParsedProgramAccounts(
          TOKEN_PROGRAM_ID,
          { filters: filters }
        );

        if (accounts.length > 0) {
          const parsedAccountInfo: any = accounts[0].account.data;
          const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
          const tokenBalance: number =
            parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
          const tokenDecimals: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];

          return {
            isSucceeded: true,
            accountData: parsedAccountInfo,
            mintAddress: mintAddress,
            tokenBalance: tokenBalance,
            tokenDecimals: tokenDecimals,
          };
        }
      }
      throw new Error("Account not found");
    } catch (error: any) {
      console.error(error);
      return {
        isSucceeded: false,
        error: error.message 
      };
    }
  };


  return {
    mintToken,
    getTokenAccountData,
  };
};

export default useDemonWallet;
