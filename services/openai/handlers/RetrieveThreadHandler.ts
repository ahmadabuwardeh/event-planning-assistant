import { IHandler } from "../../langchain/handlers/IHandler.ts";
import { IOpenAIService } from "../IOpenAiService.ts";

export class RetrieveThreadMessagesHandler implements IHandler {
    private openAIService: IOpenAIService;

    constructor(openAIService: IOpenAIService) {
        this.openAIService = openAIService;
    }

    async handle({ threadId }: { threadId: string }): Promise<any> {
        return this.openAIService.getThreadMessages(threadId);
    }
}
