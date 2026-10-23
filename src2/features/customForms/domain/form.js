class Form {
    constructor({ id, tenantId, name, isDraft, isTemplate }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.isDraft = isDraft;
        this.isTemplate = isTemplate;
    }

    get createForm() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            isDraft: this.isDraft,
            isTemplate: this.isTemplate
        };
    }

    get updateForm() {
        return {
            id: this.id,
            tenantId: this.tenantId,
            name: this.name,
            isDraft: this.isDraft,
            isTemplate: this.isTemplate
        };
    }
}

export default Form;
