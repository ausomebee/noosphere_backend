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

    async ensureCustomer(tenant) {
        if (tenant.stripeCustomerId) return tenant.stripeCustomerId;

        const customer = await this.stripe.customers.create({
            email: tenant.email,
            name: tenant.companyName,
            metadata: { tenantId: tenant.id }
        });

        await this.prisma.tenant.update({
            where: { id: tenant.id },
            data: { stripeCustomerId: customer.id }
        });

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

        return this.prisma.$transaction(async (tx) => {
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
        }, { isolationLevel: "Serializable" });
    }

    async activateFromSavedCharge(invoice, paymentIntent, paymentMethod) {
        const charge = paymentIntent.latest_charge;

        return this.prisma.$transaction(async (tx) => {
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
        }, { isolationLevel: "Serializable" });
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
