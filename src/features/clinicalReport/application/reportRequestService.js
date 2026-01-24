class ClinicalReportChangeRequestService {
    constructor({ repository }) {
        this.repository = repository;
    }

    async createChangeRequest(data) {
        const newRecord = await this.repository.create(data);
        if (!newRecord) {
            throw new Error("Failed to create Clinical Report Change Request");
        }
        return newRecord;
    }

    async getChangeRequest(id) {
        const record = await this.repository.findOne({ id });
        if (!record) {
            throw new Error("Clinical Report Change Request not found");
        }
        return record;
    }

    async getChangeRequests(clinicalReportId) {
        const records = await this.repository.findAll({ clinicalReportId });
        if (!records) {
            throw new Error("No change requests found for this report");
        }
        return records;
    }
}

export default ClinicalReportChangeRequestService;
