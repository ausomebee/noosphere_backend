class ClinicalReportTemplate {
    constructor({ id, tenantId, title, isActive, isDeleted, createdAt, updatedAt }) {
        this.id = id;
        this.tenantId = tenantId;
        this.title = title;
        this.isActive = isActive;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createTemplate() {
        return {
            tenantId: this.tenantId,
            title: this.title,
            isActive: this.isActive ?? true,
            isDeleted: this.isDeleted ?? false
        };
    }
}

export default ClinicalReportTemplate;