class Billing {
    constructor({ id, tenantId, paymentMethod, billingAddress, billingMetadataId, planId, status, startDate, endDate, name, description, price, billingCycle, transactionId }) {
        this.id = id;
        this.tenantId = tenantId;
        this.paymentMethod = paymentMethod;
        this.billingAddress = billingAddress;
        this.billingMetadataId = billingMetadataId;
        this.planId = planId;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.name = name;
        this.description = description;
        this.price = price;
        this.billingCycle = billingCycle;
        this.transactionId = transactionId;
    }

    get createBillingMetadata() {
        return {
            tenantId: this.tenantId,
            paymentMethod: this.paymentMethod,
            billingAddress: this.billingAddress,
        };
    }

    get createTransaction() {
        return {
            billingMetadataId: this.billingMetadataId
        };
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

    get createBillingPlan() {
        return {
            name: this.name,
            description: this.description,
            price: this.price,
            billingCycle: this.billingCycle,
        };
    }

    get createFeature() {
        return {
            name: this.name,
            description: this.description
        };
    }
}

export default Billing;