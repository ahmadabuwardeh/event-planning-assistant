export interface IOpenAIService {
    getThreadMessages(threadId: string): Promise<any>;
    addMessage(threadId: string, message: string): Promise<any>;
    createThread(): Promise<any>;
    streamThreadMessages(threadId: string, assistantId: string | undefined, socket: any): void;
}
