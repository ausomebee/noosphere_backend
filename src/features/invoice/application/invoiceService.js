import e from "express";
import TokenService from "../../../utilities/generate_token.js";
import Invoice from "../domain/invoice.js";
import MailService from "../../../utilities/nodemailer.js";
import templateRenderer from "../../../utilities/templateRenderer.js";

class InvoiceService {
    constructor({ invoiceRepository, planRepository, invoiceManagementRepository, invoiceTokenRepository, tenantRepository }) {
        this.invoiceRepository = invoiceRepository;
        this.planRepository = planRepository;
        this.invoiceManagementRepository = invoiceManagementRepository;
        this.invoiceTokenRepository = invoiceTokenRepository;
        this.tenantRepository = tenantRepository;
        this.token = TokenService;
    }

    async createInvoice(data) {
        const plan = await this.planRepository.findOne({ id: data.planId });

        if (!plan) {
            throw new Error("Plan not found");
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

        const rate =
            data.billingFrequency === "Monthly"
                ? plan.pricePerMonth.price
                : plan.pricePerYear.price;

        let total = data.quantity * rate;

        if (plan.extraFeaturesEnabled && plan.extraFeaturesWithPrice) {
            const extraFeatures = plan.extraFeaturesWithPrice;

            const extraTotal = extraFeatures.reduce((sum, feature) => {
                const price =
                    data.billingFrequency === "Monthly"
                        ? feature.pricePerMonth.price
                        : feature.pricePerYear.price;

                return sum + price * data.quantity;
            }, 0);

            total += extraTotal;
        }

        const invoiceData = new Invoice({
            ...data,
            total,
            dueDate
        });

        const newInvoice = await this.invoiceRepository.create(
            invoiceData.createInvoice
        );

        if (!newInvoice) {
            throw new Error("Failed to create invoice");
        }

        return newInvoice;
    }

    async updateInvoice(data) {
        const invoice = await this.invoiceRepository.findOne({ id: data.id })
        if (!invoice) {
            throw new Error("Invoice not found");
        }

        const update = await this.invoiceRepository.update(data.id, {
            status: data.status || invoice.status,
        });

        if (!update) {
            throw new Error("Failed to update Invoice");
        }

        return update;
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

    async generatePaymentLink(data) {
        const plan = await this.planRepository.findOne({ id: data.planId });

        if (!plan) {
            throw new Error("Plan not found");
        }

        const now = new Date();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        const dueDate = new Date(now.getTime() + ONE_DAY);

        const rate =
            data.billingFrequency === "Monthly"
                ? plan.pricePerMonth.price
                : plan.pricePerYear.price;

        let total = data.quantity * rate;

        if (plan.extraFeaturesEnabled && plan.extraFeaturesWithPrice) {
            const extraFeatures = plan.extraFeaturesWithPrice;

            const extraTotal = extraFeatures.reduce((sum, feature) => {
                const price =
                    data.billingFrequency === "Monthly"
                        ? feature.pricePerMonth.price
                        : feature.pricePerYear.price;

                return sum + price * data.quantity;
            }, 0);

            total += extraTotal;
        }

        const invoiceData = new Invoice({
            ...data,
            total,
            dueDate
        });

        const newInvoice = await this.invoiceRepository.create(
            invoiceData.createInvoice
        );

        if (!newInvoice) {
            throw new Error("Failed to create invoice");
        }

        const tok = this.token.generatePaymentToken({
            invoiceId: newInvoice.id
        });

        const tokenData = {
            invoiceId: newInvoice.id,
            tokenHash: tok,
            expiresAt: new Date(Date.now() + ONE_DAY)
        };

        const token = await this.invoiceTokenRepository.create(tokenData);

        if (!token) {
            throw new Error("Failed to create payment link");
        }

        const paymentLink = `http://noospherehub.net/control/payment/${tok}`;

        const tenant = await this.tenantRepository.findOne({ id: data.tenantId });

        if (tenant) {
            const html = templateRenderer.render('invoice-payment-link.html', {
                companyName: tenant.companyName,
                planName: plan.planType,
                billingFrequency: data.billingFrequency || 'Monthly',
                total: total.toFixed(2),
                dueDate: dueDate.toDateString(),
                paymentLink
            });

            await MailService.sendMail(
                tenant.email,
                'Your Payment Link - Noosphere',
                null,
                html
            );
        }

        return paymentLink;
    }

    async validatePaymentToken(token) {
        const decoded = this.token.validatePaymentToken(token);

        const tokenRecord = await this.invoiceTokenRepository.findFirst({ invoiceId: decoded.invoiceId, tokenHash: token });

        if (!tokenRecord) {
            throw new Error("Invalid token");
        }

        if (tokenRecord.expiresAt < new Date()) {
            throw new Error("Token expired");
        }

        if (tokenRecord.used) {
            throw new Error("Token has already been used");
        }

        const invoice = await this.invoiceRepository.findOneAndPopulate(
            { id: decoded.invoiceId },
            {
                tenant: true,
                plan: {
                    include: {
                        features: true
                    }
                }
            }
        );

        if (!invoice) {
            throw new Error("Invoice not found")
        }

        return invoice;
    }

    async regeneratePaymentLink(tenantId) {
        const invoice = await this.invoiceRepository.findFirst(
            { tenantId: tenantId },
            { orderBy: { createdAt: 'desc' } }
        );

        if (!invoice) {
            throw new Error("Invoice not found")
        }

        const tok = this.token.generatePaymentToken({
            invoiceId: invoice.id,
        });

        const tokenData = {
            invoiceId: invoice.id,
            tokenHash: tok,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }

        const token = await this.invoiceTokenRepository.create(tokenData);

        if (!token) {
            throw new Error("Failed to create payment link");
        }

        const paymentLink = `http://noospherehub.net/control/payment/${tok}`;

        const [tenant, plan] = await Promise.all([
            this.tenantRepository.findOne({ id: tenantId }),
            this.planRepository.findOne({ id: invoice.planId })
        ]);

        if (tenant) {
            const html = templateRenderer.render('invoice-payment-link.html', {
                companyName: tenant.companyName,
                planName: plan?.planType ?? '',
                billingFrequency: invoice.billingFrequency || 'Monthly',
                total: Number(invoice.total).toFixed(2),
                dueDate: new Date(invoice.dueDate).toDateString(),
                paymentLink
            });

            await MailService.sendMail(
                tenant.email,
                'Your Payment Link - Noosphere',
                null,
                html
            );
        }

        return paymentLink;
    }

    async getInvoiceTokenHistory(tenantId) {
        const history = await this.invoiceRepository.getInvoiceTokenHistory(tenantId);

        if (!history) {
            throw new Error("Failed to fetch invoice token history");
        }

        return history;
    }

    async markLatestTokenAsUsed(invoiceId) {
        const invoice = await this.invoiceTokenRepository.markLatestTokenAsUsed(invoiceId);

        if (!invoice) {
            throw new Error("failed to update invoice token");
        }

        return invoice;
    }

    async getTenantInvoices(tenantId, filter = {}, page = 1, pageSize = 10) {
        const invoices = await this.invoiceRepository.getTenantInvoices(
            tenantId,
            filter,
            page,
            pageSize
        );

        if (!invoices) {
            throw new Error("No invoices found for this tenant");
        }

        return invoices;
    }

    async getAllInvoices(page = 1, pageSize = 10) {
        const invoices = await this.invoiceRepository.getAllInvoices(
            page,
            pageSize
        );

        if (!invoices || invoices.data.length === 0) {
            throw new Error("No invoices found");
        }

        return invoices;
    }

    async getTenantInvoicesByStatus(tenantId, status, page = 1, pageSize = 10) {
        return await this.getTenantInvoices(tenantId, { status }, page, pageSize);
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
            const invoiceData = new Invoice(
                {
                    "onPlanPurchase": true,
                    "daysBeforeDueDate": 5,
                    "upcomingInvoiceHeader": "Upcoming Invoice Reminder",
                    "upcomingInvoiceBody": "Hello, this is a reminder that your invoice is coming up soon.",
                    "onDueDate": true,
                    "dueInvoiceHeader": "Invoice Due Today",
                    "dueInvoiceBody": "Your invoice is due today. Please make payment to avoid penalties.",
                    "markOverDue": 7,
                    "unpaidReminderTimesBefore": 3,
                    "attachInvoiceToReminder": true,
                    "reminderEmail": [
                        {
                            "sendOn": 1,
                            "header": "First Overdue Reminder",
                            "body": "Your invoice is 1 day overdue. Please pay as soon as possible."
                        },
                        {
                            "sendOn": 3,
                            "header": "Second Overdue Reminder",
                            "body": "Your invoice is 3 days overdue. Kindly settle your payment."
                        },
                        {
                            "sendOn": 7,
                            "header": "Final Overdue Reminder",
                            "body": "Your invoice is 7 days overdue. Further action may be taken."
                        }
                    ]
                }
            )

            const newInvoice = await this.invoiceManagementRepository.create(invoiceData.createInvoiceManagement);

            if (!newInvoice) {
                throw new Error("Failed to create invoice");
            }

            return newInvoice;
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