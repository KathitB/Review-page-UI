import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => {
      const initialState = {
        sessionExpired: false,
        isLoading: false,
        user: null,
        token: null,
        count: 0,
        isLogin: false,
        tabSelected: "Dashboard",
        feedbackUser: null,
        selectedClient: null,
      };
      return {
        ...initialState,
        reset: () => set(() => ({ ...initialState })),
        setSessionExpired: (val) => set(() => ({ sessionExpired: val })),
        setIsLoading: (val) => set(() => ({ isLoading: val })),
        setUser: (val) => set(() => ({ user: val })),
        setToken: (val) => set(() => ({ token: val })),
        setCount: (val) => set(() => ({ count: val })),
        setIsLogin: (val) => set(() => ({ isLogin: val })),
        setTabSelected: (val) => set(() => ({ tabSelected: val })),
        setFeedbackUser: (val) => set(() => ({ feedbackUser: val })),
        setSelectedClient: (val) => set(() => ({ selectedClient: val })),
      };
    },
    {
      name: "useFeedbackStore",
      getStorage: () => localStorage,

      partialize: (state) => {
        const { isLoading, ...persistedState } = state;
        return persistedState;
      },
    },
  ),
);

export default useStore;
