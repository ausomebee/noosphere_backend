class Invoice {
    constructor({ id, tenantId, dueDate, status, planId }) {
        this.id = id;
        this.tenantId = tenantId;
        this.dueDate = dueDate;
        this.status = status;
        this.planId = planId;
    }

    get createInvoice() {
        return {
            tenantId: this.tenantId,
            dueDate: this.dueDate,
            status: this.status,
            planId: this.planId
        };
    }

}

export default Invoice;