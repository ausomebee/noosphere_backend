import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import NotificationRepository from "../../infrastucture/notificationRepository.js";
import NotificationService from "../../application/notificationService.js";
import Notification from "../../domain/notification.js";

class NotificationController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.notificationRepository = new NotificationRepository(this.prisma.notification);
        this.service = new NotificationService({
            notificationRepository: this.notificationRepository
        });
    }

    createNotification = expressAsyncHandler(async (req, res) => {
        const data = new Notification(req.body);
        const newRecord = await this.service.createNotification(data.createNotification);

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to create notification" });
        }

        return res.status(201).json({
            message: "Notification created successfully",
            status: "ok",
            data: newRecord
        });
    });

    updateNotification = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateNotification(req.body);

        if (!updated) {
            return res.status(500).json({ message: "Failed to update notification" });
        }

        return res.status(201).json({
            message: "Notification updated successfully",
            status: "ok",
            data: updated
        });
    });

    getSingleNotification = expressAsyncHandler(async (req, res) => {
        const record = await this.service.getSingleNotification(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({
            message: "Notification fetched successfully",
            status: "ok",
            data: record
        });
    });

    getNotificationsByUser = expressAsyncHandler(async (req, res) => {
        const { userId, userType } = req.params;
        const records = await this.service.getNotificationsByUser(userId, userType);

        if (!records || records.length === 0) {
            return res.status(404).json({ message: "No notifications found for this user" });
        }

        return res.status(200).json({
            message: "Notifications fetched successfully",
            status: "ok",
            data: records
        });
    });

    markAsRead = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.markAsRead(req.params.id);

        if (!updated) {
            return res.status(500).json({ message: "Failed to mark notification as read" });
        }

        return res.status(200).json({
            message: "Notification marked as read",
            status: "ok",
            data: updated
        });
    });
}

export default NotificationController;