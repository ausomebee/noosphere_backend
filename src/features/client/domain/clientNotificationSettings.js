class ClientNotificationSettings {
    constructor({ 
        id, 
        tenantClientId, 
        reschedule, 
        starts, 
        completed, 
        awaitingReview, 
        approvedReschedule, 
        createdAt, 
        updatedAt 
    }) {
        this.id = id;
        this.tenantClientId = tenantClientId;
        this.reschedule = reschedule;
        this.starts = starts;
        this.completed = completed;
        this.awaitingReview = awaitingReview;
        this.approvedReschedule = approvedReschedule;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createNotificationSettings() {
        return {
            tenantClientId: this.tenantClientId,
            reschedule: this.reschedule,
            starts: this.starts,
            completed: this.completed,
            awaitingReview: this.awaitingReview,
            approvedReschedule: this.approvedReschedule
        };
    }
}

export default ClientNotificationSettings;
