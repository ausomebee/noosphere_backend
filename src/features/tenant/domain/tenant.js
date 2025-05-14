class Tenant {
    constructor({ id, fullName, email, phoneNumber, roleId, stage, password, tenantId, contactPerson, companySize, organizationType, location, leadSource, companyName, createdBy }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roleId = roleId;
        this.stage = stage;
        this.password = password;
        this.tenantId = tenantId;
        this.contactPerson = contactPerson;
        this.companySize = companySize;
        this.organizationType = organizationType;
        this.location = location;
        this.leadSource = leadSource;
        this.companyName = companyName;
        this.createdBy = createdBy;
    }

    get createTenant() {
        return {
            email: this.email,
            phoneNumber: this.phoneNumber,
            companyName: this.companyName,
            stage: this.stage,
            contactPerson: this.contactPerson,
            companySize: this.companySize,
            organizationType: this.organizationType,
            location: this.location,
            leadSource: this.leadSource,
            createdBy: this.createdBy
        };
    }

    get createTenantStaff() {
        return {
            fullName: this.fullName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            roleId: this.roleId,
            tenantId: this.tenantId,
            stage: this.stage
        };
    }

}

export default Tenant;