class Invoice {
    constructor({ id, tenantId, dueDate, status, planId, total, quantity, billingFrequency }) {
        this.id = id;
        this.tenantId = tenantId;
        this.dueDate = dueDate;
        this.status = status;
        this.planId = planId;
        this.total = total;
        this.quantity = quantity;
        this.billingFrequency = billingFrequency;
    }

    get createInvoice() {
        return {
            tenantId: this.tenantId,
            dueDate: this.dueDate,
            status: this.status,
            planId: this.planId,
            total: this.total,
            quantity: this.quantity,
            billingFrequency: this.billingFrequency
        };
    }

}

export default Invoice;