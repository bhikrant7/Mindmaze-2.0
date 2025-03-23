// lib/store/loadingStore.ts
import { create } from "zustand";

type LoadingState = {
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
};

const useLoadingStore = create<LoadingState>((set) => ({
  isGlobalLoading: false,
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
}));

export default useLoadingStore;
