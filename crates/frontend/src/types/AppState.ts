import { Message } from "./Message";

export type ChatStatus = "error" | "loading" | "unauthorized" | null;

export interface AppState {

    messages: Message[];
    setMessages: (messages: Message[]) => void;

    isSmallScreen: boolean;
    setIsSmallScreen: (isSmallScreen: boolean) => void;

    chatStatus: ChatStatus;
    setChatStatus: (chatStatus: ChatStatus) => void;

    accountNumber: string;
    setAccountNumber: (accountNumber: string) => void;

    saveStore: () => void;
    reload: () => void;
}