class ServiceCodes {
    constructor({
        id,
        tenantId,
        code,
        description,
        modifiers,
        isDeleted,
        isActive
    }) {
        this.id = id;
        this.tenantId = tenantId;
        this.code = code;
        this.description = description;
        this.modifiers = modifiers;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    get createServiceCodeFromPayer() {
        return {
            tenantId: this.tenantId,
            code: this.code,
            description: this.description,
            modifiers: this.modifiers.reduce((acc, curr, index) => {
                acc[`modifier${index + 1}`] = curr.modifier;
                return acc;
            }, {}),
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }

    get createServiceCode() {
        return {
            tenantId: this.tenantId,
            code: this.code,
            description: this.description,
            modifiers: this.modifiers,
            isDeleted: this.isDeleted,
            isActive: this.isActive
        };
    }
}

export default ServiceCodes;
