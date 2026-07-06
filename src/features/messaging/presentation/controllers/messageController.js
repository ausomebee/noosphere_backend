import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import MessageService from "../../application/messageService.js";
import Message from "../../domain/message.js";
import MessageRepository from "../../infrastructure/messageRepository.js";

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

        return res.status(200).json({
            message: "Message marked as read",
            status: "ok",
            data: updated
        });
    });
}

export default MessageController;
