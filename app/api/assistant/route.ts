import { NextRequest, NextResponse } from 'next/server';
import { createLangChainService } from "@/services/langchain/LangChainFactoryService";
import {OpenAIService} from "@/services/openai/OpenAiService.ts";

const langChainService = createLangChainService();
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const { type, message, threadId } = await req.json();

        let response;
        switch (type) {
            case 'createThread':
                response = await langChainService.createThread(message, null);
                break;
            case 'retrieveThreadMessages':
                response = await openAIService.getThreadMessages(threadId);
                break;
            case 'addMessage':
                response = await langChainService.addMessage(threadId, message, null);
                break;
            case 'pollThreadStatus':
                response = await langChainService.pollThreadStatus(threadId, null);
                break;
            default:
                return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error handling request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
