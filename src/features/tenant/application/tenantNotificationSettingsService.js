class TenantNotificationSettingsService {
    constructor({ tenantNotificationSettingsRepository }) {
        this.tenantNotificationSettingsRepository = tenantNotificationSettingsRepository;
    }

    async getNotificationSettings(userId) {
        const record = await this.tenantNotificationSettingsRepository.findByUserId(userId);

        if (!record) {
            return null;
        }

        return record.settings;
    }

    async saveNotificationSettings(userId, settings) {
        const existing = await this.tenantNotificationSettingsRepository.findByUserId(userId);

        const record = await this.tenantNotificationSettingsRepository.upsert({
            userId,
            settings
        });

        if (!record) {
            throw new Error("Failed to save notification settings");
        }

        return {
            record,
            isNew: !existing
        };
    }
}

export default TenantNotificationSettingsService;