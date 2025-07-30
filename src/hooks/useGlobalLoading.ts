import globalLoadingStore from "@/store/globalLoadingStore";

export const useSetGlobalLoading = () =>
  globalLoadingStore((state) => state.setGlobalLoading);

export const useGlobalLoading = () =>
  globalLoadingStore((state) => state.isLoading);
