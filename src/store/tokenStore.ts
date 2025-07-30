import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TokenState {
  pt: string;
  yt: string;
  mpt: string;
  myt: string;
  msol: string;
  usdc: string;
  usdt: string;
  usds: string;
  pyusd: string;
  usdstar: string;
  priceSol: number;
}

interface TokenInput {
  pt: string;
  yt: string;
  mpt: string;
  myt: string;
}

interface FutureAction {
  setTokenAddress: (data: TokenInput) => void;
  setPriceSol: (price: number) => void;
}

type FutureStore = TokenState & FutureAction;

const initialToken: TokenState = {
  pt: "",
  yt: "",
  mpt: "",
  myt: "",
  msol: "2a8vktojrrgqwqyczgvmp6jdd2gqzqurpzlhvncau4qd",
  usdc: "epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v",
  usdt: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  usds: "usdswr9apdhk5bvjkmjzff41ffux8bxdkcr81vtwca",
  pyusd: "2b1kv6dkpanxd5ixfnxcpjxmkwqjjaymczfhfu24gxo",
  usdstar: "BenJy1n3WTx9mTjEvy63e8Q1j4RqUc6E4VBMz3ir4Wo6",
  priceSol: 0,
};

const futureStore = create<FutureStore>()(
  immer((set) => ({
    ...initialToken,
    setTokenAddress: (data) =>
      set((draft) => {
        draft.mpt = data.mpt;
        draft.myt = data.myt;
        draft.pt = data.pt;
        draft.yt = data.yt;
      }),
    setPriceSol: (price) =>
      set((draft) => {
        draft.priceSol = price;
      }),
  }))
);

export const useTokenSuffix = () => futureStore((state) => state);

export const useSetTokenSuffix = () =>
  futureStore((state) => state.setTokenAddress);

export const usePriceSol = () => futureStore((state) => state.priceSol);
export const useSetPriceSol = () => futureStore((state) => state.setPriceSol);
