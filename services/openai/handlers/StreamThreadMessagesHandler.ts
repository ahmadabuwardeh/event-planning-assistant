import { IHandler } from "../../langchain/handlers/IHandler.ts";
import { IOpenAIService } from "../IOpenAiService.ts";
import { PrismaClient } from "@prisma/client";
import { ExtractKeywordsHandler } from "../../langchain/handlers/ExtractKeywordsHandler.ts";

const prisma = new PrismaClient();
const extractKeywordsHandler = new ExtractKeywordsHandler();

export class StreamThreadMessagesHandler implements IHandler {
    private openAIService: IOpenAIService;

    constructor(openAIService: IOpenAIService) {
        this.openAIService = openAIService;
    }

    async handle({ threadId, assistantId, message, userId }: { threadId: string | undefined; assistantId: string; message: string; userId: string }, socket: any): Promise<string | null> {
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

            extractKeywordsHandler.handle({ message }).catch(error => {
                console.error('Error extracting keywords:', error);
            });

            return threadId;
        } catch (error) {
            console.error('Error in StreamThreadMessagesHandler:', error);
            socket.emit("error", "An error occurred while processing your message.");
            return null;
        }
    }

    private async createThreadAddMessageAndSaveToDatabase(message: string, userId: string, socket: any): Promise<string | undefined> {
        try {
            const threadId = await this.openAIService.createThread();
            await this.addMessageToThread(threadId, message, socket);
            await prisma.thread.create({
                data: {
                    id: threadId,
                    content: message,
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

    private streamThreadMessages(threadId: string, assistantId: string, socket: any): void {
        try {
            this.openAIService.streamThreadMessages(threadId, assistantId, socket);
        } catch (error) {
            console.error('Error streaming thread messages:', error);
            socket.emit("error", "An error occurred while streaming the thread messages.");
        }
    }
}
