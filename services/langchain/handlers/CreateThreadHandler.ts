import { BaseHandler } from './BaseHandler.ts';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';

export class CreateThreadHandler extends BaseHandler {
    async handle({ message }: { message: string }, socket: any) {
        try {
            const agent = new OpenAIAssistantRunnable({
                assistantId: process.env.ASSISTANT_ID || "",
            });

            const response = await agent.invoke({
                method: "get",
                content: message,
                threadId:'thread_K4AQbY1kohZJ7qyVpHBDNkrU'
            });

            socket.emit("stream_data", response);
        } catch (error) {
            console.error('Error creating thread:', error);
            throw error;
        }
    }
}



