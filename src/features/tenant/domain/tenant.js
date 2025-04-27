class Tenant {
    constructor({ id, fullName, email, phoneNumber, roleId, stage, password, tenantId }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roleId = roleId;
        this.stage = stage;
        this.password = password;
        this.tenantId=tenantId;
    }
  
    get createTenant() {
        return {
            fullName: this.fullName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            password: this.password,
            stage: this.stage
        };
    }

    get createTenantStaff() {
        return {
            fullName: this.fullName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            roleId: this.roleId,
            tenantId: this.tenantId,
            password: this.password,
            stage: this.stage
        };
    }
    
}

export default Tenant;