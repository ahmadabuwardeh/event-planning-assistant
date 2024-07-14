import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from "@/types";
import { OpenAIService } from "./openai/OpenAiService.ts";
import { RetrieveThreadMessagesHandler } from "./openai/handlers/RetrieveThreadHandler.ts";
import { StreamThreadMessagesHandler } from "./openai/handlers/StreamThreadMessagesHandler.ts";


export class SocketService {
    protected io: Server<ClientToServerEvents, ServerToClientEvents>;

    constructor(server: any) {
        this.io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
            console.log("Received a new connection");

            socket.on("start_stream", async (data) => {
                const { message, threadId, userId } = data;

                try {
                    const assistantId = process.env.ASSISTANT_ID
                    const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || "");
                    const streamThreadMessagesHandler = new StreamThreadMessagesHandler(openAIService);
                    const newThreadId = await streamThreadMessagesHandler.handle({ threadId, assistantId, message, userId }, socket);

                    if (newThreadId) {
                        socket.emit("thread_created", { threadId: newThreadId });
                    }
                    socket.emit("stream_end");
                } catch (error) {
                    console.error('Error handling assistant message:', error);
                    socket.emit("error", "An error occurred while processing your message.");
                }
            });

            socket.on("get_thread_messages", async (threadId: string) => {
                const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || "");
                const retrieveThreadMessagesHandler = new RetrieveThreadMessagesHandler(openAIService);
                const response = await retrieveThreadMessagesHandler.handle({ threadId });
                socket.emit("stream_data", response);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
    }
}
