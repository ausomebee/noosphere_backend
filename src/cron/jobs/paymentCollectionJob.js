import prismaService from "../../config/prisma.js";
import MailService from "../../utilities/nodemailer.js";
import templateRenderer from "../../utilities/templateRenderer.js";
import SocketService from "../../config/socket.js";
import StripeBillingService from "../../features/billing/application/stripeBillingService.js";
import NotificationsRepository from "../../features/notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../features/notifications/application/notificationsService.js";
import { NotificationEntityType, NotificationType } from "../../features/notifications/domain/notificationTypes.js";

const DAY_MS = 24 * 60 * 60 * 1000;

class PaymentCollectionJob {
    constructor({
        prisma = prismaService.getClient(),
        mailService = MailService,
        renderer = templateRenderer,
        stripeBillingService,
        notificationService,
    } = {}) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.renderer = renderer;
        this.stripeBillingService = stripeBillingService || new StripeBillingService({ prisma: this.prisma, invoiceService: null });
        this.notificationService = notificationService || new NotificationService({
            notificationRepository: new NotificationsRepository(this.prisma.notification),
        });
    }

    startOfDay(date) {
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        return start;
    }

    daysBetween(a, b) {
        return Math.round((this.startOfDay(a).getTime() - this.startOfDay(b).getTime()) / DAY_MS);
    }

    async getPaymentAccessConfig() {
        return this.prisma.paymentAndAccountAccess.findFirst();
    }

    async getMarkOverDueDays() {
        const config = await this.prisma.invoiceManagement.findFirst();
        return config?.markOverDue ?? 7;
    }

    computeBeforeOverdueSchedule(markOverDue, retryBefore) {
        const offsets = [0];
        for (let attempt = 1; attempt <= retryBefore; attempt += 1) {
            offsets.push(Math.round((markOverDue * attempt) / (retryBefore + 1)));
        }
        return [...new Set(offsets)].sort((a, b) => a - b);
    }

    computeAfterOverdueSchedule(markOverDue, cancelAfter, retryAfter) {
        const offsets = [];
        for (let attempt = 1; attempt <= retryAfter; attempt += 1) {
            offsets.push(markOverDue + Math.round((cancelAfter * attempt) / (retryAfter + 1)));
        }
        return [...new Set(offsets)].sort((a, b) => a - b);
    }

    async getOrderedPaymentMethods(tenantId, chargeLastUsedFirst) {
        const methods = await this.prisma.paymentMethod.findMany({ where: { tenantId } });

        if (chargeLastUsedFirst) {
            return [...methods].sort((a, b) => (b.lastUsedAt?.getTime() ?? 0) - (a.lastUsedAt?.getTime() ?? 0));
        }

        return [...methods].sort((a, b) => {
            if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
    }

    isSuspensionPreventingLogin(suspensionAction) {
        return String(suspensionAction || "").toLowerCase().includes("login");
    }

    async notifySystemAdmin(invoice, { type, title, content }) {
        const superAdmin = await this.prisma.admin.findFirst({
            where: { superAdmin: true, isDeleted: false, active: true },
        });

        if (!superAdmin) return;

        await this.notificationService.dispatch({
            recipients: [{ userId: superAdmin.id, userType: "ADMIN" }],
            type,
            title,
            content,
            entityType: NotificationEntityType.INVOICE,
            entityId: invoice.id,
            metadata: { tenantId: invoice.tenantId, invoiceId: invoice.id },
        }, SocketService.emitToUser.bind(SocketService));
    }

    async notifyChargeAttempt(invoice, config, paymentMethod, result) {
        if (!config.notifyTenant) return;

        const cardLabel = `${paymentMethod.cardType} \u2022\u2022\u2022\u2022 ${paymentMethod.lastFourDigits}`;
        const chargeStatus = result.success ? "Succeeded" : "Failed";

        const html = this.renderer.render("account-notice.html", {
            companyName: invoice.tenant.companyName,
            header: config.notificationEmailHeader,
            body: config.notificationEmailBody,
            invoiceNumber: `INV${invoice.id}`,
            total: Number(invoice.total).toFixed(2),
            paymentMethodLabel: cardLabel,
            chargeStatus,
        });

        const mailResult = await this.mailService.sendMail(
            invoice.tenant.email,
            config.notificationEmailHeader,
            null,
            html,
        );

        if (!mailResult || mailResult.success !== true) {
            console.error(`Failed to notify tenant of charge attempt for invoice ${invoice.id}: ${mailResult?.error}`);
        }

        await this.notifySystemAdmin(invoice, {
            type: result.success
                ? NotificationType.PAYMENT_CHARGE_ATTEMPT_SUCCEEDED
                : NotificationType.PAYMENT_CHARGE_ATTEMPT_FAILED,
            title: config.notificationEmailHeader,
            content: `${chargeStatus} charge attempt of $${Number(invoice.total).toFixed(2)} for invoice INV${invoice.id} (${invoice.tenant.companyName}) using ${cardLabel}.`,
        });
    }

    async attemptCharge(invoice, config) {
        const methods = await this.getOrderedPaymentMethods(invoice.tenantId, config.chargeLastUsedFirst);
        if (methods.length === 0) return { attempted: false };

        const candidates = config.chargeAlternative ? methods : methods.slice(0, 1);
        let lastError = null;

        for (const method of candidates) {
            const result = await this.stripeBillingService.chargeInvoiceWithSavedMethod(invoice, method, this.daysBetween(new Date(), invoice.dueDate));
            await this.notifyChargeAttempt(invoice, config, method, result);

            if (result.success) {
                return { attempted: true, success: true };
            }

            lastError = result.error;
        }

        return { attempted: true, success: false, error: lastError };
    }

    async sendWarningEmail(invoice, config) {
        const html = this.renderer.render("account-alert.html", {
            companyName: invoice.tenant.companyName,
            header: config.warningMailHeader,
            body: config.warningMailBody,
        });

        const result = await this.mailService.sendMail(invoice.tenant.email, config.warningMailHeader, null, html);

        if (!result || result.success !== true) {
            console.error(`Failed to send cancellation warning email for invoice ${invoice.id}: ${result?.error}`);
        }
    }

    async runScheduledCharges(config, markOverDue, now) {
        const summary = { matched: 0, succeeded: 0, failed: 0, warned: 0 };

        if (!config.chargeOnDueDate) return summary;

        const beforeOverdueSchedule = this.computeBeforeOverdueSchedule(markOverDue, config.retryBefore || 0);
        const afterOverdueSchedule = this.computeAfterOverdueSchedule(markOverDue, config.cancelAfter || 0, config.retryAfter || 0);
        const scheduledOffsets = new Set([...beforeOverdueSchedule, ...afterOverdueSchedule]);

        const invoices = await this.prisma.invoice.findMany({
            where: {
                status: { in: ["Due", "Overdue"] },
                tenant: { active: true, isDeleted: false },
            },
            include: { tenant: true, plan: true },
        });

        for (const invoice of invoices) {
            const daysSinceDue = this.daysBetween(now, invoice.dueDate);

            if (daysSinceDue < 0 || !scheduledOffsets.has(daysSinceDue)) continue;

            const alreadySent = new Set(invoice.chargeAttemptOffsetsSent || []);
            if (alreadySent.has(daysSinceDue)) continue;

            summary.matched += 1;

            try {
                const result = await this.attemptCharge(invoice, config);
                if (!result.attempted) continue;

                await this.prisma.invoice.update({
                    where: { id: invoice.id },
                    data: {
                        chargeAttemptOffsetsSent: { push: daysSinceDue },
                        lastChargeAttemptAt: now,
                    },
                });

                if (result.success) {
                    summary.succeeded += 1;
                    continue;
                }

                summary.failed += 1;

                const failedAttempts = (invoice.chargeAttemptOffsetsSent || []).length + 1;

                if (
                    config.emailAfterAttempts
                    && failedAttempts >= config.emailAfterAttempts
                    && !invoice.cancellationWarningEmailedAt
                ) {
                    await this.sendWarningEmail(invoice, config);
                    await this.prisma.invoice.update({
                        where: { id: invoice.id },
                        data: { cancellationWarningEmailedAt: now },
                    });
                    summary.warned += 1;
                }
            } catch (error) {
                console.error(`Payment collection charge attempt failed for invoice ${invoice.id}:`, error);
            }
        }

        return summary;
    }

    async applySuspension(tenant, config) {
        const preventLogin = this.isSuspensionPreventingLogin(config.suspensionAction);

        await this.prisma.tenant.update({
            where: { id: tenant.id },
            data: preventLogin
                ? {
                    active: false,
                    suspended: true,
                    featuresDisabled: false,
                    suspensionReason: config.errorMessage,
                    suspendedAt: new Date(),
                }
                : {
                    suspended: true,
                    featuresDisabled: true,
                    suspensionReason: config.errorMessage,
                    suspendedAt: new Date(),
                },
        });
    }

    async sendCancellationEmail(invoice, config) {
        const html = this.renderer.render("account-alert.html", {
            companyName: invoice.tenant.companyName,
            header: config.cancelMailHeader,
            body: config.cancelMailBody,
        });

        const result = await this.mailService.sendMail(invoice.tenant.email, config.cancelMailHeader, null, html);

        if (!result || result.success !== true) {
            console.error(`Failed to send subscription cancellation email for invoice ${invoice.id}: ${result?.error}`);
        }
    }

    async runCancellations(config, markOverDue, now) {
        const summary = { matched: 0, cancelled: 0, skippedManual: 0 };

        if (!config.cancelAfter) return summary;

        const cancelOffset = markOverDue + config.cancelAfter;

        const invoices = await this.prisma.invoice.findMany({
            where: {
                status: "Overdue",
                tenant: { active: true, isDeleted: false },
            },
            include: { tenant: true, subscription: true },
        });

        for (const invoice of invoices) {
            const daysSinceDue = this.daysBetween(now, invoice.dueDate);
            if (daysSinceDue < cancelOffset) continue;
            if (!invoice.subscriptionId || !invoice.subscription || invoice.subscription.status === "CANCELLED") continue;

            summary.matched += 1;

            if (config.manualCancel) {
                summary.skippedManual += 1;
                continue;
            }

            try {
                await this.prisma.subscription.update({
                    where: { id: invoice.subscriptionId },
                    data: { status: "CANCELLED" },
                });

                await this.applySuspension(invoice.tenant, config);

                await this.notifySystemAdmin(invoice, {
                    type: NotificationType.TENANT_ACCOUNT_SUSPENDED,
                    title: "Subscription cancelled for non-payment",
                    content: `Subscription for ${invoice.tenant.companyName} was cancelled and the account was suspended after invoice INV${invoice.id} remained unpaid.`,
                });

                if (config.sendOnSubscriptionCancel) {
                    await this.sendCancellationEmail(invoice, config);
                }

                summary.cancelled += 1;
            } catch (error) {
                console.error(`Failed to cancel subscription for invoice ${invoice.id}:`, error);
            }
        }

        return summary;
    }

    async run(now = new Date()) {
        const config = await this.getPaymentAccessConfig();

        if (!config) {
            console.log("Payment collection job skipped: no PaymentAndAccountAccess configuration found");
            return null;
        }

        const markOverDue = await this.getMarkOverDueDays();

        const charges = await this.runScheduledCharges(config, markOverDue, now);
        const cancellations = await this.runCancellations(config, markOverDue, now);

        const summary = { charges, cancellations };
        console.log("Payment collection job completed:", summary);
        return summary;
    }
}

export default PaymentCollectionJob;
