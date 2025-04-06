import { Server } from "socket.io";

class SocketService {
    constructor() {
        this.io = null;
    }

    init(server) {
        this.io = new Server(server, {
            cors: { origin: "*" } 
        });

        this.io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);

            socket.on("chatMessage", (msg) => {
                console.log(`Message received: ${msg}`);
                this.io.emit("chatMessage", msg); 
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }

    getIO() {
        if (!this.io) throw new Error("Socket.IO not initialized");
        return this.io;
    }
}

export default new SocketService();