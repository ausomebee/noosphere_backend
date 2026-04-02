class ClinicalReportTemplateService {
    constructor({ clinicalReportTemplateRepository }) {
        this.repository = clinicalReportTemplateRepository;
    }

    async createTemplate(data) {
        const exists = await this.repository.findFirstDynamic({
            where: { tenantId: data.tenantId, title: data.title },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Template with this title already exists for this tenant.");
        }

        const newRecord = await this.repository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create Clinical Report Template.");
        }

        return newRecord;
    }

    async updateTemplate(data) {
        const record = await this.repository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Template not found");
        }

        const updated = await this.repository.update(data.id, {
            title: data.title || record.title,
            isActive: data.isActive ?? record.isActive,
            isDeleted: data.isDeleted ?? record.isDeleted
        });

        if (!updated) {
            throw new Error("Failed to update Clinical Report Template");
        }

        return updated;
    }

    async getTemplate(id) {
        const record = await this.repository.findOne({ id, isDeleted: false });

        if (!record) {
            throw new Error("Template not found");
        }

        return record;
    }

    async getTemplates(tenantId) {
        const records = await this.repository.findAll({ tenantId, isDeleted: false });

        if (!records) {
            throw new Error("No templates found");
        }

        return records;
    }
}

export default ClinicalReportTemplateService;
