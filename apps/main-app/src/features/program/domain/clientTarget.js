class ClientTarget {
    constructor({id, clientId, targetId, createdAt, updatedAt, programId}) {
        this.id = id;
        this.clientId = clientId;
        this.targetId = targetId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.programId = programId;
    }

    get createClientTarget() {
        return {
            clientId: this.clientId,
            targetId: this.targetId,
        };
    }
}

export default ClientTarget;