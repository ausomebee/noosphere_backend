import { Server } from "socket.io";
import jwt from "jsonwebtoken";
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

        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth?.token;
                if (!token) throw new Error("Authentication token required");
                const claims = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret");
                if (claims.tokenUse === "two_factor") throw new Error("Two-factor verification is incomplete");
                let identity;
                const ownerType = claims.ownerType || claims.userType;
                if (ownerType === "ADMIN" || (!ownerType && await this.prisma.admin.findUnique({ where: { id: claims.id }, select: { id: true } }))) {
                    const admin = await this.prisma.admin.findFirst({ where: { id: claims.id, active: true, isDeleted: false }, select: { id: true, superAdmin: true } });
                    if (!admin) throw new Error("Account is inactive");
                    identity = { id: admin.id, userType: "ADMIN", isSuperAdmin: admin.superAdmin };
                } else if (ownerType === "STAFF" || (!ownerType && await this.prisma.tenantStaff.findUnique({ where: { id: claims.id }, select: { id: true } }))) {
                    const staff = await this.prisma.tenantStaff.findFirst({ where: { id: claims.id, active: true, isDeleted: false, tenant: { active: true, isDeleted: false } }, select: { id: true, tenantId: true } });
                    if (!staff) throw new Error("Account is inactive");
                    identity = { id: staff.id, tenantId: staff.tenantId, userType: "TENANT_STAFF" };
                } else if (ownerType === "CLIENT" || !ownerType) {
                    const client = await this.prisma.clientTenant.findFirst({ where: { id: claims.id, active: true }, select: { id: true, tenantId: true } });
                    if (!client) throw new Error("Account is inactive");
                    identity = { id: client.id, tenantId: client.tenantId, userType: "CLIENT" };
                } else {
                    throw new Error("Invalid token owner type");
                }
                socket.data.identity = identity;
                next();
            } catch (error) {
                next(new Error(`Unauthorized: ${error.message}`));
            }
        });

        this.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            const identity = socket.data.identity;
            const rooms = identity.userType === "TENANT_STAFF"
                ? [`TENANT_STAFF_${identity.id}`, `STAFF_${identity.id}`]
                : [`${identity.userType}_${identity.id}`];
            socket.join(rooms);
            socket.on("register", (_payload, callback) => {
                socket.join(rooms);
                callback?.({ success: true, message: "Registered" });
            });

            socket.on("chatMessage", async (data, callback) => {
                const acknowledge = (payload) => {
                    if (typeof callback === "function") callback(payload);
                };
                try {
                    const { receiverId, receiverType, clientMessageId } = data || {};
                    if (!receiverId || !["ADMIN", "TENANT_STAFF", "CLIENT"].includes(receiverType) || typeof data?.content !== "string" || !data.content.trim()) {
                        return acknowledge({ success: false, message: "A valid recipient and message are required" });
                    }
                    if (clientMessageId !== undefined && (typeof clientMessageId !== "string" || clientMessageId.length < 1 || clientMessageId.length > 128)) {
                        return acknowledge({ success: false, message: "Invalid client message ID" });
                    }
                    const senderType = identity.userType;
                    if (clientMessageId) {
                        const existing = await this.messageRepository.findByClientMessageId(identity.id, senderType, clientMessageId);
                        if (existing) return acknowledge({ success: true, message: existing });
                    }

                    const messageData = new Message({ ...data, senderId: identity.id, senderType, clientMessageId });
                    const newRecord = await this.messageService.createMessage(messageData.createMessage);

                    if (!newRecord) {
                        return acknowledge({ success: false, message: "Failed to create message" });
                    }

                    const receiverRoom = `${receiverType}_${receiverId}`;
                    this.io.to(receiverRoom).emit("chatMessage", newRecord);

                    acknowledge({ success: true, message: newRecord });

                } catch (error) {
                    console.error("Chat error:", error);
                    if (error.code === "P2002" && typeof data?.clientMessageId === "string") {
                        const existing = await this.messageRepository.findByClientMessageId(
                            identity.id,
                            identity.userType,
                            data.clientMessageId
                        ).catch(() => null);
                        if (existing) return acknowledge({ success: true, message: existing });
                    }
                    acknowledge({ success: false, message: "Message could not be sent" });
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
        if (!this.io) {
            // Background workers (e.g. cronWorker.js) never call init() since they
            // don't own an HTTP server for Socket.IO to bind to. Notifications are
            // still persisted to the DB by the caller; just skip the realtime push.
            console.warn("Socket.IO not initialized; skipping realtime emit for", userType, userId);
            return;
        }

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
