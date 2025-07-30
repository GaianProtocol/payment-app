import { create } from "zustand";

export interface IGlobalLoading {
  isLoading: boolean;
}

export type IGlobalLoadingState = IGlobalLoading & {
  setGlobalLoading: (loading: boolean) => void;
};

const globalLoadingStore = create<IGlobalLoadingState>((set) => ({
  isLoading: false,
  setGlobalLoading: (loading: boolean) =>
    set({
      isLoading: loading,
    }),
}));

export default globalLoadingStore;
