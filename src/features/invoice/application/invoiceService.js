import Invoice from "../domain/invoice.js";

class InvoiceService {
    constructor({ invoiceRepository, planRepository, invoiceManagementRepository }) {
        this.invoiceRepository = invoiceRepository;
        this.planRepository = planRepository;
        this.invoiceManagementRepository = invoiceManagementRepository;
    }

    async createInvoice(data) {
        const plan = await this.planRepository.findOne({ id: data.planId });

        if (!plan) {
            throw new Error("Plan not found")
        }

        const now = new Date();
        let dueDate;

        if (data.billingFrequency === "Monthly") {
            dueDate = new Date(now);
            dueDate.setMonth(dueDate.getMonth() + data.quantity);
        } else {
            dueDate = new Date(now);
            dueDate.setFullYear(dueDate.getFullYear() + data.quantity);
        }

        const rate = data.billingFrequency === "Monthly" ? plan.pricePerMonth.price : plan.pricePerYear.price
        const total = data.quantity * rate
        const invoiceData = new Invoice({ ...data, total, dueDate })

        const newInvoice = await this.invoiceRepository.create(invoiceData.createInvoice);

        if (!newInvoice) {
            throw new Error("Failed to create invoice");
        }

        return newInvoice;
    }

    async getSingleInvoice(id) {
        const invoice = await this.invoiceRepository.findOneAndPopulate({ id }, { tenant: true, plan: true });
        if (!invoice) {
            throw new Error("Invoice not found")
        }

        const invoiceOutput = new Invoice(invoice)

        return invoiceOutput.createSingleInvoiceOutput;
    }

    async getAllInvoice() {
        const invoice = await this.invoiceRepository.findAll({});

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        return invoice;
    }

    async getTotalBilled(data) {
        const now = new Date();

        if (data) {
            const custom = await this.invoiceRepository.totalBilled({
                createdAt: {
                    gte: data.from,
                    lte: data.to,
                },
            });

            return custom
        }

        const startOfThisYear = new Date(now.getFullYear(), 0, 1);
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - diffToMonday);
        startOfThisWeek.setHours(0, 0, 0, 0);

        const total = await this.invoiceRepository.totalBilled({});
        const thisWeek = await this.invoiceRepository.totalBilled({
            createdAt: {
                gte: startOfThisWeek,
                lte: now,
            },
        });
        const thisMonth = await this.invoiceRepository.totalBilled({
            createdAt: {
                gte: startOfThisMonth,
                lte: now,
            },
        });
        const thisYear = await this.invoiceRepository.totalBilled({
            createdAt: {
                gte: startOfThisYear,
                lte: now,
            },
        });

        if (!total || !thisMonth || !thisWeek || !thisYear) {
            throw new Error("Invoice not found");
        }

        return { allTime: total, thisWeek, thisMonth, thisYear };
    }

    async getTotalDueInvoice(data) {
        const now = new Date();

        if (data) {
            const custom = await this.invoiceRepository.totalBilled({
                createdAt: {
                    gte: data.from,
                    lte: data.to,
                },
                status: "Due"
            });

            return custom
        }

        const startOfThisYear = new Date(now.getFullYear(), 0, 1);
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - diffToMonday);
        startOfThisWeek.setHours(0, 0, 0, 0);

        const total = await this.invoiceRepository.totalBilled({ status: "Due" });
        const thisWeek = await this.invoiceRepository.totalBilled({
            createdAt: {
                gte: startOfThisWeek,
                lte: now,
            },
            status: "Due"
        });
        const thisMonth = await this.invoiceRepository.totalBilled({
            createdAt: {
                gte: startOfThisMonth,
                lte: now,
            },
            status: "Due"
        });
        const thisYear = await this.invoiceRepository.totalBilled({
            createdAt: {
                gte: startOfThisYear,
                lte: now,
            },
            status: "Due"
        });

        if (!total || !thisMonth || !thisWeek || !thisYear) {
            throw new Error("Invoice not found");
        }

        return { allTime: total, thisWeek, thisMonth, thisYear };
    }

    async getAllInvoiceByStatus(status) {
        const query = status ? { status } : {}
        const invoices = await this.invoiceRepository.findAllAndPopulate(query, { tenant: true });


        if (!invoices) {
            throw new Error("Invoices not found");
        }

        const formated = invoices.map((invoice) => {
            return {
                invoiceId: `invoice_${invoice.id}`,
                tenant: invoice.tenant.companyName,
                createdAt: invoice.createdAt,
                dueDate: invoice.dueDate,
                status: invoice.status
            };
        });

        return formated;
    }

    async getTotalByStatus() {
        const All = await this.invoiceRepository.totalCount({});
        const Paid = await this.invoiceRepository.totalCount({ status: "Paid" });
        const Upcoming = await this.invoiceRepository.totalCount({ status: "Upcoming" });
        const Due = await this.invoiceRepository.totalCount({ status: "Due" });
        const Overdue = await this.invoiceRepository.totalCount({ status: "Overdue" });

        if (!All || !Paid || !Upcoming || !Due || !Overdue) {
            throw new Error("Failed to count invoice");
        }

        return { All, Paid, Upcoming, Due, Overdue };
    }

    async createInvoiceManagement(data) {
        const invoiceData = new Invoice(data)

        const newInvoice = await this.invoiceManagementRepository.create(invoiceData.createInvoiceManagement);

        if (!newInvoice) {
            throw new Error("Failed to create invoice");
        }

        return newInvoice;
    }

    async getInvoiceManagement() {
        const invoice = await this.invoiceManagementRepository.findFirst({});
        if (!invoice) {
            throw new Error("Invoice not found")
        }

        return invoice;
    }

    async updateInvoiceManagement(data) {
        const invoiceManagement = await this.invoiceManagementRepository.findOne({ id: data.id })
        if (!invoiceManagement) {
            throw new Error("Invoice Management not found");
        }

        const update = await this.invoiceManagementRepository.update(data.id, {
            onPlanPurchase: data.onPlanPurchase ?? invoiceManagement.onPlanPurchase,
            daysBeforeDueDate: data.daysBeforeDueDate || invoiceManagement.daysBeforeDueDate,
            upcomingInvoiceHeader: data.upcomingInvoiceHeader || invoiceManagement.upcomingInvoiceHeader,
            upcomingInvoiceBody: data.upcomingInvoiceBody || invoiceManagement.upcomingInvoiceBody,
            onDueDate: data.onDueDate ?? invoiceManagement.onDueDate,
            dueInvoiceHeader: data.dueInvoiceHeader || invoiceManagement.dueInvoiceHeader,
            dueInvoiceBody: data.dueInvoiceBody || invoiceManagement.dueInvoiceBody,
            markOverDue: data.markOverDue || invoiceManagement.markOverDue,
            unpaidReminderTimesBefore: data.unpaidReminderTimesBefore || invoiceManagement.unpaidReminderTimesBefore,
            attachInvoiceToReminder: data.attachInvoiceToReminder ?? invoiceManagement.attachInvoiceToReminder,
            reminderEmail: data.reminderEmail || invoiceManagement.reminderEmail
        });

        if (!update) {
            throw new Error("Failed to update Invoice Management");
        }

        return update;
    }
}

export default InvoiceService;