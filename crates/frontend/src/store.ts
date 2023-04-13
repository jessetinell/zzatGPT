import { emit } from "@tauri-apps/api/event";
import { Store } from "tauri-plugin-store-api";
import create from "zustand";
import getSavedValues from "./utils/getSavedValues";
import { Message } from "./types/Message";
import { AppState, ChatStatus } from "./types/AppState";

const store = new Store(".settings.dat");
const savedValues = await getSavedValues(store);

export const useStore = create<AppState>()((set) => ({

  messages: [],
  setMessages: (messages: Message[]) => set({ messages }),

  isSmallScreen: true,
  setIsSmallScreen: (isSmallScreen: boolean) => set({ isSmallScreen }),

  chatStatus: null,
  setChatStatus: (chatStatus: ChatStatus) => set({ chatStatus }),

  accountNumber: savedValues.accountNumber,
  setAccountNumber: (accountNumber: string) => {
    store.set("accountNumber", accountNumber);
    store.save();
    set({ accountNumber });
  },

  saveStore: () => {
    store.save();
    emit("reload_store");
  },

  reload: async () => {

    const { accountNumber } = await getSavedValues(store);
    set({ accountNumber: accountNumber });

  },
}));
