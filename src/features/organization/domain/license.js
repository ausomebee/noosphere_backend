class License {
    constructor({ id, tenantId, licenseName, licenseNumber, issueDate, expiryDate, isDeleted }) {
        this.id = id;
        this.tenantId = tenantId;
        this.licenseName = licenseName;
        this.licenseNumber = licenseNumber;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.isDeleted = isDeleted;
    }

    get createLicense() {
        return {
            id: this.id,
            tenantId: this.tenantId,
            licenseName: this.licenseName,
            licenseNumber: this.licenseNumber,
            issueDate: this.issueDate,
            expiryDate: this.expiryDate,
            isDeleted: this.isDeleted
        };
    }

}

export default License;