export enum TYPE_SWAP {
  SWAP = "swap",
  LIMIT = "limit",
  MINT = "mint",
  BRIDGE = "bridge",
}

export enum E_TYPE_ACTION_SWAP {
  BUY = "buy",
  SELL = "sell",
}

export enum E_TYPE_ACTION_MINT {
  MINT = "mint",
  REDEEM = "redeem",
}

export enum E_TYPE_ACTION_LIMIT { }

export const TYPE_ACTION_LIMIT = {};

export const TYPE_ACTION_SWAP = {
  [E_TYPE_ACTION_SWAP.BUY]: "Buy YT",
  [E_TYPE_ACTION_SWAP.SELL]: "Sell YT",
};

export const TYPE_ACTION_MINT = {
  [E_TYPE_ACTION_MINT.MINT]: "Mint",
  [E_TYPE_ACTION_MINT.REDEEM]: "Redeem",
};

export const TYPE = {
  [TYPE_SWAP.SWAP]: "Swap",
  [TYPE_SWAP.LIMIT]: "Limit",
  [TYPE_SWAP.MINT]: "Mint",
  [TYPE_SWAP.BRIDGE]: "Bridge",
};

export type ITokenOption = {
  name: string;
  symbol: string;
  logoURI: string;
  balance?: number;
  decimals?: number;
  address?: string;
};
