import { FormEvent, MouseEvent, Dispatch, SetStateAction } from "react";

export interface Message {
    role: string;
    content: string;
}

export interface FormProps {
    close: (e: MouseEvent<HTMLButtonElement>) => void;
    setMessages: Dispatch<SetStateAction<Message[]>>;
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
    start_stream: (data: { message: string; threadId?: string; userId: string }) => void;
    get_thread_messages: (threadId: string) => void;
}

export interface ServerToClientEvents {
    stream_data: (response: any) => void;
    stream_end: () => void;
    textDelta: (data: { value: string; snapshot: any }) => void;
    textCreated: () => void;
    codeInterpreterInput: (input: string) => void;
    codeInterpreterOutputs: (outputs: any[]) => void;
    toolCallCreated: (toolCall: any) => void;
    error: (error: string) => void;
    thread_created: (data: { threadId: string }) => void;
}

export interface Thread {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
}

export interface HistoryItem {
    id: string;
    title: string;
    details: string;
}

