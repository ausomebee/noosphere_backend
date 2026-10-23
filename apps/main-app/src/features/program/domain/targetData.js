class TargetData {
    constructor({id, clientTargetId, data, createdAt, updatedAt}) {
        this.id = id;
        this.clientTargetId = clientTargetId;
        this.data = data;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createTargetData() {
        return {
            clientTargetId: this.clientTargetId,
            data: this.data,
        };
    }
}

export default TargetData;