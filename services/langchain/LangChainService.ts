import { IHandler } from './handlers/IHandler.ts';

export class LangChainService {
    constructor(
        private createThreadHandler: IHandler,
        private addMessageHandler: IHandler,
        private pollThreadStatusHandler: IHandler,
        private extractKeywordsHandler: IHandler,
    ) {}

    async createThread(message: string, socket: any) {
        return this.createThreadHandler.handle({ message }, socket);
    }

    async addMessage(threadId: string, message: string, socket: any) {
        return this.addMessageHandler.handle({ threadId, message }, socket);
    }

    async pollThreadStatus(threadId: string, socket: any) {
        return this.pollThreadStatusHandler.handle({ threadId }, socket);
    }

    async extractKeyWordsFromUserInput(messages: string | null | undefined): Promise<string[]> {
        return this.extractKeywordsHandler.handle({ messages });
    }
}
