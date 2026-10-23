class Form {
    constructor({ id, tenantId, name, isDraft, isTemplate, isDeleted }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.isDraft = isDraft;
        this.isTemplate = isTemplate;
        this.isDeleted = isDeleted;
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
            isTemplate: this.isTemplate,
            isDeleted: this.isDeleted
        };
    }
}

export default Form;
