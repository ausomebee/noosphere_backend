class ClientForm {
    constructor({ id, tenantClientId, formId, createdAt, updatedAt }) {
        this.id = id;
        this.tenantClientId = tenantClientId;
        this.formId = formId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createClientForm() {
        return {
            tenantClientId: this.tenantClientId,
            formId: this.formId,
        };
    }
}

export default ClientForm;
