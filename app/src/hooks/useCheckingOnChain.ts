import { AnchorProvider } from "@project-serum/anchor";
import {
  Context,
  KYC_PROGRAM_ID_MAINNET,
  KYC_PROGRAM_ID_TESTNET,
  ProviderClient
} from "@renec-foundation/kyc-sdk";
import { useDemonAdapter } from "@renec-foundation/wallet-adapter-react";
import { Commitment, PublicKey } from "@solana/web3.js";
import { IS_MAINNET } from "../constants/index";
import { bytes32ToString, isArray32 } from '../utils/helpers';

const useCheckingOnChain = () => {
  const {
    walletContext: wallet,
    anchorWallet,
    connectionContext: { connection },
  } = useDemonAdapter();

  const fetchKycData = async () => {
    try {
      if (wallet && wallet.publicKey && anchorWallet) {
        const commitment: Commitment = "confirmed";
        const provider = new AnchorProvider(connection, anchorWallet, {
          commitment,
        });

        const nameHashRound = 10000;
        const documentIdHashRound = 1000000;
        const dobHashRound = 10000;
        const doeHashRound = 10000;
        const genderHashRound = 1000;

        const ctx = Context.withProvider(
          provider,
          new PublicKey(
            IS_MAINNET ? KYC_PROGRAM_ID_MAINNET : KYC_PROGRAM_ID_TESTNET
          )
        );

        const kycClient = await ProviderClient.getClient(
          ctx,
          nameHashRound,
          documentIdHashRound,
          dobHashRound,
          doeHashRound,
          genderHashRound
        );

        console.log("Get user KYC Data");
        const userKycData = await kycClient.getCurrentUserKyc(wallet.publicKey);
        console.log("userKycData", userKycData);

        if (userKycData) {
          const convertedData = {} as any
          Object.keys(userKycData).map((key) => {
            if (isArray32((userKycData as any)[key])) {
              convertedData[key] = bytes32ToString((userKycData as any)[key])
            } else {
              convertedData[key] = (userKycData as any)[key]
            }
          })

          return {
            isSucceeded: true,
            userKycData: convertedData,
          };
        }

        return {
          isSucceeded: false,
          error: "KYC Data is not found",
        };
      }
      throw new Error("Wallet not found");
    } catch (err: any) {
      console.error(err);
      return {
        error: err.message,
        isSucceeded: false,
      };
    }
  };

  const checkKYC = async () => {
    try {
      if (wallet && wallet.publicKey && anchorWallet) {
        const commitment: Commitment = "confirmed";
        const provider = new AnchorProvider(connection, anchorWallet, {
          commitment,
        });

        const nameHashRound = 10000;
        const documentIdHashRound = 1000000;
        const dobHashRound = 10000;
        const doeHashRound = 10000;
        const genderHashRound = 1000;

        const ctx = Context.withProvider(
          provider,
          new PublicKey(
            IS_MAINNET ? KYC_PROGRAM_ID_MAINNET : KYC_PROGRAM_ID_TESTNET
          )
        );

        const kycClient = await ProviderClient.getClient(
          ctx,
          nameHashRound,
          documentIdHashRound,
          dobHashRound,
          doeHashRound,
          genderHashRound
        );

        const userKycData = await kycClient.isKyc(wallet.publicKey);

        return {
          isSucceeded: true,
          userKycData,
        };
      }
      throw new Error("Wallet not found");
    } catch (err: any) {
      console.error(err);
      return {
        error: err.message,
        isSucceeded: false,
      };
    }
  };

  return {
    fetchKycData,
    checkKYC,
  };
};

export default useCheckingOnChain;
