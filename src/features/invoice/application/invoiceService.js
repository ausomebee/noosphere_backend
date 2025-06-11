import Invoice from "../domain/invoice.js";

class InvoiceService {
    constructor({ invoiceRepository, planRepository }) {
        this.invoiceRepository = invoiceRepository;
        this.planRepository = planRepository;
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
        let invoices
        if (status) {
            invoices = await this.invoiceRepository.findAllAndPopulate({ status }, { tenant: true });
        } else {
            invoices = await this.invoiceRepository.findAllAndPopulate({}, { tenant: true });
        }

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

}

export default InvoiceService;