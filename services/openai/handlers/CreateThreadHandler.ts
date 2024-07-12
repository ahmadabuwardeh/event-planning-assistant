import { IHandler } from "../../langchain/handlers/IHandler.ts";
import { IOpenAIService } from "../IOpenAiService.ts";


export class CreateThreadHandler implements IHandler {

    private openAIService: IOpenAIService;

    constructor(openAIService: IOpenAIService) {
        this.openAIService = openAIService;
    }

    async handle({ assistantId }: { assistantId: string }): Promise<any> {
        return this.openAIService.createThread();
    }
}
