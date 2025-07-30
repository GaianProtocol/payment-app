import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum SelectOrder {
  LIMIT = "Limit",
  FUTURES = "Futures",
  MARGIN = "Margin",
}

interface FutureState {
  order: SelectOrder;
  leverage: number;
  inputPrice: number;
  amount: number;
}

interface FutureAction {
  setOrder: (order: SelectOrder) => void;
  setLeverage: (leverage: number | ((prev: number) => number)) => void;
  setInputPrice: (inputPrice: number) => void;
  setAmount: (amount: number) => void;
}

type FutureStore = FutureState & FutureAction;

const initialFuture: FutureState = {
  order: SelectOrder.LIMIT,
  leverage: 0,
  inputPrice: 0,
  amount: 0,
};

const futureStore = create<FutureStore>()(
  immer((set) => ({
    ...initialFuture,
    setOrder: (order: SelectOrder) =>
      set((draft) => {
        draft.order = order;
      }),
    setLeverage: (leverage) =>
      set((draft) => {
        if (typeof leverage === "function") {
          draft.leverage = leverage(draft.leverage);
        } else {
          draft.leverage = leverage;
        }
      }),
    setInputPrice: (inputPrice: number) =>
      set((draft) => {
        draft.inputPrice = inputPrice;
      }),
    setAmount: (amount: number) =>
      set((draft) => {
        draft.amount = amount;
      }),
  }))
);

export const useOrderFuture = () => futureStore((state) => state.order);
export const useLeverageFuture = () => futureStore((state) => state.leverage);
export const useAmountFuture = () => futureStore((state) => state.amount);
export const useInputPriceFuture = () =>
  futureStore((state) => state.inputPrice);

export const useSetOrderFuture = () => futureStore((state) => state.setOrder);
export const useSetLeverageFuture = () =>
  futureStore((state) => state.setLeverage);
export const useSetAmountFuture = () => futureStore((state) => state.setAmount);
export const useSetInputPriceFuture = () =>
  futureStore((state) => state.setInputPrice);
