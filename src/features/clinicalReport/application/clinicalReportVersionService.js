class ClinicalReportVersionService {
    constructor({ repository }) {
        this.repository = repository;
    }

    async createVersion(data) {
        const latest = await this.repository.findFirst(
            { clinicalReportId: data.clinicalReportId },
            { versionNumber: "desc" }
        );

        const nextVersionNumber = latest ? latest.versionNumber + 1 : 1;

        const newRecord = await this.repository.create({
            clinicalReportId: data.clinicalReportId,
            versionNumber: nextVersionNumber,
            url: data.url
        });

        if (!newRecord) throw new Error("Failed to create Clinical Report Version");

        return newRecord;
    }

    async getVersion(id) {
        const record = await this.repository.findOne({ id });
        if (!record) throw new Error("Clinical Report Version not found");
        return record;
    }

    async getVersionsByReport(clinicalReportId) {
        const records = await this.repository.findAll(
            { clinicalReportId },
            { versionNumber: "desc" }
        );

        if (!records || records.length === 0)
            throw new Error("No versions found for this report");

        return records;
    }

    async getLatestVersion(clinicalReportId) {
        const latest = await this.repository.findFirst(
            { clinicalReportId },
            { versionNumber: "desc" }
        );

        if (!latest) throw new Error("No versions found for this report");

        return latest;
    }

    // async deleteVersion(id) {
    //     const record = await this.repository.findOne({ id });
    //     if (!record) throw new Error("Clinical Report Version not found");

    //     return await this.repository.delete(id);
    // }

    async rollbackVersion(versionId) {
        const version = await this.repository.findOne({ id: versionId });
        if (!version) throw new Error("Version to rollback not found");

        return await this.createVersion({
            clinicalReportId: version.clinicalReportId,
            url: version.url
        });
    }
}

export default ClinicalReportVersionService;
