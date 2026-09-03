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

    // Runs `fn` inside a Serializable transaction, retrying a few times if
    // Postgres aborts the transaction due to a write conflict (Prisma P2034).
    // This matters here because the same invoice can be settled concurrently
    // via the Stripe webhook and the client-facing confirm-payment endpoint.
    async runSerializableTransaction(fn, { retries = 3 } = {}) {
        for (let attempt = 1; attempt <= retries; attempt += 1) {
            try {
                return await this.prisma.$transaction(fn, { isolationLevel: "Serializable" });
            } catch (error) {
                const isConflict = error.code === "P2034";
                if (!isConflict || attempt === retries) throw error;
                await new Promise((resolve) => setTimeout(resolve, 50 * attempt));
            }
        }
    }

    async ensureCustomer(tenant) {
        if (tenant.stripeCustomerId) return tenant.stripeCustomerId;

        const customer = await this.stripe.customers.create({
            email: tenant.email,
            name: tenant.companyName,
            metadata: { tenantId: tenant.id }
        });

        // Guard against a race where two concurrent requests both see no
        // stripeCustomerId and each create a Stripe customer. Only persist ours
        // if nobody has set one in the meantime; otherwise defer to theirs.
        const updateResult = await this.prisma.tenant.updateMany({
            where: { id: tenant.id, stripeCustomerId: null },
            data: { stripeCustomerId: customer.id }
        });

        if (updateResult.count === 0) {
            const current = await this.prisma.tenant.findUnique({ where: { id: tenant.id }, select: { stripeCustomerId: true } });
            if (current?.stripeCustomerId) {
                await this.stripe.customers.del(customer.id).catch(() => {});
                return current.stripeCustomerId;
            }
        }

        return customer.id;
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

        const customerId = invoice.tenant ? await this.ensureCustomer(invoice.tenant) : undefined;

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency: CURRENCY,
            customer: customerId,
            setup_future_usage: customerId ? "off_session" : undefined,
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

        return this.runSerializableTransaction(async (tx) => {
            const currentInvoice = await tx.invoice.findUnique({ where: { id: invoice.id } });
            if (currentInvoice.status === "Paid") return { alreadyPaid: true, invoice: currentInvoice };

            const existingMethodCount = await tx.paymentMethod.count({ where: { tenantId: invoice.tenantId } });

            const paymentMethod = await tx.paymentMethod.create({
                data: {
                    tenantId: invoice.tenantId,
                    cardType: card?.brand || "stripe",
                    lastFourDigits: card?.last4 || "",
                    holderName: null,
                    gatewayToken: paymentMethodId,
                    lastUsedAt: new Date(),
                    isDefault: existingMethodCount === 0
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
        });
    }

    async activateFromSavedCharge(invoice, paymentIntent, paymentMethod) {
        const charge = paymentIntent.latest_charge;

        return this.runSerializableTransaction(async (tx) => {
            const currentInvoice = await tx.invoice.findUnique({ where: { id: invoice.id } });
            if (currentInvoice.status === "Paid") return { alreadyPaid: true, invoice: currentInvoice };

            const payment = await tx.payment.create({
                data: {
                    tenantId: invoice.tenantId,
                    invoiceId: invoice.id,
                    amount: invoice.total,
                    status: "Successful",
                    gateway: "stripe",
                    transactionId: paymentIntent.id,
                    transactionRef: typeof charge === "string" ? charge : charge?.id || null,
                    paymentMethodId: paymentMethod.id
                }
            });

            await tx.paymentMethod.update({ where: { id: paymentMethod.id }, data: { lastUsedAt: new Date() } });

            let subscriptionId = invoice.subscriptionId;

            if (subscriptionId) {
                await tx.subscription.update({
                    where: { id: subscriptionId },
                    data: { status: "ACTIVE", endDate: this.subscriptionEndDate(invoice) }
                });
            } else {
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
                subscriptionId = subscription.id;
            }

            const updatedInvoice = await tx.invoice.update({
                where: { id: invoice.id },
                data: { status: "Paid", subscriptionId, stripePaymentIntentId: paymentIntent.id }
            });
            await tx.tenant.update({
                where: { id: invoice.tenantId },
                data: { active: true, suspended: false, featuresDisabled: false, suspensionReason: null, suspendedAt: null }
            });

            return { alreadyPaid: false, invoice: updatedInvoice };
        });
    }

    async chargeInvoiceWithSavedMethod(invoice, paymentMethod, attemptOffset = 0) {
        const tenant = invoice.tenant;

        if (!tenant?.stripeCustomerId) {
            return { success: false, error: "Tenant has no saved Stripe customer for off-session charges" };
        }

        const amount = this.expectedAmount(invoice);
        if (!Number.isInteger(amount) || amount <= 0) {
            return { success: false, error: "Invoice amount is invalid" };
        }

        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency: CURRENCY,
                customer: tenant.stripeCustomerId,
                payment_method: paymentMethod.gatewayToken,
                off_session: true,
                confirm: true,
                description: `${invoice.plan?.name || "Subscription"} — ${invoice.billingFrequency} x${invoice.quantity}`,
                metadata: {
                    invoiceId: String(invoice.id),
                    tenantId: invoice.tenantId,
                    planId: invoice.planId,
                    billingCycle: invoice.billingFrequency === "Monthly" ? "MONTHLY" : "YEARLY",
                    quantity: String(invoice.quantity),
                    autoCharge: "true"
                }
            }, { expand: ["latest_charge"], idempotencyKey: `invoice-${invoice.id}-autocharge-${paymentMethod.id}-${attemptOffset}` });

            if (paymentIntent.status !== "succeeded") {
                await this.recordFailedCharge(invoice, paymentMethod, `Payment requires action (status: ${paymentIntent.status})`);
                return { success: false, error: `Payment requires action (status: ${paymentIntent.status})` };
            }

            const result = await this.activateFromSavedCharge(invoice, paymentIntent, paymentMethod);
            return { success: true, invoice: result.invoice };
        } catch (error) {
            await this.recordFailedCharge(invoice, paymentMethod, error.message);
            return { success: false, error: error.message };
        }
    }

    async recordFailedCharge(invoice, paymentMethod, errorMessage) {
        await this.prisma.payment.create({
            data: {
                tenantId: invoice.tenantId,
                invoiceId: invoice.id,
                amount: invoice.total,
                status: "Failed",
                gateway: "stripe",
                transactionId: null,
                transactionRef: errorMessage ? errorMessage.slice(0, 250) : null,
                paymentMethodId: paymentMethod.id
            }
        });
    }

    async handleWebhook(event) {
        try {
            await this.prisma.stripeWebhookEvent.create({ data: { eventId: event.id, type: event.type } });
        } catch (error) {
            if (error.code === "P2002") return;
            throw error;
        }

        try {
            switch (event.type) {
                case "payment_intent.payment_failed":
                    await this.recordFailedPayment(event.data.object);
                    return;
                case "payment_intent.succeeded":
                    await this.handlePaymentIntentSucceeded(event.data.object);
                    return;
                case "charge.refunded":
                    await this.handleChargeRefunded(event.data.object);
                    return;
                case "charge.dispute.created":
                case "charge.dispute.closed":
                    await this.handleChargeDispute(event.data.object);
                    return;
                default:
                    return;
            }
        } catch (error) {
            await this.prisma.stripeWebhookEvent.deleteMany({ where: { eventId: event.id } });
            throw error;
        }
    }

    async handlePaymentIntentSucceeded(paymentIntentRef) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentRef.id, { expand: ["latest_charge"] });
        const invoiceId = Number(paymentIntent.metadata.invoiceId);
        const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId }, include: { tenant: true, plan: true } });
        if (!invoice) throw new Error("Invoice not found for Stripe payment intent");
        this.assertPaymentIntent(invoice, paymentIntent);

        if (paymentIntent.metadata.autoCharge === "true") {
            const paymentMethodId = typeof paymentIntent.payment_method === "string" ? paymentIntent.payment_method : "";
            const paymentMethod = await this.prisma.paymentMethod.findFirst({
                where: { tenantId: invoice.tenantId, gatewayToken: paymentMethodId }
            });
            if (paymentMethod) {
                await this.activateFromSavedCharge(invoice, paymentIntent, paymentMethod);
            }
            return;
        }

        await this.activate(invoice, paymentIntent.metadata.paymentToken, paymentIntent);
    }

    // Reflects money actually leaving our Stripe balance back into our own
    // records: without this, an invoice stays "Paid" and the tenant stays
    // active/subscribed even after the customer has been refunded or won a
    // chargeback, which is both a revenue leak and an access-control gap.
    async handleChargeRefunded(charge) {
        const payment = await this.prisma.payment.findFirst({ where: { transactionRef: charge.id } });
        if (!payment) return;

        const fullyRefunded = charge.amount_refunded >= charge.amount;

        await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: { status: fullyRefunded ? "Refunded" : "PartiallyRefunded" }
            });

            if (!fullyRefunded) return;

            const invoice = await tx.invoice.findUnique({ where: { id: payment.invoiceId } });
            if (invoice && invoice.status === "Paid") {
                await tx.invoice.update({ where: { id: invoice.id }, data: { status: "Overdue" } });
            }
        });

        await this.notifyAdminOfChargeback(payment, `Charge ${charge.id} was ${fullyRefunded ? "fully" : "partially"} refunded.`);
    }

    async handleChargeDispute(dispute) {
        const payment = await this.prisma.payment.findFirst({ where: { transactionRef: dispute.charge } });
        if (!payment) return;

        const isClosed = Boolean(dispute.status && dispute.status !== "warning_needs_response" && dispute.status !== "needs_response" && dispute.status !== "under_review");
        const status = !isClosed ? "Disputed" : dispute.status === "won" ? "Successful" : "Refunded";

        await this.prisma.payment.update({ where: { id: payment.id }, data: { status } });

        if (status === "Refunded") {
            const invoice = await this.prisma.invoice.findUnique({ where: { id: payment.invoiceId } });
            if (invoice && invoice.status === "Paid") {
                await this.prisma.invoice.update({ where: { id: invoice.id }, data: { status: "Overdue" } });
            }
        }

        await this.notifyAdminOfChargeback(payment, `Dispute for charge ${dispute.charge} is now '${dispute.status}'.`);
    }

    async notifyAdminOfChargeback(payment, message) {
        try {
            const superAdmin = await this.prisma.admin.findFirst({ where: { superAdmin: true, isDeleted: false, active: true } });
            if (!superAdmin) return;

            await this.prisma.notification.create({
                data: {
                    userId: superAdmin.id,
                    userType: "ADMIN",
                    type: "PAYMENT_CHARGEBACK",
                    title: "Payment refunded or disputed",
                    content: `${message} (invoice INV${payment.invoiceId}, tenant ${payment.tenantId})`,
                    entityType: "PAYMENT",
                    entityId: String(payment.id),
                    isRead: false
                }
            });
        } catch (error) {
            // Never let an admin-notification failure roll back or mask the
            // refund/dispute bookkeeping that already committed above.
            console.error("Failed to notify admin of chargeback:", error);
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
