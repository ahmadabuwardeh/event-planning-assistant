import { FormEvent } from "react";

export interface Message {
    role: string;
    content: string;
}

export interface FormProps {
    close: (e: React.MouseEvent<HTMLButtonElement>) => void;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    handleSendMessage: (e: FormEvent<HTMLFormElement>, callback: () => void) => void;
}

export interface HistoryItem {
    title: string;
    details: string;
}

export interface ChatBubbleProps {
    role: string;
    content: string;
}
