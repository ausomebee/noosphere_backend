class Deduction {
    constructor({ id, tenantId, name, type, rate, isDeleted, isActive }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.type = type;
        this.rate = rate;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    get createDeduction() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            type: this.type,
            rate: this.rate,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }

    get updateDeduction() {
        return {
            id: this.id,
            tenantId: this.tenantId,
            name: this.name,
            type: this.type,
            rate: this.rate,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default Deduction;
