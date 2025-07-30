import { EYTSOL_TOKEN, USDC_TOKEN } from "@/utils/constant";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { isEmpty } from "lodash";

interface IENVS {
  VITE_IS_MAINNET: boolean;
  VITE_VERSION: string;
  FAST_REFRESH: boolean;
  VITE_BASE_API: string;
}

const defaultEnvs: IENVS = {
  VITE_IS_MAINNET: false,
  VITE_VERSION: "1.0",
  FAST_REFRESH: true,
  VITE_BASE_API: "https://dev-api.zentura.io/",
};

export const getEnvs = () => {
  let envs: any = {};
  try {
    const PROCCESS_ENV = import.meta.env;
    if (!isEmpty(PROCCESS_ENV)) {
      Object.keys(PROCCESS_ENV).forEach((key: string) => {
        const value = PROCCESS_ENV[key];
        if (value === "true" || value === "false") {
          envs[key] = value === "true";
        } else {
          envs[key] = PROCCESS_ENV[key];
        }
        return key;
      });
    }
  } catch (error) {
    console.debug(error);
  } finally {
    envs = isEmpty(envs) ? defaultEnvs : envs;
  }
  return { ...envs, VITE_DOMAIN_URL: window.location.origin };
  return defaultEnvs;
};

export const ENVS: IENVS = getEnvs();

export const isMainnet: boolean = ENVS.VITE_IS_MAINNET;
// export const appDomain: string = ENVS.VITE_DOMAIN_URL;

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  WALLET_EXTENSION,
  MAINNET,
}

// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment;
  rpc: {
    local: string;
    mainnet: string;
  };
  wallet: {
    address: string;
    privateKey: string;
  };
  tokens: {
    token0: Token;
    token0Amount: number;
    token1: Token;
    token1Amount: number;
    poolFee: FeeAmount;
    token0AmountToAdd: number;
    token1AmountToAdd: number;
  };
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
  env: Environment.LOCAL,
  rpc: {
    local: "http://localhost:8545",
    mainnet: "",
  },
  wallet: {
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    privateKey:
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },
  tokens: {
    token0: USDC_TOKEN,
    token0Amount: 0.0015,
    token1: EYTSOL_TOKEN,
    token1Amount: 0.0015,
    poolFee: FeeAmount.LOW,
    token0AmountToAdd: 0.0015,
    token1AmountToAdd: 0,
  },
};
