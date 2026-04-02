class TenantStaffDocument {
    constructor({
        id,
        documentsUrl,
        tenantStaffId,
        tenantStaff,
        isDeleted
    }) {
        this.id = id;
        this.documentsUrl = documentsUrl;
        this.tenantStaffId = tenantStaffId;
        this.tenantStaff = tenantStaff;
        this.isDeleted = isDeleted;
    }

    get createTenantStaffDocuments() {
        return {
            documentsUrl: this.documentsUrl,
            tenantStaffId: this.tenantStaffId
        };
    }
}

export default TenantStaffDocument