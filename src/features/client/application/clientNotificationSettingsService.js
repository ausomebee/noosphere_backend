class ClientNotificationSettingsService {
    constructor({ clientNotificationSettingsRepository }) {
        this.clientNotificationSettingsRepository = clientNotificationSettingsRepository;
    }

    async createNotificationSettings(data) {
        const exists = await this.clientNotificationSettingsRepository.findFirstDynamic({
            where: { tenantClientId: data.tenantClientId },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Notification settings for this client already exist.");
        }

        const newRecord = await this.clientNotificationSettingsRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create notification settings.");
        }

        return newRecord;
    }

    async updateNotificationSettings(data) {
        const record = await this.clientNotificationSettingsRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Notification settings not found");
        }

        const updated = await this.clientNotificationSettingsRepository.update(data.id, {
            reschedule: data.reschedule ?? record.reschedule,
            starts: data.starts ?? record.starts,
            completed: data.completed ?? record.completed,
            awaitingReview: data.awaitingReview ?? record.awaitingReview,
            approvedReschedule: data.approvedReschedule ?? record.approvedReschedule,
        });

        if (!updated) {
            throw new Error("Failed to update notification settings");
        }

        return updated;
    }

    async getSingleNotificationSettings(id) {
        const record = await this.clientNotificationSettingsRepository.findOne({ id });

        if (!record) {
            throw new Error("Notification settings not found");
        }

        return record;
    }

    async getNotificationSettingsByClient(clientTenantId) {
        const record = await this.clientNotificationSettingsRepository.findByClientId(clientTenantId);

        if (!record) {
            const newRecord = await this.clientNotificationSettingsRepository.create({
                tenantClientId: clientTenantId,
                reschedule: false,
                starts: false,
                completed: false,
                awaitingReview: false,
                approvedReschedule: false
            });

            if (!newRecord) {
                throw new Error("Failed to create notification settings.");
            }

            return newRecord;
        }

        return record;
    }
}

export default ClientNotificationSettingsService;
