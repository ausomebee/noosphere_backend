class ClinicalReportSectionService {
    constructor({ repository }) {
        this.repository = repository;
    }

    async createSection(data) {
        const newRecord = await this.repository.create(data);
        if (!newRecord) throw new Error("Failed to create Clinical Report Section");
        return newRecord;
    }

    async updateSection(data) {
        const record = await this.repository.findOne({ id: data.id });
        if (!record) throw new Error("Clinical Report Section not found");

        const updated = await this.repository.update(data.id, {
            section: data.section || record.section,
            content: data.content || record.content
        });

        if (!updated) throw new Error("Failed to update Clinical Report Section");
        return updated;
    }

    async getSection(id) {
        const record = await this.repository.findOne({ id });
        if (!record) throw new Error("Clinical Report Section not found");
        return record;
    }

    async getSections(clinicalReportId) {
        const records = await this.repository.findAll({ clinicalReportId });
        if (!records) throw new Error("No sections found for this report");
        return records;
    }
}

export default ClinicalReportSectionService;