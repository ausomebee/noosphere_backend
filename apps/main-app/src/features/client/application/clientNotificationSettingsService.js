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
            return this.clientNotificationSettingsRepository.findOne({ id: exists.id });
        }

        let newRecord;
        try {
            newRecord = await this.clientNotificationSettingsRepository.create(data);
        } catch (error) {
            if (error.code !== "P2002") throw error;
            return this.clientNotificationSettingsRepository.findByClientId(data.tenantClientId);
        }

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

        // Remove id so it doesn't attempt to update it
        const { id, ...updateData } = data;

        const updated = await this.clientNotificationSettingsRepository.update(id, updateData);

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

    async getNotificationSettingsByClient(tenantClientId) {
        const record = await this.clientNotificationSettingsRepository.findByClientId(tenantClientId);

        if (!record) {
            try {
                const newRecord = await this.clientNotificationSettingsRepository.create({
                tenantClientId,

                appointmentScheduled: true,
                appointmentRescheduled: true,
                appointmentAboutToStart: true,
                appointmentStarted: true,
                appointmentCancelled: true,
                appointmentCompletedAwaitingFeedback: true,

                documentRequested: true,
                formShared: true,

                authorizationAboutToExpire: true,
                authorizationExpired: true,
                authorizationUnitsAlmostExhausted: true,
                authorizationUnitsExhausted: true,

                signatureRequested: true
                });

                if (!newRecord) throw new Error("Failed to create notification settings.");
                return newRecord;
            } catch (error) {
                if (error.code !== "P2002") throw error;
                return this.clientNotificationSettingsRepository.findByClientId(tenantClientId);
            }
        }

        return record;
    }
}

export default ClientNotificationSettingsService;
