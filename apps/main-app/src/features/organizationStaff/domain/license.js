class TenantStaffLicense {
    constructor({
        id,
        licenseName,
        licenseNumber,
        tenantStaffId,
        issueState,
        expiryDate,
        tenantStaff,
        isDeleted
    }) {
        this.id = id;
        this.licenseName = licenseName;
        this.licenseNumber = licenseNumber;
        this.tenantStaffId = tenantStaffId;
        this.issueState = issueState;
        this.expiryDate = expiryDate;
        this.tenantStaff = tenantStaff;
        this.isDeleted = isDeleted;
    }

    get createTenantStaffLicense() {
        return {
            licenseName: this.licenseName,
            licenseNumber: this.licenseNumber,
            tenantStaffId: this.tenantStaffId,
            issueState: this.issueState,
            expiryDate: this.expiryDate
        };
    }
}

export default TenantStaffLicense