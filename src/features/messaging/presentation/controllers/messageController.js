import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import MessageService from "../../application/messageService.js";
import Message from "../../domain/message.js";
import MessageRepository from "../../infrastructure/messageRepository.js";
import auditLogger from "../../../logs/application/auditLogger.js";

class MessageController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.messageRepository = new MessageRepository(this.prisma.message);
        this.service = new MessageService({
            messageRepository: this.messageRepository
        });
    }

    createMessage = expressAsyncHandler(async (req, res) => {
        const data = new Message(req.body);
        const newRecord = await this.service.createMessage(data.createMessage);

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create message" });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || req.body.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Messaging",
            action: "sent a message",
            reason: "Message created",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "Message created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateMessage = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateMessage(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update message" });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || req.body.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Messaging",
            action: `updated message ${updated.id}`,
            reason: "Message updated",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "Message updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleMessage = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleMessage(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Message not found" });
        }

        return res.status(200).json({
            message: "Message fetched successfully",
            status: "ok",
            data: record
        });
    });

    getMessagesByUser = expressAsyncHandler(async (req, res) => {
        const { userId, userType } = req.params;
        const records = await this.service.getMessagesByUser(userId, userType);

        return res.status(200).json({
            message: "Messages fetched successfully",
            status: "ok",
            data: records ?? []
        });
    });

    markAsRead = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.markAsRead(req.params.id);

        if (!updated) {
            return res.status(500).json({ message: "Failed to mark message as read" });
        }

        await auditLogger.log(req, {
            tenantId: req.user?.tenantId || req.body.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Messaging",
            action: `marked message ${updated.id} as read`,
            reason: "Message marked as read",
            accessedBy: req.user?.name || null,
        });

        return res.status(200).json({
            message: "Message marked as read",
            status: "ok",
            data: updated
        });
    });
}

export default MessageController;
