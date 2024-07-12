import { IHandler } from "../../langchain/handlers/IHandler.ts";
import { IOpenAIService } from "../IOpenAiService.ts";


export class StreamThreadMessagesHandler implements IHandler {
    private openAIService: IOpenAIService;

    constructor(openAIService: IOpenAIService) {
        this.openAIService = openAIService;
    }

    async handle({ threadId, assistantId, message }: { threadId: string | undefined; assistantId: string; message: string }, socket: any): Promise<void> {
        if (!threadId) {
            threadId = await this.openAIService.createThread();
        }
        await this.openAIService.addMessage(threadId as string, message);
        this.openAIService.streamThreadMessages(threadId as string, assistantId, socket);
    }
}
