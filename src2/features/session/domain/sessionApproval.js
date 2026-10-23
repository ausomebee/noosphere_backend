class SessionApproval {
    constructor({
        id,
        sessionId,
        confirmDelivery,
        rateService,
        rateTherapist,
        feedback,
        signature,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.sessionId = sessionId;
        this.confirmDelivery = confirmDelivery;
        this.rateService = rateService;
        this.rateTherapist = rateTherapist;
        this.feedback = feedback;
        this.signature = signature;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get createSessionApproval() {
        return {
            sessionId: this.sessionId,
            confirmDelivery: this.confirmDelivery,
            rateService: this.rateService,
            rateTherapist: this.rateTherapist,
            feedback: this.feedback,
            signature: this.signature,
        };
    }
}

export default SessionApproval;
