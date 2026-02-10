class Notification {
    constructor({
        id,
        subject,
        message,
        tenantStaffId,
        tenantClientId,
        adminId,
        isRead,
        readAt,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.subject = subject;
        this.message = message;
        this.tenantStaffId = tenantStaffId;
        this.tenantClientId = tenantClientId;
        this.adminId = adminId;
        this.isRead = isRead;
        this.readAt = readAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createNotification() {
        return {
            subject: this.subject,
            message: this.message,
            tenantStaffId: this.tenantStaffId,
            tenantClientId: this.tenantClientId,
            adminId: this.adminId
        };
    }
}

export default Notification;
