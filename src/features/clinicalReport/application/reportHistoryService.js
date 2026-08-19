class ClinicalReportHistoryService {
    constructor({ repository }) {
        this.repository = repository;
    }

    async createHistory(data) {
        const newRecord = await this.repository.create(data);
        if (!newRecord) throw new Error("Failed to create Clinical Report History");
        return newRecord;
    }

    async getHistory(id) {
        const record = await this.repository.findOne({ id });
        if (!record) throw new Error("Clinical Report History not found");
        return record;
    }

    async getHistories(clinicalReportId) {
        const records = await this.repository.findAllWithCreatedBy({ clinicalReportId });
        if (!records) throw new Error("No histories found for this report");
        return records;
    }
}

export default ClinicalReportHistoryService;
