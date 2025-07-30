import { ChainId, Token } from "@uniswap/sdk-core";
export const ACCESS_TOKEN = "access_token";
export const ACCESS_TOKENS = "access_tokens";

export const HEADER_HEIGHT = 120;

export const FOOTER_HEIGHT = 48;

export const NETWORK = import.meta.env.VITE_NETWORK;
export const SOL_RPC = import.meta.env.VITE_SOL_RPC;
export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
export const V3_SWAP_ROUTER_ADDRESS =
  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
export const USDC_SOL_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
// Currencies and Tokens

export const USDC_TOKEN = new Token(
  ChainId.MAINNET,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  6,
  "USDC",
  "USD//C"
);

// export const EYTSOL_TOKEN = new Token(
//   SUPPORTED_CHAINS[0],
//   "0x0000000000000000000000000000000000000000",
//   18,
//   "EYTSOL",
//   "EYTSOL Stablecoin"
// );
export const EYTSOL_TOKEN = new Token(
  ChainId.MAINNET,
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  18,
  "DAI",
  "Dai Stablecoin"
);

// Transactions

export const MAX_FEE_PER_GAS = "100000000000";
export const MAX_PRIORITY_FEE_PER_GAS = "100000000000";
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000000000000;

// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function allowance(address owner, address spender) view returns (uint256)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export const NONFUNGIBLE_POSITION_MANAGER_ABI = [
  // Read-Only Functions
  "function balanceOf(address _owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string memory)",

  "function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
];

export enum USER_ITEM_TYPE {
  VOUCHER_20 = "voucher-20",
  VOUCHER_50 = "voucher-50",
  VOUCHER_100 = "voucher-100",
}

export const VERSION_APP = "0.0.4";

export const PAYMENT_STATUS = {
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUND: "REFUND",
  REFUNDED: "REFUNDED"
};

export const CONTRY_CODE = {
  VietName: "VN",
  Philippines: "PH",
  Thailand: "THAI",
  Indonesia: "IND"
}

export const CurrencyByCode = {
  [CONTRY_CODE.VietName]: "VND",
  [CONTRY_CODE.Philippines]: "PHP",
  [CONTRY_CODE.Thailand]: "THB",
  [CONTRY_CODE.Indonesia]: "IDR"
}