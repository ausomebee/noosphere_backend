import prismaService from "../../config/prisma.js";
import TokenService from "../../utilities/generate_token.js";
import MailService from "../../utilities/nodemailer.js";
import templateRenderer from "../../utilities/templateRenderer.js";
import invoicePdfGenerator from "../../utilities/invoicePdfGenerator.js";

const DAY_MS = 24 * 60 * 60 * 1000;

class InvoiceManagementJob {
    constructor({
        prisma = prismaService.getClient(),
        tokenService = TokenService,
        mailService = MailService,
        renderer = templateRenderer,
        pdfGenerator = invoicePdfGenerator,
    } = {}) {
        this.prisma = prisma;
        this.tokenService = tokenService;
        this.mailService = mailService;
        this.renderer = renderer;
        this.pdfGenerator = pdfGenerator;
    }

    startOfDay(date) {
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        return start;
    }

    daysPastDue(now, dueDate) {
        return Math.round((this.startOfDay(now).getTime() - this.startOfDay(dueDate).getTime()) / DAY_MS);
    }

    async getConfig() {
        return this.prisma.invoiceManagement.findFirst();
    }

    async createPaymentLink(invoice) {
        const expiresAt = new Date(Date.now() + DAY_MS);
        const token = this.tokenService.generatePaymentToken({ invoiceId: invoice.id }, 24 * 60 * 60);

        await this.prisma.invoiceToken.create({
            data: { invoiceId: invoice.id, tokenHash: token, expiresAt },
        });

        const clientUrl = (process.env.CLIENT_URL || "http://noospherehub.net").replace(/\/$/, "");
        return `${clientUrl}/control/payment/${token}`;
    }

    async sendInvoiceEmail(invoice, { header, body, attachInvoice = false }) {
        const paymentLink = await this.createPaymentLink(invoice);
        const html = this.renderer.render("invoice-management-notice.html", {
            companyName: invoice.tenant.companyName,
            header,
            body,
            invoiceNumber: `INV${invoice.id}`,
            planName: invoice.plan?.name || "",
            billingFrequency: invoice.billingFrequency,
            total: Number(invoice.total).toFixed(2),
            dueDate: new Date(invoice.dueDate).toDateString(),
            paymentLink,
        });

        let attachments = null;
        if (attachInvoice) {
            const pdfBuffer = await this.pdfGenerator.generate(invoice);
            attachments = [{ filename: `INV${invoice.id}.pdf`, content: pdfBuffer }];
        }

        const result = await this.mailService.sendMail(invoice.tenant.email, header, null, html, attachments);

        if (!result || result.success !== true) {
            throw new Error(typeof result === "string" ? result : "Invoice notification email was not accepted");
        }
    }

    async runUpcomingInvoiceNotifications(config, now) {
        const summary = { matched: 0, sent: 0, failed: 0 };
        if (!config.isDaysBeforeDueDate) return summary;

        const target = this.startOfDay(now);
        target.setUTCDate(target.getUTCDate() + config.daysBeforeDueDate);
        const nextDay = new Date(target.getTime() + DAY_MS);

        const invoices = await this.prisma.invoice.findMany({
            where: {
                status: { in: ["Upcoming", "Due"] },
                dueDate: { gte: target, lt: nextDay },
                upcomingEmailedAt: null,
                tenant: { active: true, isDeleted: false },
            },
            include: { tenant: true, plan: true },
        });

        summary.matched = invoices.length;

        for (const invoice of invoices) {
            try {
                await this.sendInvoiceEmail(invoice, {
                    header: config.upcomingInvoiceHeader,
                    body: config.upcomingInvoiceBody,
                });
                await this.prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { upcomingEmailedAt: new Date() },
                });
                summary.sent += 1;
            } catch (error) {
                summary.failed += 1;
                console.error(`Upcoming invoice notification failed for invoice ${invoice.id}:`, error);
            }
        }

        return summary;
    }

    async runDueInvoiceNotifications(config, now) {
        const summary = { matched: 0, sent: 0, failed: 0 };
        if (!config.onDueDate) return summary;

        const start = this.startOfDay(now);
        const end = new Date(start.getTime() + DAY_MS);

        const invoices = await this.prisma.invoice.findMany({
            where: {
                status: { in: ["Upcoming", "Due"] },
                dueDate: { gte: start, lt: end },
                dueEmailedAt: null,
                tenant: { active: true, isDeleted: false },
            },
            include: { tenant: true, plan: true },
        });

        summary.matched = invoices.length;

        for (const invoice of invoices) {
            try {
                await this.sendInvoiceEmail(invoice, {
                    header: config.dueInvoiceHeader,
                    body: config.dueInvoiceBody,
                });
                await this.prisma.invoice.update({
                    where: { id: invoice.id },
                    data: {
                        dueEmailedAt: new Date(),
                        status: invoice.status === "Upcoming" ? "Due" : invoice.status,
                    },
                });
                summary.sent += 1;
            } catch (error) {
                summary.failed += 1;
                console.error(`Due invoice notification failed for invoice ${invoice.id}:`, error);
            }
        }

        return summary;
    }

    getReminderSchedule(config) {
        const reminders = Array.isArray(config.reminderEmail) ? config.reminderEmail : [];

        return reminders
            .filter((reminder) => reminder && Number.isFinite(Number(reminder.sendOn)))
            .sort((a, b) => Number(a.sendOn) - Number(b.sendOn))
            .slice(0, config.unpaidReminderTimesBefore || reminders.length);
    }

    async runUnpaidReminders(config, now) {
        const summary = { matched: 0, sent: 0, failed: 0 };
        const schedule = this.getReminderSchedule(config);
        if (schedule.length === 0) return summary;

        const invoices = await this.prisma.invoice.findMany({
            where: {
                status: "Due",
                dueDate: { lt: this.startOfDay(now) },
                tenant: { active: true, isDeleted: false },
            },
            include: { tenant: true, plan: true },
        });

        for (const invoice of invoices) {
            const daysOverdue = this.daysPastDue(now, invoice.dueDate);
            const alreadySent = new Set(invoice.overdueRemindersSent || []);
            const dueReminder = schedule.find(
                (reminder) => Number(reminder.sendOn) === daysOverdue && !alreadySent.has(Number(reminder.sendOn)),
            );

            if (!dueReminder) continue;

            summary.matched += 1;

            try {
                await this.sendInvoiceEmail(invoice, {
                    header: dueReminder.header,
                    body: dueReminder.body,
                    attachInvoice: Boolean(config.attachInvoiceToReminder),
                });

                await this.prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { overdueRemindersSent: { push: Number(dueReminder.sendOn) } },
                });

                summary.sent += 1;
            } catch (error) {
                summary.failed += 1;
                console.error(`Unpaid invoice reminder failed for invoice ${invoice.id}:`, error);
            }
        }

        return summary;
    }

    async runMarkOverdue(config, now) {
        const summary = { marked: 0 };
        if (!config.markOverDue) return summary;

        const cutoff = new Date(this.startOfDay(now).getTime() - config.markOverDue * DAY_MS);

        const result = await this.prisma.invoice.updateMany({
            where: {
                status: "Due",
                dueDate: { lte: cutoff },
            },
            data: { status: "Overdue" },
        });

        summary.marked = result.count;
        return summary;
    }

    async run(now = new Date()) {
        const config = await this.getConfig();

        if (!config) {
            console.log("Invoice management job skipped: no configuration found");
            return null;
        }

        const upcoming = await this.runUpcomingInvoiceNotifications(config, now);
        const due = await this.runDueInvoiceNotifications(config, now);
        const reminders = await this.runUnpaidReminders(config, now);
        const overdue = await this.runMarkOverdue(config, now);

        const summary = { upcoming, due, reminders, overdue };
        console.log("Invoice management job completed:", summary);
        return summary;
    }
}

export default InvoiceManagementJob;
