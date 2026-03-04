class NotificationService {
    constructor({ notificationRepository }) {
        this.notificationRepository = notificationRepository;
    }

    async createNotification(data) {
        const newNotification = await this.notificationRepository.create(data);

        if (!newNotification) {
            throw new Error("Failed to create notification.");
        }

        return newNotification;
    }

    async updateNotification(data) {
        const record = await this.notificationRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Notification not found.");
        }

        const updated = await this.notificationRepository.update(data.id, {
            title: data.title || record.title,
            content: data.content || record.content,
            isRead: data.isRead ?? record.isRead
        });

        if (!updated) {
            throw new Error("Failed to update notification.");
        }

        return updated;
    }

    async getSingleNotification(id) {
        const record = await this.notificationRepository.findOne({ id });

        if (!record) {
            throw new Error("Notification not found.");
        }

        return record;
    }

    async getNotificationsByUser(userId, userType) {
        const records = await this.notificationRepository.findAllAndPopulate(
            { userId, userType },
            {}
        );

        if (!records) {
            throw new Error("No notifications found for this user.");
        }

        return records;
    }

    async markAsRead(notificationId) {
        const record = await this.notificationRepository.findOne({ id: notificationId });

        if (!record) {
            throw new Error("Notification not found.");
        }

        return await this.notificationRepository.update(notificationId, { isRead: true });
    }
}

export default NotificationService;