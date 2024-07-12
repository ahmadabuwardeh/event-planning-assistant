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

export interface ClientToServerEvents {
    start_stream: (data: { message: string, threadId?: string }) => void;
    get_thread_messages: (threadId:string) => any;
}

export interface ServerToClientEvents {
    stream_data: (response: any) => void;
    stream_end: () => void;
    error: (error: string) => void;
}
