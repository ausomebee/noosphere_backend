class TargetData {
    constructor({id, clientId, targetId, data, createdAt, updatedAt}) {
        this.id = id;
        this.clientId = clientId;
        this.targetId = targetId;
        this.data = data;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createTargetData() {
        return {
            clientId: this.clientId,
            targetId: this.targetId,
            data: this.data,
        };
    }
}

export default TargetData;