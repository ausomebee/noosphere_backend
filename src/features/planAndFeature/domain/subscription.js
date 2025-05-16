class Subscription {
    constructor({ id, tenantId, planId, status, startDate, endDate }) {
        this.id = id;
        this.tenantId = tenantId;
        this.planId = planId;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    
    get createSubscription() {
        return {
            tenantId: this.tenantId,
            planId: this.planId,
            status: this.status,
            startDate: this.startDate,
            endDate: this.endDate,
            transactionId: this.transactionId
        };
    }

}

export default Subscription;