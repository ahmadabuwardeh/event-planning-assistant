import OpenAI from "openai";
import { AssistantStream } from "openai/lib/AssistantStream";
import { IOpenAIService } from "./IOpenAiService.ts";


export class OpenAIService implements IOpenAIService {
    private openai: OpenAI;
    private readonly apiKey: string

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
        this.apiKey=apiKey
    }

    async createThread(): Promise<string> {
        const thread = await this.openai.beta.threads.create();
        return thread.id;
    }

    async addMessage(threadId: string, message: string): Promise<void> {
        await this.openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message
        });
    }

    async getThreadMessages(threadId: string): Promise<any> {
        const threadMessages = await this.openai.beta.threads.messages.list(threadId);

        return threadMessages.data;
    }

    streamThreadMessages(threadId: string, assistantId: string, socket: any): AssistantStream {
        const run = this.openai.beta.threads.runs.stream(threadId, {
            assistant_id: assistantId
        })
            .on('textCreated', (text) => socket.emit("textCreated", text))
            .on('textDelta', (textDelta, snapshot) => socket.emit("textDelta", { value:textDelta.value, snapshot }))
            .on('toolCallCreated', (toolCall) => socket.emit("toolCallCreated", toolCall))
            .on('toolCallDelta', (toolCallDelta, snapshot) => {
                if (toolCallDelta.type === 'code_interpreter') {
                    if (toolCallDelta?.code_interpreter?.input) {
                        socket.emit("codeInterpreterInput", toolCallDelta.code_interpreter.input);
                    }
                    if (toolCallDelta?.code_interpreter?.outputs) {
                        socket.emit("codeInterpreterOutputs", toolCallDelta.code_interpreter.outputs);
                    }
                }
            });

        return run;
    }
}
