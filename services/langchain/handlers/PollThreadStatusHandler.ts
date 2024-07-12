import {BaseHandler} from './BaseHandler.ts';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';

export class PollThreadStatusHandler extends BaseHandler {
    async handle({ threadId }: { threadId: string }, socket: any) {
        try {
            const agent = new OpenAIAssistantRunnable({
                assistantId: process.env.ASSISTANT_ID || "",
            });

            const response = await agent.invoke({
                method: "get",
                content: `Poll status for thread ID: ${threadId}`,
            });

            // Simulate streaming by sending partial data
            socket.emit("stream_data", response);
        } catch (error) {
            console.error('Error polling thread status:', error);
            throw error;
        }
    }
}