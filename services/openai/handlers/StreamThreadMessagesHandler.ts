import { IHandler } from "../../langchain/handlers/IHandler.ts";
import { IOpenAIService } from "../IOpenAiService.ts";
import { PrismaClient } from "@prisma/client";
import { LangChainService } from "../../langchain/LangChainService.ts";

const prisma = new PrismaClient();

export class StreamThreadMessagesHandler implements IHandler {
    private openAIService: IOpenAIService;
    private langChainService: LangChainService;

    constructor(openAIService: IOpenAIService, langChainService: LangChainService) {
        this.openAIService = openAIService;
        this.langChainService = langChainService;
    }

    async handle({ threadId, assistantId, message, userId }: { threadId: string | undefined; assistantId: string | undefined; message: string; userId: string }, socket: any): Promise<string | null> {
        try {
            if (!threadId) {
                const newThreadId = await this.createThreadAddMessageAndSaveToDatabase(message, userId, socket);
                if (!newThreadId) {
                    throw new Error("Failed to create thread and save to database");
                }
                threadId = newThreadId;
            } else {
                await this.addMessageToThread(threadId, message, socket);
            }

            this.streamThreadMessages(threadId, assistantId, socket);

            this.langChainService.extractKeyWordsFromUserInput(message).catch(error => {
                console.error('Error extracting keywords:', error);
            });

            return threadId;
        } catch (error) {
            console.error('Error in StreamThreadMessagesHandler:', error);
            socket.emit("error", "An error occurred while processing your message.");
            return null;
        }
    }

    private async createThreadAddMessageAndSaveToDatabase(message: string | null | undefined, userId: string, socket: any): Promise<string | undefined> {
        try {
            if (!message) {
                throw new Error('Message content is null or undefined');
            }

            const threadId = await this.openAIService.createThread();
            await this.addMessageToThread(threadId, message, socket);

            const truncatedMessage = message?.length > 10 ? message.substring(0, 10) : message;

            await prisma.thread.create({
                data: {
                    id: threadId,
                    content: truncatedMessage,
                    userId: userId,
                },
            });

            return threadId;
        } catch (error) {
            console.error('Error creating thread or saving to database:', error);
            socket.emit("error", "An error occurred while creating the thread.");
            return undefined;
        }
    }


    private async addMessageToThread(threadId: string, message: string, socket: any): Promise<void> {
        try {
            await this.openAIService.addMessage(threadId, message);
        } catch (error) {
            console.error('Error adding message to thread:', error);
            socket.emit("error", "An error occurred while adding the message to the thread.");
            throw error;
        }
    }

    private streamThreadMessages(threadId: string, assistantId: string | undefined, socket: any): void {
        try {
            this.openAIService.streamThreadMessages(threadId, assistantId, socket);
        } catch (error) {
            console.error('Error streaming thread messages:', error);
            socket.emit("error", "An error occurred while streaming the thread messages.");
        }
    }
}
