export const MAINNET_URL = "https://api-mainnet-beta.renec.foundation:8899";
export const TESTNET_URL = "https://api-testnet.renec.foundation:8899";
export const EXPLORER_URL = "https://explorer.renec.foundation";
export const RENEC_DOCS_URL = "https://docs.renec.foundation";

export const getRpcEndpointUrl = () =>
  process.env.NEXT_PUBLIC_IS_MAINNET === "true" ? MAINNET_URL : TESTNET_URL;

export const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export const A_HUNDRED_PERCENT = 10000;
export const TICK_SPACING = 32;
export const SLIPPAGE = 1;
