class TenantGeneralSettingsService {
    constructor({ repository }) {
        this.repository = repository;
    }

    async createSettings(data) {
        const newRecord = await this.repository.create(data);
        if (!newRecord) throw new Error("Failed to create Tenant General Settings");
        return newRecord;
    }

    async updateSettings(data) {
        const record = await this.repository.findOne({ tenantId: data.tenantId });
        if (!record) throw new Error("Tenant General Settings not found");

        const updated = await this.repository.update(record.id, {
            dateFormat: data.dateFormat || record.dateFormat,
            timeFormat: data.timeFormat || record.timeFormat,
            currency: data.currency || record.currency
        });

        if (!updated) throw new Error("Failed to update Tenant General Settings");
        return updated;
    }

    async getSettings(tenantId) {
        let record = await this.repository.findOne({ tenantId });

        if (!record) {
            record = await this.createSettings({
                tenantId,
                dateFormat: "YYYY-MM-DD",
                timeFormat: "HH:mm",
                currency: "USD"
            });
        }

        return record;
    }
}

export default TenantGeneralSettingsService;
