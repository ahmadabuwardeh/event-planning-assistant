import {BaseHandler} from './BaseHandler.ts';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';

export class AddMessageHandler extends BaseHandler {
    async handle({ threadId, message }: { threadId: string; message: string }, socket: any) {
        try {
            const agent = new OpenAIAssistantRunnable({
                assistantId: process.env.ASSISTANT_ID || "",
            });

            const stream = await agent.stream({
                method: "post",
                content: `Add message to thread ID: ${threadId}. Message: ${message}`,
            });

        } catch (error) {
            console.error('Error adding message to thread:', error);
            throw error;
        }
    }
}

