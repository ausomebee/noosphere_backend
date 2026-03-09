class Invoice {
    constructor({ id, tenantId,
        onPlanPurchase,
        daysBeforeDueDate,
        upcomingInvoiceHeader,
        upcomingInvoiceBody,
        onDueDate,
        dueInvoiceHeader,
        dueInvoiceBody,
        markOverDue,
        unpaidReminderTimesBefore,
        attachInvoiceToReminder,
        reminderEmail,
        dueDate, status, planId, total, quantity, billingFrequency, tenant, plan }) {
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
        this.onPlanPurchase = onPlanPurchase;
        this.daysBeforeDueDate = daysBeforeDueDate;
        this.upcomingInvoiceHeader = upcomingInvoiceHeader;
        this.upcomingInvoiceBody = upcomingInvoiceBody;
        this.onDueDate = onDueDate;
        this.dueInvoiceHeader = dueInvoiceHeader;
        this.dueInvoiceBody = dueInvoiceBody;
        this.markOverDue = markOverDue;
        this.unpaidReminderTimesBefore = unpaidReminderTimesBefore;
        this.attachInvoiceToReminder = attachInvoiceToReminder;
        this.reminderEmail = reminderEmail;
    }

    get createInvoice() {
        return {
            tenantId: this.tenantId,
            dueDate: this.dueDate,
            status: this.status || "Upcoming",
            planId: this.planId,
            total: this.total,
            quantity: this.quantity,
            billingFrequency: this.billingFrequency
        };
    }

    get createSingleInvoiceOutput() {
        return {
            companyAddress: {
                street: "931 10th street",
                suite: "Suite 776, Modesto",
                state: "CA 95354",
            },
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

    get createInvoiceManagement() {
        return {
            onPlanPurchase: this.onPlanPurchase,
            daysBeforeDueDate: this.daysBeforeDueDate,
            upcomingInvoiceHeader: this.upcomingInvoiceHeader,
            upcomingInvoiceBody: this.upcomingInvoiceBody,
            onDueDate: this.onDueDate,
            dueInvoiceHeader: this.dueInvoiceHeader,
            dueInvoiceBody: this.dueInvoiceBody,
            markOverDue: this.markOverDue,
            unpaidReminderTimesBefore: this.unpaidReminderTimesBefore,
            attachInvoiceToReminder: this.attachInvoiceToReminder,
            reminderEmail: this.reminderEmail
        }
    }

}

export default Invoice;