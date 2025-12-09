class Session {
    constructor({
        id,
        note,
        appointmentId,
        supervisorApprovalStatus,
        clientApprovalStatus,
        supervisorId,
        startTime,
        endTime,
        travelStartTime,
        travelEndTime,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.note = note;
        this.appointmentId = appointmentId;
        this.supervisorApprovalStatus = supervisorApprovalStatus;
        this.clientApprovalStatus = clientApprovalStatus;
        this.supervisorId = supervisorId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.travelStartTime = travelStartTime;
        this.travelEndTime = travelEndTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createSession() {
        return {
            note: this.note,
            appointmentId: this.appointmentId,
            supervisorApprovalStatus: this.supervisorApprovalStatus,
            clientApprovalStatus: this.clientApprovalStatus,
            supervisorId: this.supervisorId,
            startTime: this.startTime,
            endTime: this.endTime,
            travelStartTime: this.travelStartTime,
            travelEndTime: this.travelEndTime,
        };
    }
}

export default Session;
