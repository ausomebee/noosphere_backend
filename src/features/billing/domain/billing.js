class Billing {
    constructor({ id, tenantId, subscription, createdAt, tenant, invoice, amount, paymentMethod, paymentMethodId, billingAddress, billingMetadataId, planId, status, startDate, endDate, name, description, price, billingCycle, transactionId, invoiceId }) {
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
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.paymentMethodId = paymentMethodId;
        this.tenant = tenant;
        this.invoice = invoice;
        this.subscription = subscription;
        this.createdAt = createdAt;
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
            status: this.status,
            tenantId: this.tenantId,
            amount: this.amount,
            invoiceId: this.invoiceId,
            paymentMethodId: this.paymentMethodId
        };
    }

    get paymentOutput() {
        return {
            Plan: this.invoice.plan.name,
            Period: {
                start: this.subscription?.startDate,
                stop: this.subscription?.endDate
            },
            id: this.id,
            paymentDate: this.createdAt,
            paymentTime: this.createdAt,
            amount: this.amount,
            paymentMethod: { name: this.paymentMethod.cardType, code: `XXXX-XXXX-XXXX-${this.paymentMethod.lastFourDigits}` },
            invoice: { id: this.invoice.id, data: this.invoice }
        };
    }

}

export default Billing;