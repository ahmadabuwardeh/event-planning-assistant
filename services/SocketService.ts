import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from "@/types";
import { createLangChainService } from "./langchain/LangChainFactoryService.ts";
import { OpenAIService } from "./openai/OpenAiService.ts";
import { RetrieveThreadMessagesHandler } from "./openai/handlers/RetrieveThreadHandler.ts";
import { StreamThreadMessagesHandler } from "./openai/handlers/StreamThreadMessagesHandler.ts";
import {CreateThreadHandler} from "@/services/openai/handlers/CreateThreadHandler.ts";


export class SocketService {
    protected io: Server<ClientToServerEvents, ServerToClientEvents>;

    constructor(server: any) {
        this.io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
            cors: {
                origin: "*", // adjust the origin as per your requirement
                methods: ["GET", "POST"]
            }
        });

        // Uncomment this block if you need to use authentication
        // this.io.use(async (socket, next) => {
        //     const token = socket.handshake.auth.token;
        //     const { data, error } = await supabase.auth.getUser(token);
        //     if (error || !data.user) {
        //         return next(new Error('Authentication error'));
        //     }
        //     socket.data.user = data.user;
        //     next();
        // });

        this.io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
            console.log("Received a new connection");

            socket.on("start_stream", async (data) => {
                const { message, threadId } = data;

                try {
                    const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || "");
                    const streamThreadMessagesHandler = new StreamThreadMessagesHandler(openAIService);
                    await streamThreadMessagesHandler.handle({ threadId, assistantId:"asst_uImkPjScgX5MpITnAMi63nkK", message}, socket);

                    socket.emit("stream_end");
                } catch (error) {
                    console.error('Error handling assistant message:', error);
                    socket.emit("error", "An error occurred while processing your message.");
                }
            });

            socket.on("get_thread_messages", async (threadId:string) => {
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
