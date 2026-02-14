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
        const record = await this.repository.findOneAndPopulate({ id }, {
            client: {
                select: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            approver: { select: { fullName: true } }
        });
        if (!record) {
            throw new Error("Clinical Report Change Request not found");
        }
        return record;
    }

    async getChangeRequests(clinicalReportId) {
        const records = await this.repository.findAllAndPopulate({ clinicalReportId }, {
            client: {
                select: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            approver: { select: { fullName: true } }
        });
        if (!records) {
            throw new Error("No change requests found for this report");
        }
        return records;
    }
}

export default ClinicalReportChangeRequestService;
