class CompensationType {
    constructor({ id, tenantId, name, isDeleted, isActive }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    get createCompensationType() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }

    get updateCompensationType() {
        return {
            id: this.id,
            tenantId: this.tenantId,
            name: this.name,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default CompensationType;
