class ClientDocuments {
    constructor({
        id = null,
        tenantClientId = null,
        name = "",
        documentDetails = {},
        isDeleted = false
    } = {}) {
        this.id = id;
        this.tenantClientId = tenantClientId;
        this.name = name;
        this.documentDetails = documentDetails;
        this.isDeleted = isDeleted;
    }

    get createClientDocument() {
        return {
            tenantClientId: this.tenantClientId,
            name: this.name,
            documentDetails: this.documentDetails,
            isDeleted: this.isDeleted
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
