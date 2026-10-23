class ClinicalReportService {
    constructor({ repository }) {
        this.repository = repository;
    }

    async createReport(data) {
        const newRecord = await this.repository.create(data);

        if (!newRecord) throw new Error("Failed to create Clinical Report");

        return newRecord;
    }

    async updateReport(data) {
        const record = await this.repository.findOne({ id: data.id });
        if (!record) throw new Error("Clinical Report not found");

        const updated = await this.repository.update(data.id, {
            title: data.title || record.title,
            status: data.status || record.status,
            approverId: data.approverId ?? record.approverId,
            isDeleted: data.isDeleted ?? record.isDeleted
        });

        if (!updated) throw new Error("Failed to update Clinical Report");

        return updated;
    }

    async getReport(id) {
        const record = await this.repository.findOneAndPopulate({ id, isDeleted: false }, {
            creator: { select: { fullName: true } },
            client: { select: { client: { select: { firstName: true, lastName: true } } } },
            approver: { select: { fullName: true } },
            clinicalReportChangeRequests: true,
            clinicalReportVersions: true
        });
        if (!record) throw new Error("Clinical Report not found");
        return record;
    }

    async getReportForExport(id) {
        const record = await this.repository.findOneAndPopulate({ id, isDeleted: false }, {
            creator: { select: { fullName: true } },
            client: { select: { client: { select: { firstName: true, lastName: true } } } },
            approver: { select: { fullName: true } },
            clinicalReportChangeRequests: true,
            tenant: true,
            clinicalReportSections: true,
            client: { select: { client: { select: { firstName: true, lastName: true, email: true } } } }
        });

        if (!record) throw new Error("Clinical Report not found");
        return record;
    }

    async getReports(tenantId) {
        const records = await this.repository.findAllAndPopulate({ tenantId, isDeleted: false }, {
            creator: { select: { fullName: true } },
            client: { select: { client: { select: { firstName: true, lastName: true } } } },
            approver: { select: { fullName: true } },
            clinicalReportChangeRequests: true,
            clinicalReportVersions: true
        });
        if (!records) throw new Error("No clinical reports found");
        return records;
    }

    async getReportsByStatus(tenantId, status) {
        const records = await this.repository.findAllByStatus(tenantId, status);
        if (!records) throw new Error("No clinical reports found");
        return records;
    }

    async getClientReportsByStatus(clientTenantId, status) {
        const records = await this.repository.findAllByStatusForClient(clientTenantId, status);
        if (!records) throw new Error("No clinical reports found");
        return records;
    }

    async getReportsSubmittedForApprover(approverId, clientTenantId) {
        const records = await this.repository.findAllByApproverAndStatus(approverId, clientTenantId);
        if (!records) throw new Error("No clinical reports found");
        return records;
    }
}

export default ClinicalReportService