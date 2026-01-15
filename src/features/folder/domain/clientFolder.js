class ClientFolder {
    constructor({ id, name, clientTenantId, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.clientTenantId = clientTenantId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createClientFolder() {
        return {
            name: this.name,
            clientTenantId: this.clientTenantId
        };
    }
}

export default ClientFolder;
