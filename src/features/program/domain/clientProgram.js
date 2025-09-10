class ClientProgram {
    constructor({id, clientId, programId, createdAt, updatedAt}) {
        this.id = id;
        this.clientId = clientId;
        this.programId = programId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createClientProgram() {
        return {
            clientId: this.clientId,
            programId: this.programId,
        };
    }
}

export default ClientProgram;