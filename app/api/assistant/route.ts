import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/services/openai/OpenAiService';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');

    if (!threadId) {
        return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    try {
        const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || "");
        let messages = await openAIService.getThreadMessages(threadId);
        messages = messages.reverse()

        const formattedMessages = messages.map((msg: any) => {
            let content = msg.content;
            if (msg.text && typeof msg.text === 'object' && msg.text.value) {
                content = msg.text.value;
            } else if (typeof msg.content === 'object') {
                content = JSON.stringify(msg.content);
            }
            return {
                ...msg,
                content,
            };
        });

        return NextResponse.json(formattedMessages, { status: 200 });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        return NextResponse.json({ error: 'Failed to retrieve messages' }, { status: 500 });
    }
}
