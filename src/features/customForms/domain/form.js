class Form {
    constructor({ id, tenantId, name, formFields }) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.formFields = formFields;
    }

    get createForm() {
        return {
            tenantId: this.tenantId,
            name: this.name,
            formFields: this.formFields
        };
    }
}

export default Form;
