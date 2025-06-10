class Invoice {
    constructor({ id, tenantId, dueDate, status, planId, total, quantity, billingFrequency, tenant, plan }) {
        this.id = id;
        this.tenantId = tenantId;
        this.dueDate = dueDate;
        this.status = status;
        this.planId = planId;
        this.total = total;
        this.quantity = quantity;
        this.billingFrequency = billingFrequency;
        this.tenant = tenant;
        this.plan = plan;
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

    get createSingleInvoiceOutput() {
        return {
            companyAddress: this.tenant.location,
            invoiceId: `INV${this.id}`,
            dueDate: this.dueDate,
            billingFrequency: this.billingFrequency,
            customerInfo: {
                name: this.tenant.companyName,
                street: this.tenant.location.address,
                city: this.tenant.location.city,
                zip: this.tenant.location.zip,
            },
            items: [
                {
                    id: this.plan.id,
                    description: this.plan.description,
                    rate: this.billingFrequency === "Monthly" ? this.plan.pricePerMonth : this.plan.pricePerYear,
                    quantity: this.quantity,
                    price: this.billingFrequency === "Monthly" ? this.plan.pricePerMonth.price * this.quantity : this.plan.pricePerYear.price * this.quantity,
                }
            ],
            total: this.total,
        };
    }
}

export default Invoice;