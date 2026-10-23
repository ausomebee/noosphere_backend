class TenantStaff {
    constructor({
        id,
        fullName,
        email,
        stage,
        roleId,
        tenantId,
        dob,
        gender,
        npi,
        address,
        city,
        state,
        zip,
        country,
        phoneNumber,
        active = true,
        isDeleted = false,
        createdAt = new Date(),
        updatedAt = new Date(),
        password,
        authType,
        authQuestion,
        auth2FADone = false,
        role,
        tenant,
        pipelineItems = [],
        clientTenants = [],
        tenantStaffLicenses = [],
        tenantStaffPayroll = [],
        tenantStaffDocuments = []
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.stage = stage;
        this.roleId = roleId;
        this.tenantId = tenantId;
        this.dob = dob;
        this.gender = gender;
        this.npi = npi;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
        this.phoneNumber = phoneNumber;
        this.active = active;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.password = password;
        this.authType = authType;
        this.authQuestion = authQuestion;
        this.auth2FADone = auth2FADone;
        this.role = role;
        this.tenant = tenant;
        this.pipelineItems = pipelineItems;
        this.clientTenants = clientTenants;
        this.tenantStaffLicenses = tenantStaffLicenses;
        this.tenantStaffPayroll = tenantStaffPayroll;
        this.tenantStaffDocuments = tenantStaffDocuments;
    }

    get createTenantStaff() {
        return {
            fullName: this.fullName,
            email: this.email,
            stage: this.stage,
            roleId: this.roleId,
            tenantId: this.tenantId,
            dob: this.dob,
            gender: this.gender,
            npi: this.npi,
            address: this.address,
            city: this.city,
            state: this.state,
            zip: this.zip,
            country: this.country,
            phoneNumber: this.phoneNumber,
            active: this.active,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            password: this.password,
            authType: this.authType,
            authQuestion: this.authQuestion,
            auth2FADone: this.auth2FADone
        };
    }
}

export default TenantStaff