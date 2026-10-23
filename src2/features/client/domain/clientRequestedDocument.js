class ClientRequestedDocuments {
    constructor({
        id = null,
        tenantClientId = null,
        name = "",
        description = "",
        allowMultiple = false,
        dueDate = null,
        isDeleted = false
    } = {}) {
        this.id = id;
        this.tenantClientId = tenantClientId;
        this.name = name;
        this.description = description;
        this.allowMultiple = allowMultiple;
        this.dueDate = dueDate;
        this.isDeleted = isDeleted;
    }

    get createRequestedDoc() {
        return {
            tenantClientId: this.tenantClientId,
            name: this.name,
            description: this.description,
            allowMultiple: this.allowMultiple,
            dueDate: this.dueDate,
            isDeleted: this.isDeleted
        };
    }

    get updateRequestedDoc() {
        return {
            id: this.id,
            tenantClientId: this.tenantClientId,
            name: this.name,
            description: this.description,
            allowMultiple: this.allowMultiple,
            dueDate: this.dueDate,
            isDeleted: this.isDeleted
        };
    }
}

export default ClientRequestedDocuments;
