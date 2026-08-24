import Stripe from "stripe";

const CURRENCY = "usd";

class StripeBillingService {
    constructor({ prisma, invoiceService }) {
        this.prisma = prisma;
        this.invoiceService = invoiceService;
    }

    get stripe() {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not configured");
        }

        return new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    expectedAmount(invoice) {
        return Math.round(Number(invoice.total) * 100);
    }

    async getInvoiceForToken(token, allowPaid = false) {
        try {
            return await this.invoiceService.validatePaymentToken(token);
        } catch (error) {
            if (!allowPaid) throw error;

            const tokenRecord = await this.prisma.invoiceToken.findFirst({
                where: { tokenHash: token },
                include: { invoice: { include: { tenant: true, plan: true } } }
            });

            if (tokenRecord?.invoice?.status === "Paid") return tokenRecord.invoice;
            throw error;
        }
    }

    async createPaymentIntent(token) {
        const invoice = await this.getInvoiceForToken(token, true);

        if (invoice.status === "Paid") {
            const error = new Error("Invoice has already been paid");
            error.statusCode = 409;
            throw error;
        }

        const amount = this.expectedAmount(invoice);
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error("Invoice amount is invalid");
        }

        if (invoice.stripePaymentIntentId) {
            const existing = await this.stripe.paymentIntents.retrieve(invoice.stripePaymentIntentId);
            if (["requires_payment_method", "requires_confirmation", "requires_action", "processing"].includes(existing.status)) {
                return { clientSecret: existing.client_secret, paymentIntentId: existing.id, amount, currency: CURRENCY };
            }
        }

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency: CURRENCY,
            automatic_payment_methods: { enabled: true },
            receipt_email: invoice.tenant?.email || undefined,
            description: `${invoice.plan?.name || "Subscription"} — ${invoice.billingFrequency} x${invoice.quantity}`,
            metadata: {
                invoiceId: String(invoice.id),
                tenantId: invoice.tenantId,
                planId: invoice.planId,
                billingCycle: invoice.billingFrequency === "Monthly" ? "MONTHLY" : "YEARLY",
                quantity: String(invoice.quantity),
                paymentToken: token
            }
        }, { idempotencyKey: `invoice-${invoice.id}-pi` });

        await this.prisma.invoice.update({
            where: { id: invoice.id },
            data: { stripePaymentIntentId: paymentIntent.id }
        });

        return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id, amount, currency: CURRENCY };
    }

    async confirmPayment(token, paymentIntentId) {
        const invoice = await this.getInvoiceForToken(token, true);
        if (invoice.status === "Paid") return { alreadyPaid: true, invoice };

        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId, { expand: ["latest_charge"] });
        this.assertPaymentIntent(invoice, paymentIntent);
        return this.activate(invoice, token, paymentIntent);
    }

    assertPaymentIntent(invoice, paymentIntent) {
        if (paymentIntent.metadata.invoiceId !== String(invoice.id)) {
            throw new Error("Payment intent does not belong to this invoice");
        }
        if (paymentIntent.status !== "succeeded") {
            throw new Error(`Payment has not completed (status: ${paymentIntent.status})`);
        }
        if (paymentIntent.amount_received !== this.expectedAmount(invoice) || paymentIntent.currency !== CURRENCY) {
            throw new Error("Payment amount or currency does not match the invoice");
        }
    }

    subscriptionEndDate(invoice) {
        if (invoice.billingPeriodEnd) return invoice.billingPeriodEnd;
        const endDate = new Date();
        if (invoice.billingFrequency === "Yearly") endDate.setFullYear(endDate.getFullYear() + invoice.quantity);
        else endDate.setMonth(endDate.getMonth() + invoice.quantity);
        return endDate;
    }

    async activate(invoice, token, paymentIntent) {
        const charge = paymentIntent.latest_charge;
        const card = charge?.payment_method_details?.card;
        const paymentMethodId = typeof paymentIntent.payment_method === "string" ? paymentIntent.payment_method : "";

        return this.prisma.$transaction(async (tx) => {
            const currentInvoice = await tx.invoice.findUnique({ where: { id: invoice.id } });
            if (currentInvoice.status === "Paid") return { alreadyPaid: true, invoice: currentInvoice };

            const paymentMethod = await tx.paymentMethod.create({
                data: {
                    tenantId: invoice.tenantId,
                    cardType: card?.brand || "stripe",
                    lastFourDigits: card?.last4 || "",
                    holderName: null,
                    gatewayToken: paymentMethodId
                }
            });
            const payment = await tx.payment.create({
                data: {
                    tenantId: invoice.tenantId,
                    invoiceId: invoice.id,
                    amount: invoice.total,
                    status: "Successful",
                    gateway: "stripe",
                    transactionId: paymentIntent.id,
                    transactionRef: charge?.id || null,
                    paymentMethodId: paymentMethod.id
                }
            });
            const subscription = await tx.subscription.create({
                data: {
                    tenantId: invoice.tenantId,
                    planId: invoice.planId,
                    status: "ACTIVE",
                    billingCycle: invoice.billingFrequency === "Monthly" ? "MONTHLY" : "YEARLY",
                    startDate: new Date(),
                    endDate: this.subscriptionEndDate(invoice),
                    paymentId: payment.id
                }
            });
            const updatedInvoice = await tx.invoice.update({ where: { id: invoice.id }, data: { status: "Paid", subscriptionId: subscription.id } });
            await tx.invoiceToken.updateMany({ where: { invoiceId: invoice.id, tokenHash: token }, data: { used: true } });
            await tx.tenant.update({ where: { id: invoice.tenantId }, data: { active: true } });
            return { alreadyPaid: false, invoice: updatedInvoice };
        }, { isolationLevel: "Serializable" });
    }

    async handleWebhook(event) {
        try {
            await this.prisma.stripeWebhookEvent.create({ data: { eventId: event.id, type: event.type } });
        } catch (error) {
            if (error.code === "P2002") return;
            throw error;
        }

        try {
            if (event.type === "payment_intent.payment_failed") {
                await this.recordFailedPayment(event.data.object);
                return;
            }
            if (event.type !== "payment_intent.succeeded") return;
            const paymentIntent = await this.stripe.paymentIntents.retrieve(event.data.object.id, { expand: ["latest_charge"] });
            const invoiceId = Number(paymentIntent.metadata.invoiceId);
            const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId }, include: { tenant: true, plan: true } });
            if (!invoice) throw new Error("Invoice not found for Stripe payment intent");
            this.assertPaymentIntent(invoice, paymentIntent);
            await this.activate(invoice, paymentIntent.metadata.paymentToken, paymentIntent);
        } catch (error) {
            await this.prisma.stripeWebhookEvent.deleteMany({ where: { eventId: event.id } });
            throw error;
        }
    }

    async recordFailedPayment(paymentIntent) {
        const invoiceId = Number(paymentIntent.metadata?.invoiceId);
        const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
        if (!invoice || invoice.status === "Paid") return;

        const paymentMethodId = typeof paymentIntent.payment_method === "string" ? paymentIntent.payment_method : "";
        await this.prisma.$transaction(async (tx) => {
            const paymentMethod = await tx.paymentMethod.create({
                data: {
                    tenantId: invoice.tenantId,
                    cardType: "stripe",
                    lastFourDigits: "",
                    holderName: null,
                    gatewayToken: paymentMethodId
                }
            });
            await tx.payment.create({
                data: {
                    tenantId: invoice.tenantId,
                    invoiceId: invoice.id,
                    amount: invoice.total,
                    status: "Failed",
                    gateway: "stripe",
                    transactionId: paymentIntent.id,
                    transactionRef: null,
                    paymentMethodId: paymentMethod.id
                }
            });
        });
    }
}

export default StripeBillingService;
