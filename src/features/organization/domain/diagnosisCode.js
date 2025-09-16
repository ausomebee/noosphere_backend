class OrganizationDiagnosisCode {
    constructor({ id, tenantId, code, description, isActive }) {
        this.id = id;
        this.tenantId = tenantId;
        this.code = code;
        this.description = description;
        this.isActive = isActive;
    }

    get createOrganizationDiagnosisCodes() {
        return {
            tenantId: this.tenantId,
            code: this.code,
            description: this.description,
            isActive: this.isActive
        };
    }
}

export default OrganizationDiagnosisCode;
