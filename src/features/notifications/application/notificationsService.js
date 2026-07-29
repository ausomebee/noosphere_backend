class NotificationService {
    constructor({ notificationRepository }) {
        this.notificationRepository = notificationRepository;
    }

    normalizeUserType(userType) {
        if (userType === "STAFF") {
            return "TENANT_STAFF";
        }

        return userType;
    }

    async createNotification(data) {
        const normalizedData = {
            ...data,
            userType: this.normalizeUserType(data.userType)
        };

        const newNotification = await this.notificationRepository.create(normalizedData);

        if (!newNotification) {
            throw new Error("Failed to create notification.");
        }

        return newNotification;
    }

    async dispatch({ recipients, type, title, content, entityType, entityId, metadata = null }, emit) {
        const uniqueRecipients = [...new Map(
            recipients
                .filter((recipient) => recipient?.userId && recipient?.userType)
                .map((recipient) => [`${recipient.userType}:${recipient.userId}`, recipient])
        ).values()];

        const notifications = await Promise.all(uniqueRecipients.map(async (recipient) => {
            const notification = await this.createNotification({
                userId: recipient.userId,
                userType: recipient.userType,
                type,
                title,
                content: typeof content === "function" ? content(recipient) : content,
                entityType,
                entityId: String(entityId),
                metadata,
                isRead: false,
            });

            emit?.(notification.userId, notification.userType, "newNotification", { notification });
            return notification;
        }));

        return notifications;
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
        const normalizedUserType = this.normalizeUserType(userType);

        const records = await this.notificationRepository.findAllAndPopulate(
            { userId, userType: normalizedUserType },
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
