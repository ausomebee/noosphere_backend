class Subscription {
    constructor({ id, tenantId, planId, status, startDate, endDate, transactionId, billingCycle, paymentId }) {
        this.id = id;
        this.tenantId = tenantId;
        this.planId = planId;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.transactionId = transactionId;
        this.billingCycle = billingCycle;
        this.paymentId = paymentId;
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

}

export default Subscription;