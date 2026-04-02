class ClientForm {
    constructor({
        id,
        tenantClientId,
        formId,
        status,
        dueDate,
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.tenantClientId = tenantClientId;
        this.formId = formId;
        this.status = status;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createClientForm() {
        return {
            tenantClientId: this.tenantClientId,
            formId: this.formId,
            dueDate: this.dueDate,
        };
    }
}

export default ClientForm;
