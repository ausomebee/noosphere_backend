import prismaService from "../../config/prisma.js";
import TokenService from "../../utilities/generate_token.js";
import MailService from "../../utilities/nodemailer.js";
import templateRenderer from "../../utilities/templateRenderer.js";

class SubscriptionInvoiceJob {
    constructor({
        prisma = prismaService.getClient(),
        tokenService = TokenService,
        mailService = MailService,
        renderer = templateRenderer,
        daysBeforeExpiry = 10,
    } = {}) {
        this.prisma = prisma;
        this.tokenService = tokenService;
        this.mailService = mailService;
        this.renderer = renderer;
        this.daysBeforeExpiry = daysBeforeExpiry;
        this.dayInMs = 24 * 60 * 60 * 1000;
    }

    async getConfig() {
        return this.prisma.invoiceManagement.findFirst();
    }

    getTargetDateRange(now = new Date()) {
        const start = new Date(now);
        start.setUTCHours(0, 0, 0, 0);
        start.setUTCDate(start.getUTCDate() + this.daysBeforeExpiry);

        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 1);

        return { start, end };
    }

    getBillingFrequency(billingCycle) {
        return String(billingCycle).toLowerCase().startsWith("year")
            ? "Yearly"
            : "Monthly";
    }

    getPlanTotal(plan, billingFrequency) {
        const price = billingFrequency === "Yearly"
            ? plan.pricePerYear?.price
            : plan.pricePerMonth?.price;

        let total = Number(price ?? 0);

        if (plan.extraFeaturesEnabled && Array.isArray(plan.extraFeaturesWithPrice)) {
            total += plan.extraFeaturesWithPrice.reduce((sum, feature) => {
                const featurePrice = billingFrequency === "Yearly"
                    ? feature.pricePerYear?.price
                    : feature.pricePerMonth?.price;
                return sum + Number(featurePrice ?? 0);
            }, 0);
        }

        return Math.round(total);
    }

    async getOrCreateInvoice(subscription) {
        const key = {
            subscriptionId_billingPeriodEnd: {
                subscriptionId: subscription.id,
                billingPeriodEnd: subscription.endDate,
            },
        };
        const existing = await this.prisma.invoice.findUnique({ where: key });

        if (existing) return existing;

        const billingFrequency = this.getBillingFrequency(subscription.billingCycle);

        try {
            return await this.prisma.invoice.create({
                data: {
                    tenantId: subscription.tenantId,
                    planId: subscription.planId,
                    subscriptionId: subscription.id,
                    billingPeriodEnd: subscription.endDate,
                    dueDate: subscription.endDate,
                    status: "Upcoming",
                    quantity: 1,
                    billingFrequency,
                    total: this.getPlanTotal(subscription.plan, billingFrequency),
                },
            });
        } catch (error) {
            if (error.code === "P2002") {
                return this.prisma.invoice.findUnique({ where: key });
            }
            throw error;
        }
    }

    async emailInvoice(subscription, invoice) {
        if (invoice.emailedAt) return false;

        const expiresAt = new Date(Math.max(
            subscription.endDate.getTime() + this.dayInMs,
            Date.now() + this.dayInMs,
        ));
        const tokenLifetimeSeconds = Math.ceil((expiresAt.getTime() - Date.now()) / 1000);
        const token = this.tokenService.generatePaymentToken(
            { invoiceId: invoice.id },
            tokenLifetimeSeconds,
        );

        await this.prisma.invoiceToken.create({
            data: { invoiceId: invoice.id, tokenHash: token, expiresAt },
        });

        const clientUrl = (process.env.CLIENT_URL || "http://noospherehub.net").replace(/\/$/, "");
        const paymentLink = `${clientUrl}/control/payment/${token}`;
        const html = this.renderer.render("subscription-invoice.html", {
            companyName: subscription.tenant.companyName,
            invoiceNumber: `INV${invoice.id}`,
            planName: subscription.plan.name,
            billingFrequency: invoice.billingFrequency,
            total: Number(invoice.total).toFixed(2),
            dueDate: subscription.endDate.toDateString(),
            paymentLink,
        });
        const result = await this.mailService.sendMail(
            subscription.tenant.email,
            `Subscription invoice INV${invoice.id} - Noosphere`,
            null,
            html,
        );

        if (!result || result.success !== true) {
            throw new Error(typeof result === "string" ? result : "Invoice email was not accepted");
        }

        await this.prisma.invoice.update({
            where: { id: invoice.id },
            data: { emailedAt: new Date() },
        });
        return true;
    }

    async run(now = new Date()) {
        const config = await this.getConfig();

        if (!config || !config.onPlanPurchase) {
            console.log("Subscription invoice job skipped: onPlanPurchase is disabled");
            return { skipped: true };
        }

        const { start, end } = this.getTargetDateRange(now);
        const subscriptions = await this.prisma.subscription.findMany({
            where: {
                status: "ACTIVE",
                endDate: { gte: start, lt: end },
                tenant: { active: true, isDeleted: false },
                OR: [{ mailNotification: true }, { mailNotification: null }],
            },
            include: { tenant: true, plan: true },
        });

        const summary = { matched: subscriptions.length, invoiced: 0, emailed: 0, failed: 0 };

        for (const subscription of subscriptions) {
            try {
                const invoice = await this.getOrCreateInvoice(subscription);
                summary.invoiced += 1;
                if (await this.emailInvoice(subscription, invoice)) summary.emailed += 1;
            } catch (error) {
                summary.failed += 1;
                console.error(`Subscription invoice job failed for ${subscription.id}:`, error);
            }
        }

        console.log("Subscription invoice job completed:", summary);
        return summary;
    }
}

export default SubscriptionInvoiceJob;
