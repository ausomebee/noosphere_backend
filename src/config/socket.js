import { Server } from "socket.io";
import prismaService from "./prisma.js";
import MessageRepository from "../features/messaging/infrastructure/messageRepository.js";
import MessageService from "../features/messaging/application/messageService.js";
import NotificationsRepository from "../features/notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../features/notifications/application/notificationsService.js";
import Message from "../features/messaging/domain/message.js";
import NotificationProcessor from "../utilities/notificationProcessor.js";
import emailService from "../utilities/ses.js";

class SocketService {
    constructor() {
        this.io = null;
        this.prisma = prismaService.getClient();
        this.messageRepository = new MessageRepository(this.prisma.message);
        this.messageService = new MessageService({ messageRepository: this.messageRepository });
        this.notificationRepository = new NotificationsRepository(this.prisma.notification);
        this.notificationService = new NotificationService({ notificationRepository: this.notificationRepository });
    }

    init(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
            },
        });

        this.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("register", ({ userId, userType }) => {
                const room = `${userType}_${userId}`;
                socket.join(room);
                console.log(`User joined room: ${room}`);
            });

            socket.on("chatMessage", async (data, callback) => {
                try {
                    const { receiverId, receiverType } = data;

                    const messageData = new Message(data);
                    const newRecord = await this.messageService.createMessage(messageData.createMessage);

                    if (!newRecord) {
                        return callback?.({
                            success: false,
                            error: "Failed to create message",
                        });
                    }

                    const receiverRoom = `${receiverType}_${receiverId}`;
                    this.io.to(receiverRoom).emit("chatMessage", newRecord);

                    if (callback) callback({ success: true, message: newRecord });

                } catch (error) {
                    console.error("Chat error:", error);
                    if (callback) callback({ success: false });
                }
            });

            // socket.on("sendNotification", async (data, callback) => {
            //     try {
            //         const { userId, userType } = data;

            //         const notificationData = new Notification(data);
            //         const newRecord = await this.notificationService.createNotification(notificationData.createNotification);

            //         if (!newRecord) {
            //             return res.status(500).json({ message: "Failed to create notification" });
            //         }

            //         const userRoom = `${userType}_${userId}`;
            //         this.io.to(userRoom).emit("newNotification", { notification: newRecord });

            //         callback?.({ success: true });
            //     } catch (error) {
            //         console.error("Notification error:", error);
            //         callback?.({
            //             success: false,
            //             error: "Internal server error",
            //         });
            //     }
            // });

            socket.on("sendNotification", async (data, callback) => {
                try {
                    const notificationProcessor = new NotificationProcessor({
                        notificationService: this.notificationService,
                        emailService: emailService,
                        io: this.io
                    });
                    await notificationProcessor.process(data);

                    callback?.({ success: true });
                } catch (error) {
                    console.error("Notification error:", error);
                    callback?.({
                        success: false,
                        error: "Internal server error"
                    });
                }
            });

            socket.on("disconnect", (reason) => {
                console.log(`User disconnected: ${socket.id} - Reason: ${reason}`);
            });
        });
    }

    emitToUser(userId, userType, event, payload) {
        if (!this.io) throw new Error("Socket.IO not initialized");

        const room = `${userType}_${userId}`;
        const legacyStaffRoom = userType === "TENANT_STAFF" ? `STAFF_${userId}` : null;

        this.io.to(room).emit(event, payload);

        if (legacyStaffRoom) {
            this.io.to(legacyStaffRoom).emit(event, payload);
        }
    }

    getIO() {
        if (!this.io) throw new Error("Socket.IO not initialized");
        return this.io;
    }
}

export default new SocketService();