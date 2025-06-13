class Subscription {
    constructor({ id, tenantId, reason, comment, planId, status, startDate, endDate, transactionId, billingCycle, paymentId }) {
        this.id = id;
        this.tenantId = tenantId;
        this.planId = planId;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.transactionId = transactionId;
        this.billingCycle = billingCycle;
        this.paymentId = paymentId;
        this.reason = reason;
        this.comment = comment;
    }
    
    get createSubscription() {
        return {
            tenantId: this.tenantId,
            planId: this.planId,
            status: this.status,
            startDate: this.startDate,
            endDate: this.endDate,
            transactionId: this.transactionId,
            billingCycle: this.billingCycle,
            paymentId: this.paymentId
        };
    }

    get createLog() {
        return {
            adminId: this.adminId,
            reason: this.reason,
            action: "change subscription status",
            details: this.comment
        };
    }

}

export default Subscription;