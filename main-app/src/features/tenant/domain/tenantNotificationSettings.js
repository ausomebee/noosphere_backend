class TenantNotificationSettings {
    constructor({
        id,
        userId,
        settings,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.userId = userId;
        this.settings = settings;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createNotificationSettings() {
        return {
            userId: this.userId,
            settings: this.settings
        };
    }

    get updateNotificationSettings() {
        return {
            settings: this.settings
        };
    }
}

export default TenantNotificationSettings;