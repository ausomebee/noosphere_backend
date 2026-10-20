class ClinicalReportChangeRequest {
    constructor({
        id,
        description,
        viewed,
        clinicalReportId,
        clientTenantId,
        approverId,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.description = description;
        this.viewed = viewed;
        this.clinicalReportId = clinicalReportId;
        this.clientTenantId = clientTenantId;
        this.approverId = approverId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createChangeRequest() {
        return {
            description: this.description,
            clinicalReportId: this.clinicalReportId,
            clientTenantId: this.clientTenantId ?? null,
            approverId: this.approverId ?? null
        };
    }
}

export default ClinicalReportChangeRequest;
