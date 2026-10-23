class ClinicalReportVersion {
    constructor({ id, clinicalReportId, versionNumber, url, createdAt }) {
        this.id = id;
        this.clinicalReportId = clinicalReportId;
        this.versionNumber = versionNumber;
        this.url = url;
        this.createdAt = createdAt;
    }

    get createVersion() {
        return {
            clinicalReportId: this.clinicalReportId,
            versionNumber: this.versionNumber,
            url: this.url
        };
    }
}

export default ClinicalReportVersion;
