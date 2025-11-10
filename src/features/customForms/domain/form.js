class Form {
    constructor({ id, tenantId, name }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
    }

    get createForm() {
        return {
            tenantId: this.tenantId,
            name: this.name,
        };
    }

    get updateForm() {
        return {
            id: this.id,
            tenantId: this.tenantId,
            name: this.name,
        };
    }
}

export default Form;
