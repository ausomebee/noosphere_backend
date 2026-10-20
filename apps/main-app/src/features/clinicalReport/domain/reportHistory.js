class ClinicalReportHistory {
    constructor({ id, clinicalReportId, action, details, createdBy, createdAt }) {
        this.id = id;
        this.clinicalReportId = clinicalReportId;
        this.action = action;
        this.details = details;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    get createHistory() {
        return {
            clinicalReportId: this.clinicalReportId,
            action: this.action,
            details: this.details ?? null,
            createdBy: this.createdBy
        };
    }
}

export default ClinicalReportHistory;