class ClientDocuments {
    constructor({
        id = null,
        tenantClientId = null,
        name = "",
        documentDetails = {},
        isDeleted = false,
        requestId,
        createdBy
    } = {}) {
        this.id = id;
        this.tenantClientId = tenantClientId;
        this.name = name;
        this.documentDetails = documentDetails;
        this.isDeleted = isDeleted;
        this.requestId = requestId;
        this.createdBy = createdBy;
    }

    get createClientDocument() {
        return {
            tenantClientId: this.tenantClientId,
            name: this.name,
            documentDetails: this.documentDetails,
            isDeleted: this.isDeleted,
            requestId: this.requestId,
            createdBy: this.createdBy
        };
    }

    get updateClientDocument() {
        return {
            id: this.id,
            tenantClientId: this.tenantClientId,
            name: this.name,
            documentDetails: this.documentDetails,
            isDeleted: this.isDeleted
        };
    }
}

export default ClientDocuments;
