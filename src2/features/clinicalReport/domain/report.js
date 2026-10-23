class ClinicalReport {
    constructor({ id, title, clientTenantId, creatorId, approverId, tenantId, status, isDeleted, createdAt, updatedAt }) {
        this.id = id;
        this.title = title;
        this.clientTenantId = clientTenantId;
        this.creatorId = creatorId;
        this.approverId = approverId;
        this.tenantId = tenantId;
        this.status = status;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createReport() {
        return {
            title: this.title,
            clientTenantId: this.clientTenantId,
            creatorId: this.creatorId,
            approverId: this.approverId ?? null,
            tenantId: this.tenantId,
            status: this.status ?? "DRAFT",
            isDeleted: this.isDeleted ?? false
        };
    }
}

export default ClinicalReport;