class Form {
    constructor({ id, tenantId, name, isDraft }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.isDraft     = isDraft;
    }

    get createForm() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            isDraft: this.isDraft,
        };
    }

    get updateForm() {
        return {
            id: this.id,
            tenantId: this.tenantId,
            name: this.name,
            isDraft: this.isDraft,
        };
    }
}

export default Form;
