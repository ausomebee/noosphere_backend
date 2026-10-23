class TimesheetHistory {
    constructor({
        id,
        sessionId,
        action,
        details,
        createdBy,
        createdAt,
    }) {
        this.id = id;
        this.sessionId = sessionId;
        this.action = action;
        this.details = details;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    get createTimesheetHistory() {
        return {
            sessionId: this.sessionId,
            action: this.action,
            details: this.details,
            createdBy: this.createdBy,
        };
    }
}

export default TimesheetHistory;
