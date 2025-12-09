class SessionData {
    constructor({ id, sessionId, data, targetId, createdAt, updatedAt }) {
        this.id = id;
        this.sessionId = sessionId;
        this.data = data;
        this.targetId = targetId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createSessionData() {
        return {
            sessionId: this.sessionId,
            data: this.data,
            targetId: this.targetId,
        };
    }
}

export default SessionData;
