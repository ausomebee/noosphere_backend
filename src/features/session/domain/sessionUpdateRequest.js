class SessionUpdateRequest {
    constructor({
        id,
        sessionId,
        requestedBy,
        createdAt,
        updatedAt,
        description
    }) {
        this.id = id;
        this.sessionId = sessionId;
        this.requestedBy = requestedBy;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createSessionUpdateRequest() {
        return {
            sessionId: this.sessionId,
            requestedBy: this.requestedBy,
            description: this.description
        };
    }
}

export default SessionUpdateRequest;
