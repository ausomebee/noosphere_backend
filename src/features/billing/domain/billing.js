class Billing {
    constructor({ id, tenantId, paymentMethod, billingAddress, billingMetadataId, planId, status, startDate, endDate, name, description, price, billingCycle, transactionId, paymentLink }) {
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
        this.paymentLink = paymentLink;
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

    get createPayment() {
        return {
            paymentLink: this.paymentLink,
            tenantId: this.tenantId
        };
    }
}

export default Billing;