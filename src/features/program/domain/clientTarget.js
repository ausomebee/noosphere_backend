class ClientTarget {
    constructor({id, clientId, targetId, createdAt, updatedAt}) {
        this.id = id;
        this.clientId = clientId;
        this.targetId = targetId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createClientTarget() {
        return {
            clientId: this.clientId,
            targetId: this.targetId,
        };
    }
}

export default ClientTarget;