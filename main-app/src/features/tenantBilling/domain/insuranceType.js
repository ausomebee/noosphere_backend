class InsuranceType {
    constructor({
        id,
        tenantId,
        name,
        description,
        isDeleted,
        isActive
    }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.description = description;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    get createInsuranceType() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            description: this.description,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default InsuranceType;
