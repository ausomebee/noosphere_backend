class NotificationsService {
    constructor({ notificationsRepository }) {
        this.notificationsRepository = notificationsRepository;
    }

    async createNotification(data) {
        const newRecord = await this.notificationsRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create Notification.");
        }

        return newRecord;
    }

    async markAsRead(id) {
        const record = await this.notificationsRepository.findOne({ id });

        if (!record) {
            throw new Error("Notification not found");
        }

        const updated = await this.notificationsRepository.update(id, {
            isRead: true,
            readAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to mark notification as read");
        }

        return updated;
    }

    async getSingleNotification(id) {
        const record = await this.notificationsRepository.findOne({ id });

        if (!record) {
            throw new Error("Notification not found");
        }

        return record;
    }

    async getNotificationsByRecipient({ tenantStaffId, tenantClientId, adminId }) {
        const where = {
            ...(tenantStaffId && { tenantStaffId }),
            ...(tenantClientId && { tenantClientId }),
            ...(adminId && { adminId })
        };

        const records = await this.notificationsRepository.findAllAndPopulate(
            where,
            {
                tenantStaff: true,
                tenantClient: true,
                admin: true
            }
        );

        if (!records) {
            throw new Error("Notifications not found");
        }

        return records;
    }

    async getUnreadCount({ tenantStaffId, tenantClientId, adminId }) {
        const where = {
            isRead: false,
            ...(tenantStaffId && { tenantStaffId }),
            ...(tenantClientId && { tenantClientId }),
            ...(adminId && { adminId })
        };

        return await this.notificationsRepository.count(where);
    }

    async markAllAsRead({ tenantStaffId, tenantClientId, adminId }) {
        const where = {
            isRead: false,
            ...(tenantStaffId && { tenantStaffId }),
            ...(tenantClientId && { tenantClientId }),
            ...(adminId && { adminId })
        };

        const updated = await this.notificationsRepository.updateMany(where, {
            isRead: true,
            readAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to mark notifications as read");
        }

        return updated;
    }
}

export default NotificationsService;
