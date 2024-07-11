import { Server } from 'socket.io';

class SocketService {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*", // adjust the origin as per your requirement
                methods: ["GET", "POST"]
            }
        });

        this.io.on("connection", (socket) => {
            console.log("Received a new connection");

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });

            socket.on("message1", (msg) => {
                console.log("Message received:", msg);
                this.io.emit("message1", msg); // Broadcast message to all clients
            });
        });
    }
}

export default SocketService;
